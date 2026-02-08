from database.database import users_collection, preferences_collection, lot_collection, occupancy_collection
from model.model import User, UserPreferences, LotDefinition
from datetime import datetime
from bson import ObjectId

#Default Message
def default_message():
    return "Welcome Mac-a-Park backend" 


# ==================== USER OPERATIONS ====================

def create_or_update_user(data: dict):
    """
    Create or update user profile (upsert)
    Stores: firebase_id, full_name, email
    """
    firebase_id = data.get("firebase_id")
    
    if not firebase_id:
        return {"status": "error", "message": "firebase_id is required"}
    
    if not data.get("email"):
        return {"status": "error", "message": "email is required"}
    
    user_data = {
        "firebase_id": firebase_id,
        "full_name": data.get("full_name"),
        "email": data.get("email"),
        "updated_at": datetime.utcnow(),
    }
    
    result = users_collection.update_one(
        {"firebase_id": firebase_id},
        {
            "$set": user_data,
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True,
    )
    
    return {
        "status": "success",
        "message": "User profile saved successfully",
        "firebase_id": firebase_id,
        "upserted": result.upserted_id is not None,
        "modified": result.modified_count > 0
    }


def get_user(firebase_id: str):
    """
    Get user profile by Firebase ID
    """
    user = users_collection.find_one(
        {"firebase_id": firebase_id},
        {"_id": 0}
    )
    
    if not user:
        return {"status": "error", "message": "User not found"}
    
    return {
        "status": "success",
        "user": user
    }


# ==================== QUESTIONS/PREFERENCES OPERATIONS ====================

def answer_questions(data: UserPreferences):
    """
    Create or update user parking preferences
    """

    firebase_id = data.firebase_id

    # Ensure user exists (must be synced via /user/sync)
    if not users_collection.find_one({"firebase_id": firebase_id}):
        return {
            "status": "error",
            "message": "User does not exist. Sync user first."
        }

    preferences_data = {
        "firebase_id": firebase_id,
        "q1": data.q1,
        "q2": data.q2,
        "q3": data.q3,
        "q4": data.q4,
        "q5": data.q5,
        "updated_at": datetime.utcnow(),
    }

    result = preferences_collection.update_one(
        {"firebase_id": firebase_id},
        {
            "$set": preferences_data,
            "$setOnInsert": {"created_at": datetime.utcnow()},
        },
        upsert=True,
    )

    return {
        "status": "success",
        "message": "Preferences saved successfully",
        "firebase_id": firebase_id,
        "upserted": result.upserted_id is not None,
        "modified": result.modified_count > 0,
    }

def edit_questions(firebase_id: str, data: dict):
    """
    Edit/update survey answers (PATCH)
    Can update one or more questions
    """
    # Validate at least one field is provided
    valid_fields = ["q1", "q2", "q3", "q4", "q5"]
    update_fields = {k: v for k, v in data.items() if k in valid_fields and v is not None}
    
    if not update_fields:
        return {"status": "error", "message": "No valid fields to update"}
    
    # Add updated timestamp
    update_fields["updated_at"] = datetime.utcnow()
    
    result = preferences_collection.update_one(
        {"firebase_id": firebase_id},
        {"$set": update_fields}
    )
    
    if result.matched_count == 0:
        return {"status": "error", "message": "User preference answers not found"}
    
    return {
        "status": "success",
        "message": "User preference answers updated successfully",
        "firebase_id": firebase_id,
        "modified": result.modified_count > 0
    }


def get_questions(firebase_id: str):
    """
    Get user's survey answers
    """
    preferences = preferences_collection.find_one(
        {"firebase_id": firebase_id},
        {"_id": 0}
    )
    
    if not preferences:
        return {"status": "error", "message": "User preference  answers not found"}
    
    return {
        "status": "success",
        "preferences": preferences
    }


def delete_questions(firebase_id: str):
    """
    Delete survey answers (DELETE)
    Keeps user profile intact
    """
    result = preferences_collection.delete_one({"firebase_id": firebase_id})
    
    if result.deleted_count == 0:
        return {"status": "error", "message": "No user preference  answers found"}
    
    return {
        "status": "success",
        "message": "User preference answers deleted successfully",
        "firebase_id": firebase_id
    }

# ==================== COMBINED OPERATIONS ====================

def get_user_with_preferences(firebase_id: str):
    """
    Get user profile + questions answers combined
    """
    user = users_collection.find_one(
        {"firebase_id": firebase_id},
        {"_id": 0}
    )
    
    preferences = preferences_collection.find_one(
        {"firebase_id": firebase_id},
        {"_id": 0}
    )
    
    if not user:
        return {"status": "error", "message": "User not found"}
    
    return {
        "status": "success",
        "user": user,
        "preferences": preferences
    }


def delete_user_complete(firebase_id: str):
    """
    Delete user profile AND user preferences questions answers
    """
    pref_result = preferences_collection.delete_one({"firebase_id": firebase_id})
    
    if  pref_result.deleted_count == 0:
        return {"status": "error", "message": "User not found"}
    
    return {
        "status": "success",
        "message": "User preference answers deleted successfully",
        "firebase_id": firebase_id,
        "preferences_deleted": pref_result.deleted_count > 0
    }


def get_all_users():
    """
    Get all users with their preferences (admin endpoint)
    """
    users = list(users_collection.find({}, {"_id": 0}))
    
    # Attach preferences to each user
    for user in users:
        preferences = preferences_collection.find_one(
            {"firebase_id": user["firebase_id"]},
            {"_id": 0}
        )
        user["preferences"] = preferences
    
    return {
        "status": "success",
        "count": len(users),
        "users": users
    }


# ==================== PARKING LOT OPERATIONS ====================

def get_lot_by_id(lot_id: str):
    """
    Get parking lot definition by lot_id
    """
    lot = lot_collection.find_one({"lot_id": lot_id})
    
    if not lot:
        return {
            "status": "error",
            "message": f"Lot with id '{lot_id}' not found"
        }
    
    # Convert ObjectId to string for JSON serialization
    if "_id" in lot:
        lot["_id"] = str(lot["_id"])
    
    return {
        "status": "success",
        "lot": lot
    }


def get_all_lots():
    """
    Get all parking lots (admin endpoint)
    """
    lots = list(lot_collection.find({}))
    
    # Convert ObjectId to string for each lot
    for lot in lots:
        if "_id" in lot:
            lot["_id"] = str(lot["_id"])
    
    return {
        "status": "success",
        "count": len(lots),
        "lots": lots
    }


def get_occupancy_by_lot_id(lot_id: str):
    """
    Get all occupancy states for a specific lot_id
    """
    occupancies = list(occupancy_collection.find({"lot_id": lot_id}))
    
    if not occupancies:
        return {
            "status": "error",
            "message": f"No occupancy data found for lot '{lot_id}'"
        }
    
    # Convert ObjectId to string for each entry
    for occ in occupancies:
        if "_id" in occ:
            occ["_id"] = str(occ["_id"])
    
    return {
        "status": "success",
        "count": len(occupancies),
        "occupancies": occupancies
    }