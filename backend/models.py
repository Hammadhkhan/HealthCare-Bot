from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ---------- User ----------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr

# ---------- Auth ----------
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefresh(BaseModel):
    refresh_token: str

# ---------- Chat ----------
class MessageIn(BaseModel):
    session_id: Optional[str] = None
    text: Optional[str] = None

class MessageOut(BaseModel):
    id: str
    role: str
    text: str
    time: datetime

class ChatSession(BaseModel):
    id: str
    title: str
    created_at: datetime
    messages: List[MessageOut] = []
