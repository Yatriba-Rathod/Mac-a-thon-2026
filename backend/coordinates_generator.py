import cv2 as open_cv
import numpy as np
import logging

from colors import COLOR_WHITE
from drawing_utils import draw_contours

try:
    from mongo_db import ParkingDB
except ImportError:
    ParkingDB = None


class CoordinatesGenerator:
    KEY_RESET = ord("r")
    KEY_QUIT = ord("q")

    def __init__(self, image, output, color, lot_id=None, lot_name=None, use_db=False, mongo_uri=None):
        self.output = output
        self.caption = image
        self.color = color
        self.lot_id = lot_id
        self.lot_name = lot_name
        self.use_db = use_db
        self.db = None
        
        if use_db:
            if ParkingDB is None:
                logging.warning("MongoDB integration not available. Install pymongo.")
            else:
                try:
                    self.db = ParkingDB(connection_string=mongo_uri or "mongodb://localhost:27017/")
                except Exception as e:
                    logging.error(f"Failed to connect to MongoDB: {e}")
                    self.db = None

        self.image = open_cv.imread(image).copy()
        self.image_height, self.image_width = self.image.shape[:2]
        self.click_count = 0
        self.ids = 0
        self.coordinates = []
        self.all_spots = []

        open_cv.namedWindow(self.caption, open_cv.WINDOW_GUI_EXPANDED)
        open_cv.setMouseCallback(self.caption, self.__mouse_callback)

    def generate(self):
        while True:
            open_cv.imshow(self.caption, self.image)
            key = open_cv.waitKey(0)

            if key == CoordinatesGenerator.KEY_RESET:
                self.image = self.image.copy()
            elif key == CoordinatesGenerator.KEY_QUIT:
                break
        open_cv.destroyWindow(self.caption)
        
        # Save to MongoDB if enabled
        if self.use_db and self.db and self.lot_id and self.all_spots:
            try:
                self.db.save_lot_definition(
                    lot_id=self.lot_id,
                    name=self.lot_name or self.lot_id,
                    spots=self.all_spots,
                    image_width=self.image_width,
                    image_height=self.image_height
                )
                logging.info(f"Saved to MongoDB: {self.lot_id}")
            except Exception as e:
                logging.error(f"Failed to save to MongoDB: {e}")

    def __mouse_callback(self, event, x, y, flags, params):

        if event == open_cv.EVENT_LBUTTONDOWN:
            self.coordinates.append((x, y))
            self.click_count += 1

            if self.click_count >= 4:
                self.__handle_done()

            elif self.click_count > 1:
                self.__handle_click_progress()

        open_cv.imshow(self.caption, self.image)

    def __handle_click_progress(self):
        open_cv.line(self.image, self.coordinates[-2], self.coordinates[-1], (255, 0, 0), 1)

    def __handle_done(self):
        open_cv.line(self.image,
                     self.coordinates[2],
                     self.coordinates[3],
                     self.color,
                     1)
        open_cv.line(self.image,
                     self.coordinates[3],
                     self.coordinates[0],
                     self.color,
                     1)

        self.click_count = 0

        coordinates = np.array(self.coordinates)

        self.output.write("-\n          id: " + str(self.ids) + "\n          coordinates: [" +
                          "[" + str(self.coordinates[0][0]) + "," + str(self.coordinates[0][1]) + "]," +
                          "[" + str(self.coordinates[1][0]) + "," + str(self.coordinates[1][1]) + "]," +
                          "[" + str(self.coordinates[2][0]) + "," + str(self.coordinates[2][1]) + "]," +
                          "[" + str(self.coordinates[3][0]) + "," + str(self.coordinates[3][1]) + "]]\n")

        draw_contours(self.image, coordinates, str(self.ids + 1), COLOR_WHITE)
        
        # Store spot data for MongoDB
        self.all_spots.append({
            "id": self.ids,
            "coordinates": [[int(c[0]), int(c[1])] for c in self.coordinates]
        })

        for i in range(0, 4):
            self.coordinates.pop()

        self.ids += 1