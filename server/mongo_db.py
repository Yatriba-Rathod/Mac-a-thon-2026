from pymongo import MongoClient
from datetime import datetime
import logging


class ParkingDB:
    """MongoDB handler for parking lot definitions and occupancy data."""
    
    def __init__(self, connection_string="mongodb://localhost:27017/", db_name="mac-a-park-db"):
        """
        Initialize MongoDB connection.
        
        Args:
            connection_string: MongoDB connection URI (default: local)
            db_name: Database name
        """
        try:
            self.client = MongoClient(connection_string)
            self.db = self.client[db_name]
            self.lot_definitions = self.db["lot-collection"]
            self.occupancy_status = self.db["occupancy-collection"]
            
            # Test connection
            self.client.server_info()
            logging.info(f"Connected to MongoDB: {db_name}")
        except Exception as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def save_lot_definition(self, lot_id, name, spots, image_width, image_height):
        """
        Save parking lot definition with normalized coordinates.
        
        Args:
            lot_id: Unique lot identifier
            name: Lot name/description
            spots: List of spot dictionaries with id and coordinates
            image_width: Width of reference image for normalization
            image_height: Height of reference image for normalization
        """
        # Normalize coordinates
        normalized_spots = []
        for spot in spots:
            polygon = []
            for coord in spot["coordinates"]:
                polygon.append({
                    "x": float(coord[0]) / image_width,
                    "y": float(coord[1]) / image_height
                })
            
            normalized_spots.append({
                "spot_id": str(spot["id"]),
                "type": "standard",
                "polygon": polygon
            })
        
        lot_definition = {
            "lot_id": lot_id,
            "name": name,
            "spots": normalized_spots,
            "image_width": image_width,
            "image_height": image_height,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Upsert lot definition
        self.lot_definitions.update_one(
            {"lot_id": lot_id},
            {"$set": lot_definition},
            upsert=True
        )
        
        logging.info(f"Saved lot definition: {lot_id} with {len(normalized_spots)} spots")
        return lot_definition
    
    def get_lot_definition(self, lot_id):
        """Get parking lot definition by ID."""
        return self.lot_definitions.find_one({"lot_id": lot_id}, {"_id": 0})
    
    def update_spot_status(self, lot_id, spot_id, occupied, video_file=None):
        """
        Update current status of a parking spot.
        
        Args:
            lot_id: Parking lot identifier
            spot_id: Unique spot identifier
            occupied: Boolean indicating if spot is occupied
            video_file: Optional video source name
        """
        timestamp = datetime.utcnow()
        
        self.occupancy_status.update_one(
            {"lot_id": lot_id, "spot_id": spot_id},
            {
                "$set": {
                    "occupied": occupied,
                    "last_updated": timestamp,
                    "video_source": video_file
                }
            },
            upsert=True
        )
    
    # def get_lot_occupancy(self, lot_id):
    #     """Get current occupancy status for all spots in a lot."""
    #     return list(self.occupancy_status.find({"lot_id": lot_id}, {"_id": 0}))
    
    # def get_available_spots(self, lot_id):
    #     """Get list of available (empty) parking spots in a lot."""
    #     return list(self.occupancy_status.find(
    #         {"lot_id": lot_id, "occupied": False},
    #         {"_id": 0}
    #     ))
    
    # def get_occupancy_summary(self, lot_id):
    #     """Get summary statistics of parking lot."""
    #     total = self.occupancy_status.count_documents({"lot_id": lot_id})
    #     occupied = self.occupancy_status.count_documents({"lot_id": lot_id, "occupied": True})
    #     available = total - occupied
        
    #     return {
    #         "lot_id": lot_id,
    #         "total_spots": total,
    #         "occupied": occupied,
    #         "available": available,
    #         "occupancy_rate": (occupied / total * 100) if total > 0 else 0
    #     }
    
    def close(self):
        """Close MongoDB connection."""
        self.client.close()
        logging.info("MongoDB connection closed")
