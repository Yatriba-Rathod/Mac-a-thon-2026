from database.database import users_collection, preferences_collection
from model.model import User, UserPreferences
from datetime import datetime

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

def answer_questions(data: dict):
    """
    Answer/submit survey questions (POST)
    Creates or updates survey answers with user info
    """
    firebase_id = data.get("firebase_id")
    
    if not firebase_id:
        return {"status": "error", "message": "firebase_id is required"}
    
    # Validate required fields
    required_fields = ["full_name", "email", "q1", "q2", "q3", "q4", "q5"]
    for field in required_fields:
        if field not in data or data[field] is None or data[field] == "":
            return {"status": "error", "message": f"{field} is required"}
    
    # First, save/update user profile
    user_result = create_or_update_user({
        "firebase_id": firebase_id,
        "full_name": data.get("full_name"),
        "email": data.get("email")
    })
    
    if user_result.get("status") == "error":
        return user_result
    
    # Then save/update preferences
    preferences_data = {
        "firebase_id": firebase_id,
        "q1": data.get("q1"),
        "q2": data.get("q2"),
        "q3": data.get("q3"),
        "q4": data.get("q4"),
        "q5": data.get("q5"),
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
        "message": "User preference answers saved successfully",
        "firebase_id": firebase_id,
        "upserted": result.upserted_id is not None,
        "modified": result.modified_count > 0
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