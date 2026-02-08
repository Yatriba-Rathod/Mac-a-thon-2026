from fastapi import APIRouter, Body, HTTPException, status
from controller.controller import (
    answer_questions,
    edit_questions,
    get_questions,
    delete_questions,
    get_user,
    get_user_with_preferences,
    delete_user_complete,
    get_all_users,
    default_message
)
from database.database import check_db_connection
from model.model import UserPreferences
router = APIRouter()

#Default endpoint
@router.get('/')
def default_msg():
    return default_message()

# ==================== USER SYNC ENDPOINT ====================

@router.post("/user/sync", status_code=status.HTTP_201_CREATED)
def sync_user(payload: dict = Body(...)):
    """
    POST - Save or update user info in MongoDB immediately after sign-up/sign-in

    Body:
    {
        "firebase_id": "user_123",
        "full_name": "Sahil Gupta",
        "email": "sahil@example.com"
    }
    """
    from controller.controller import create_or_update_user

    result = create_or_update_user(payload)

    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result.get("message")
        )

    return result
# ==================== SURVEY/QUESTIONS ENDPOINTS ====================

@router.post("/questions/answer", status_code=201)
def submit_survey(payload: UserPreferences):
    result = answer_questions(payload)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])

    return result

@router.put("/questions/{firebase_id}", status_code=status.HTTP_200_OK)
def update_survey(firebase_id: str, payload: dict = Body(...)):
    """
    PUT - Edit/Update survey answers
    
    Can update one or more questions
    
    Body (send only fields to update):
    {
        "q3": "Easiest to park",
        "q5": ["EV charging spot"]
    }
    """
    result = edit_questions(firebase_id, payload)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result


@router.get("/questions/{firebase_id}", status_code=status.HTTP_200_OK)
def get_survey_answers(firebase_id: str):
    """
    GET - Get user's survey answers
    """
    result = get_questions(firebase_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result


@router.delete("/questions/{firebase_id}", status_code=status.HTTP_200_OK)
def delete_survey_answers(firebase_id: str):
    """
    DELETE - Delete survey answers
    
    Keeps user profile intact
    """
    result = delete_questions(firebase_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result


# ==================== USER ENDPOINTS ====================

@router.get("/user/{firebase_id}", status_code=status.HTTP_200_OK)
def get_user_profile(firebase_id: str):
    """
    GET - Get user profile (basic info only)
    """
    result = get_user(firebase_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result

#We may not meed this, but just in case
@router.get("/user/{firebase_id}/complete", status_code=status.HTTP_200_OK)
def get_complete_user_data(firebase_id: str):
    """
    GET - Get user profile + user preferences answers combined
    """
    result = get_user_with_preferences(firebase_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result


@router.delete("/user/{firebase_id}/complete", status_code=status.HTTP_200_OK)
def delete_complete_user_data(firebase_id: str):
    """
    DELETE - Delete user profile AND user preferences answers
    """
    result = delete_user_complete(firebase_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message")
        )
    
    return result


@router.get("/users", status_code=status.HTTP_200_OK)
def list_all_users():
    """
    GET - Get all users with their preference answers (admin endpoint)
    """
    return get_all_users()


