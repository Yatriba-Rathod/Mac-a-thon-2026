from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "mac-a-park-db"  

# Initialize MongoDB Client
try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000  # 5 second timeout
    )
    
    # Test connection
    client.admin.command('ping')
    print(" MongoDB Connected Successfully")
    
except ConnectionFailure as e:
    print(f"MongoDB Connection Failed: {e}")
    raise
except ServerSelectionTimeoutError as e:
    print(f"MongoDB Server Selection Timeout: {e}")
    raise

# Database
db = client[DATABASE_NAME]

# Collections
users_collection = db["mac-a-park-collection"]
preferences_collection = db["preferences-collection"]
lot_collection = db["lot-collection"]
occupancy_collection = db["occupancy-collection"]

# Helper function to check database connection
def check_db_connection():
    """
    Check if MongoDB connection is alive
    """
    try:
        client.admin.command('ping')
        return {
            "status": "connected",
            "database": DATABASE_NAME,
            "collection": "mac-a-park-collection"
        }
    except Exception as e:
        return {"status": "disconnected", "error": str(e)}


