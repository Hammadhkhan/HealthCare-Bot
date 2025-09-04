from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth, chat
from app.middleware import limiter, LoggingMiddleware, _rate_limit_exceeded_handler
from app.logging_config import setup_logging

# Setup rotating logs
logger = setup_logging()

app = FastAPI(title="AI Healthcare Backend")

# Add CORS (restrict to frontend domain)
origins = [
    "https://your-frontend.vercel.app",  # ✅ Replace with your frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add logging
app.add_middleware(LoggingMiddleware)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

@app.get("/")
def root():
    return {"status": "ok", "msg": "AI Healthcare Backend running"}
