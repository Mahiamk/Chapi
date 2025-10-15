from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./waitlist.db"
    
    # Email
    RESEND_API_KEY: Optional[str] = ""
    EMAIL_USER: Optional[str] = None
    EMAIL_PASS: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ADMIN_PASSWORD: str = "admin123"
    
    # CORS
    FRONTEND_URL: str = "http://localhost:3001"
    
    class Config:
        env_file = ".env"   # 👈 you can change this to ".env" if that's what you're using
        case_sensitive = True

settings = Settings()
