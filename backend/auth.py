from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models import UserCreate, UserLogin, UserOut, Token, TokenRefresh
from app.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth_utils import verify_token
from app import models
from datetime import datetime
from typing import Dict
import uuid

router = APIRouter()

# --- In-memory store (replace with DB in prod) ---
users: Dict[str, Dict] = {}   # user_id -> user dict
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_user_by_email(email: str):
    for u in users.values():
        if u["email"] == email:
            return u
    return None

# ---------- Signup ----------
@router.post("/signup", response_model=UserOut)
def signup(data: UserCreate):
    if get_user_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    users[user_id] = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
        "created_at": datetime.utcnow(),
    }
    return {"id": user_id, "name": data.name, "email": data.email}

# ---------- Login ----------
@router.post("/login", response_model=Token)
def login(data: UserLogin):
    user = get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user["id"])
    refresh_token = create_refresh_token(user["id"])

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# ---------- Refresh Token ----------
@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(models.User).filter(models.User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # issue new short-lived access token
    access_token = create_access_token({"sub": user.id}, expires_minutes=15)
    return {"access_token": access_token}

# ---------- Logout ----------
@router.post("/logout")
def logout():
    # For stateless JWT, logout just means frontend deletes tokens.
    return {"msg": "Logged out"}