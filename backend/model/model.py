from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
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

# ==================== PARKING LOT MODELS ====================

class Coordinate(BaseModel):
    """Coordinate point for spot polygons (normalized 0-1)"""
    x: float = Field(..., ge=0, le=1, description="X coordinate (0-1)")
    y: float = Field(..., ge=0, le=1, description="Y coordinate (0-1)")


class Spot(BaseModel):
    """Individual parking spot definition"""
    spot_id: str = Field(..., description="Unique spot identifier")
    type: str = Field(..., description="Spot type: standard, accessible, ev")
    polygon: List[Coordinate] = Field(..., min_items=3, description="Polygon coordinates")


class LotDefinition(BaseModel):
    """Complete parking lot definition"""
    lot_id: str = Field(..., description="Unique lot identifier")
    name: str = Field(..., description="Parking lot name")
    spots: List[Spot] = Field(..., description="Array of parking spots")
    image_width: Optional[int] = Field(None, description="Original image width")
    image_height: Optional[int] = Field(None, description="Original image height")
    created_at: Optional[datetime] = Field(None, description="Creation timestamp")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


class SpotState(BaseModel):
    """Individual spot occupancy state"""
    spot_id: str = Field(..., description="Spot identifier")
    occupied: bool = Field(..., description="Occupancy status")
    last_updated: datetime = Field(..., description="Last update timestamp")