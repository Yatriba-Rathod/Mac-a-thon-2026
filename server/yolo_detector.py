import numpy as np
import logging
import cv2 as open_cv

try:
    from ultralytics import YOLO
except Exception:
    YOLO = None

try:
    from mongo_db import ParkingDB
except ImportError:
    ParkingDB = None

from drawing_utils import draw_contours
from colors import COLOR_BLUE, COLOR_GREEN, COLOR_WHITE


class YOLODetector:
    """YOLO-based parking spot occupancy detector.

    Requires the `ultralytics` package and a YOLO model file (e.g., `yolov8n.pt`).
    This class filters detections to vehicle classes and marks a spot occupied
    when the detection box overlaps the spot polygon by a configurable fraction.
    """

    OVERLAP_THRESHOLD = 0.2

    # COCO vehicle class names (common)
    VEHICLE_NAMES = set(["car", "truck", "bus", "motorcycle", "bicycle"])

    def __init__(self, video, coordinates, start_frame, model_path="yolov8n.pt", conf=0.25, lot_id=None, use_db=False, mongo_uri=None):
        if YOLO is None:
            raise ImportError("ultralytics package is required for YOLO mode. Install with: pip install ultralytics")

        self.video = video
        self.coordinates_data = coordinates
        self.start_frame = start_frame
        self.model_path = model_path
        self.conf = float(conf)
        self.lot_id = lot_id
        self.use_db = use_db
        self.db = None
        
        if use_db:
            if ParkingDB is None:
                logging.warning("MongoDB integration not available. Install pymongo.")
            else:
                try:
                    self.db = ParkingDB(connection_string=mongo_uri )
                except Exception as e:
                    logging.error(f"Failed to connect to MongoDB: {e}")
                    self.db = None

        self.bounds = []
        self.masks = []

    def detect_yolo(self):
        model = YOLO(self.model_path)

        # prepare per-spot masks
        for p in self.coordinates_data:
            coords = np.array(p["coordinates"])  # Nx2
            rect = open_cv.boundingRect(coords)
            new_coords = coords.copy()
            new_coords[:, 0] = coords[:, 0] - rect[0]
            new_coords[:, 1] = coords[:, 1] - rect[1]

            mask = open_cv.drawContours(
                np.zeros((rect[3], rect[2]), dtype=np.uint8),
                [new_coords],
                contourIdx=-1,
                color=255,
                thickness=-1,
                lineType=open_cv.LINE_8)

            mask = mask == 255
            self.bounds.append(rect)
            self.masks.append(mask)

        capture = open_cv.VideoCapture(self.video)
        
        # Check if video opened successfully
        if not capture.isOpened():
            raise Exception(f"Failed to open video file: {self.video}. Check if file exists and codec is supported.")
        
        # Print video properties for debugging
        fps = capture.get(open_cv.CAP_PROP_FPS)
        frame_count = int(capture.get(open_cv.CAP_PROP_FRAME_COUNT))
        width = int(capture.get(open_cv.CAP_PROP_FRAME_WIDTH))
        height = int(capture.get(open_cv.CAP_PROP_FRAME_HEIGHT))
        logging.info(f"Video: {self.video} | FPS: {fps} | Frames: {frame_count} | Resolution: {width}x{height}")
        
        capture.set(open_cv.CAP_PROP_POS_FRAMES, self.start_frame)

        statuses = [False] * len(self.coordinates_data)
        previous_statuses = [None] * len(self.coordinates_data)  # Track previous state
        frame_count = 0

        while capture.isOpened():
            frame_count += 1
            result, frame = capture.read()
            if frame is None:
                break

            if not result:
                raise Exception("Error reading video capture")

            # Run YOLO on the frame
            results = model.predict(frame, conf=self.conf, imgsz=640, verbose=False)

            # collect vehicle boxes
            boxes = []  # list of (x1,y1,x2,y2)
            for r in results:
                # r.boxes may be empty
                boxes_data = getattr(r, "boxes", None)
                if boxes_data is None:
                    continue

                # boxes_data.xyxy, boxes_data.conf, boxes_data.cls
                xyxy = boxes_data.xyxy.cpu().numpy() if hasattr(boxes_data.xyxy, "cpu") else np.array(boxes_data.xyxy)
                confs = boxes_data.conf.cpu().numpy() if hasattr(boxes_data.conf, "cpu") else np.array(boxes_data.conf)
                cls_ids = boxes_data.cls.cpu().numpy() if hasattr(boxes_data.cls, "cpu") else np.array(boxes_data.cls)

                for (x1, y1, x2, y2), conf, cls_id in zip(xyxy, confs, cls_ids):
                    name = model.names.get(int(cls_id), str(int(cls_id)))
                    if name in YOLODetector.VEHICLE_NAMES and conf >= self.conf:
                        boxes.append((int(x1), int(y1), int(x2), int(y2)))

            # determine status per spot
            for index, p in enumerate(self.coordinates_data):
                rect = self.bounds[index]
                spot_mask = self.masks[index]
                spot_area = float(spot_mask.sum()) if spot_mask.sum() > 0 else 1.0

                occupied = False
                for (bx1, by1, bx2, by2) in boxes:
                    # compute bbox intersection within spot rect
                    x1 = max(bx1, rect[0]); y1 = max(by1, rect[1])
                    x2 = min(bx2, rect[0] + rect[2]); y2 = min(by2, rect[1] + rect[3])
                    if x2 <= x1 or y2 <= y1:
                        continue

                    # create bbox boolean mask clipped to spot
                    bx_rel1 = x1 - rect[0]; by_rel1 = y1 - rect[1]
                    bx_rel2 = x2 - rect[0]; by_rel2 = y2 - rect[1]

                    try:
                        bbox_mask = np.zeros_like(spot_mask, dtype=bool)
                        bbox_mask[by_rel1:by_rel2, bx_rel1:bx_rel2] = True
                    except Exception:
                        bbox_mask = np.zeros_like(spot_mask, dtype=bool)

                    intersection = np.logical_and(spot_mask, bbox_mask).sum()
                    overlap = intersection / spot_area
                    if overlap >= YOLODetector.OVERLAP_THRESHOLD:
                        occupied = True
                        break

                statuses[index] = occupied
            
            # Update MongoDB only when status changes (not every frame or time interval)
            if self.use_db and self.db and self.lot_id:
                try:
                    for index, p in enumerate(self.coordinates_data):
                        # Only update if status changed
                        if statuses[index] != previous_statuses[index]:
                            self.db.update_spot_status(
                                lot_id=self.lot_id,
                                spot_id=str(p["id"]),
                                occupied=statuses[index],
                                video_file=self.video
                            )
                            previous_statuses[index] = statuses[index]
                except Exception as e:
                    logging.error(f"Failed to update MongoDB: {e}")

            new_frame = frame.copy()
            for index, p in enumerate(self.coordinates_data):
                coords = np.array(p["coordinates"])
                border = COLOR_BLUE if statuses[index] else COLOR_GREEN
                draw_contours(new_frame, coords, str(p["id"] + 1), COLOR_WHITE, border)

            open_cv.imshow(str(self.video) + " - yolo", new_frame)
            k = open_cv.waitKey(1)
            if k == ord('q'):
                break

        capture.release()
        open_cv.destroyAllWindows()


class YOLODetectorError(Exception):
    pass
