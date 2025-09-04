from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List, Optional
from app.models import MessageIn, MessageOut
from datetime import datetime
import uuid, os
from app.ocr import extract_text_from_file
from app.s3 import upload_file_to_s3, generate_presigned_url
from fastapi.responses import FileResponse

router = APIRouter()

# In-memory chat sessions
sessions = {}

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/message", response_model=MessageOut)
async def send_message(
    text: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    session_id: Optional[str] = Form(None)
):
    # Ensure session
    if not session_id or session_id not in sessions:
        session_id = str(uuid.uuid4())
        sessions[session_id] = {"id": session_id, "title": "New Chat", "messages": []}

    # User message
    msg_id = str(uuid.uuid4())
    user_msg = {
        "id": msg_id,
        "role": "user",
        "text": text or "",
        "time": datetime.utcnow(),
    }
    sessions[session_id]["messages"].append(user_msg)

    # File handling
    response_texts = []
    if files:
        for file in files:
            # Save locally
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())

            # Upload to S3
            s3_key = f"uploads/{uuid.uuid4()}-{file.filename}"
            upload_file_to_s3(file_path, s3_key)

            # OCR extract
            extracted = extract_text_from_file(file_path)
            response_texts.append(f"Extracted from {file.filename}: {extracted[:120]}...")

            # Presigned URL for download
            url = generate_presigned_url(s3_key)
            response_texts.append(f"Download: {url}")

    # Bot response
    bot_msg = {
        "id": str(uuid.uuid4()),
        "role": "assistant",
        "text": " | ".join(response_texts) if response_texts else f"AI Response to: {text}",
        "time": datetime.utcnow(),
    }
    sessions[session_id]["messages"].append(bot_msg)

    return bot_msg

@router.get("/download/{file_name}")
def download_file(file_name: str):
    file_path = os.path.join(UPLOAD_DIR, file_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=file_name)