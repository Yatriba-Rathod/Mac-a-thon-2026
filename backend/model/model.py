from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class User(BaseModel):
    """
    User model - stores basic user info
    """
    firebase_id: str = Field(..., description="Firebase UID (primary key)")
    full_name: Optional[str] = Field(None, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    
    # Timestamps
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


class UserPreferences(BaseModel):
    """
    User preferences model - stores survey answers
    Linked to User via firebase_id
    """
    firebase_id: str = Field(..., description="Firebase UID (links to User)")
    
    # Survey answers (required)
    q1: str = Field(..., description="How long to find parking")
    q2: str = Field(..., description="Time of day")
    q3: str = Field(..., description="Preferred spot type")
    q4: str = Field(..., description="Spots passed")
    q5: List[str] = Field(..., description="Special requirements")
    
    # Timestamps
    created_at: Optional[datetime] = Field(None, description="Preference creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")