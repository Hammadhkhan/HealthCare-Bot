from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "devsecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_access_token(user_id: str):
    return create_token({"sub": user_id}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

def create_refresh_token(user_id: str):
    return create_token({"sub": user_id}, timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None
