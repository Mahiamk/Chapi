from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class WaitlistSignupRequest(BaseModel):
    email: EmailStr

class WaitlistSignupResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    message: Optional[str] = None
    
    class Config:
        from_attributes = True

class AdminLoginRequest(BaseModel):
    password: str

class WaitlistListResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

