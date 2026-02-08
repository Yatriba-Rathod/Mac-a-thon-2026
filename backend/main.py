import yaml
from coordinates_generator import CoordinatesGenerator
from yolo_detector import YOLODetector
from colors import *
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

data_file = "parking_coords.yml"
image_file = "macPark.png"
video_file = "macPark.mp4"

# MongoDB configuration from environment variables
use_mongodb = os.getenv("USE_MONGODB", "True").lower() == "true"
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/") 

def generate_coordinates():
    """Generate parking spot coordinates from an image."""
    logging.basicConfig(level=logging.INFO)
    
    # Get lot information from user
    print("\n=== Parking Lot Setup ===")
    lot_id = input("Enter Lot ID (e.g., 'lot-001'): ").strip()
    lot_name = input("Enter Lot Name (e.g., 'Main Campus Parking'): ").strip()
    
    if not lot_id:
        print("Error: Lot ID is required")
        return
    
    with open(data_file, "w+") as points:
        generator = CoordinatesGenerator(
            image_file, 
            points, 
            COLOR_RED,
            lot_id=lot_id,
            lot_name=lot_name,
            use_db=use_mongodb,
            mongo_uri=mongo_uri
        )
        generator.generate()
    
    logging.info(f"Coordinates saved to {data_file}")
    if use_mongodb:
        logging.info(f"Lot definition saved to MongoDB: {lot_id}")


def detect_parking():
    """Run YOLO parking detection on video."""
    logging.basicConfig(level=logging.INFO)
    
    # Configuration variables
    start_frame = 1
    yolo_model = "yolov8n.pt"
    yolo_conf = 0.25
    
    # Get lot ID if using MongoDB
    lot_id = None
    if use_mongodb:
        lot_id = input("Enter Lot ID for detection (e.g., 'lot-001'): ").strip()
        if not lot_id:
            print("Warning: No Lot ID provided. MongoDB updates will be skipped.")
    
    with open(data_file, "r") as data:
        points = yaml.safe_load(data)
        if points is None:
            points = {}
    
    detector = YOLODetector(
        video_file, points, int(start_frame), 
        model_path=yolo_model, conf=yolo_conf,
        lot_id=lot_id,
        use_db=use_mongodb,
        mongo_uri=mongo_uri
    )
    detector.detect_yolo()


if __name__ == '__main__':
    input_mode = input("Enter 'g' to generate coordinates, 'd' to detect parking: ").strip().lower()
    if input_mode == 'g':
        generate_coordinates()
    elif input_mode == 'd':
        detect_parking()
    else:
        print("Invalid input. Please enter 'g' or 'd'.")