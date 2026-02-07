import cv2

# 0 is usually the default webcam
# If you have multiple cameras, try 1, 2, etc.
cap = cv2.VideoCapture(1)
if not cap.isOpened():
    print("Can't open the camera")
    exit()

   
# Optional: resize for faster processing
frame_width = 640
frame_height = 480

# Define a ROI (Region of Interest) for your "parking spot"
# You can adjust x, y, w, h based on where your parking spot appears in the frame
x, y, w, h = 200, 150, 200, 150

# Create a background subtractor for occupancy detection
fgbg = cv2.createBackgroundSubtractorMOG2(history=100, varThreshold=50, detectShadows=False)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Show the frame at original resolution
    cv2.imshow("Camera Test", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break 

    # ret, frame = cap.read()
    # if not ret:
    #     print("Failed to grab frame")
    #     break

    # Resize for consistency
    frame = cv2.resize(frame, (frame_width, frame_height))

    # Crop to ROI
    roi = frame[y:y+h, x:x+w]

    # Apply background subtraction
    mask = fgbg.apply(roi)

    # Count non-zero pixels to determine occupancy
    non_zero_count = cv2.countNonZero(mask)
    threshold = 500  # Adjust this based on your test objects

    if non_zero_count > threshold:
        status = "Occupied"
        color = (0, 0, 255)  # Red
    else:
        status = "Free"
        color = (0, 255, 0)  # Green

    # Draw rectangle and status text on original frame
    cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
    cv2.putText(frame, f"Status: {status}", (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # Show the frame
    cv2.imshow("Frame", frame)
    cv2.imshow("Parking Spot Detection", frame)
    cv2.imshow("ROI Mask", mask)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
