from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class User(BaseModel):
    """
    Complete User model for MongoDB storage and API requests
    Handles both storage and sync requests in one model
    """
    firebase_id: str = Field(..., description="Firebase UID (primary key)")
    full_name: Optional[str] = Field(None, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    
    # Survey answers: q1, q2, q3, q4, q5
    # Required survey answers
    q1: str  # How long to find parking
    q2: str  # Time of day
    q3: str  # Preferred spot type
    q4: str  # Spots passed
    q5: List[str]  # Special requirements (array)
    
    # Timestamps (auto-managed by controller)
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")
