from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
from datetime import datetime
import jwt
from typing import List, Optional

from database import get_db, engine, Base
from models import WaitlistSignup
from schemas import WaitlistSignupRequest, WaitlistSignupResponse, AdminLoginRequest, WaitlistListResponse
from email_service import send_welcome_email
from config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Waitlist API",
    description="API for managing waitlist signups",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "https://jg7c52wx-3000.asse.devtunnels.ms",
    "https://chapi-xhjf.onrender.com",
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "Waitlist API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# @app.post("/api/waitlist/signup", response_model=WaitlistSignupResponse)
# async def signup_waitlist(
#     request: WaitlistSignupRequest,
#     db: Session = Depends(get_db)
# ):
#     """Add email to waitlist"""
#     try:
#         # Check if email already exists
#         existing_signup = db.query(WaitlistSignup).filter(WaitlistSignup.email == request.email).first()
#         if existing_signup:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Email already registered for waitlist"
#             )
        
#         # Create new signup
#         signup = WaitlistSignup(email=request.email)
#         db.add(signup)
#         db.commit()
#         db.refresh(signup)
        
#         # Send welcome email
#         try:
#             await send_welcome_email(request.email)
#         except Exception as e:
#             print(f"Failed to send email: {e}")
#             # Don't fail the signup if email fails
        
#         return WaitlistSignupResponse(
#             id=signup.id,
#             email=signup.email,
#             created_at=signup.created_at,
#             message="Successfully joined waitlist! Check your email for confirmation."
#         )
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to process waitlist signup"
#         )
@app.post("/api/waitlist/signup", response_model=WaitlistSignupResponse)
async def signup_waitlist(
    request: WaitlistSignupRequest,
    db: Session = Depends(get_db)
):
    """Add email to waitlist"""
    try:
        # Check if email already exists
        existing_signup = db.query(WaitlistSignup).filter(WaitlistSignup.email == request.email).first()
        if existing_signup:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered for waitlist"
            )
        
        # Create new signup
        signup = WaitlistSignup(email=request.email)
        db.add(signup)
        db.commit()
        db.refresh(signup)

        # Send welcome email asynchronously
        try:
            import asyncio
            asyncio.create_task(send_welcome_email(request.email))
        except Exception as e:
            print(f"Failed to send email: {e}")
            # Continue even if email sending fails
        
        return WaitlistSignupResponse(
            id=signup.id,
            email=signup.email,
            created_at=signup.created_at,
            message="Successfully joined waitlist! Check your email for confirmation."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process waitlist signup: {str(e)}"
        )

@app.post("/api/auth/login")
async def admin_login(request: AdminLoginRequest):
    """Admin login endpoint"""
    if request.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    
    # Create JWT token with longer expiry
    token_data = {
        "role": "admin",
        "exp": datetime.utcnow().timestamp() + 86400  # 24 hours expiry
    }
    token = jwt.encode(token_data, settings.SECRET_KEY, algorithm="HS256")
    
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/waitlist/list", response_model=List[WaitlistSignupResponse])
async def list_waitlist_signups(
    token_data: dict = Depends(verify_admin_token),
    db: Session = Depends(get_db)
):
    """Get all waitlist signups (admin only)"""
    signups = db.query(WaitlistSignup).order_by(WaitlistSignup.created_at.desc()).all()
    return [
        WaitlistSignupResponse(
            id=signup.id,
            email=signup.email,
            created_at=signup.created_at
        ) for signup in signups
    ]

@app.get("/api/waitlist/count")
async def get_waitlist_count(db: Session = Depends(get_db)):
    """Get total number of waitlist signups"""
    count = db.query(WaitlistSignup).count()
    return {"count": count}

@app.delete("/api/waitlist/delete/{signup_id}")
async def delete_waitlist_signup(
    signup_id: int,
    token_data: dict = Depends(verify_admin_token),
    db: Session = Depends(get_db)
):
    signup = db.query(WaitlistSignup).filter(WaitlistSignup.id == signup_id).first()
    if not signup:
        raise HTTPException(status_code=404, detail="Signup not found")

    db.delete(signup)
    db.commit()
    return {"message": f"Signup {signup.email} deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

