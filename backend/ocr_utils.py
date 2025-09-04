import pytesseract
from PIL import Image
import fitz  # PyMuPDF

def extract_text_from_file(file_path: str) -> str:
    if file_path.lower().endswith((".png", ".jpg", ".jpeg")):
        img = Image.open(file_path)
        return pytesseract.image_to_string(img)

    elif file_path.lower().endswith(".pdf"):
        text = ""
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        if not text.strip():  # fallback OCR
            for page_num in range(len(doc)):
                pix = doc[page_num].get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text += pytesseract.image_to_string(img)
        return text

    else:
        return "Unsupported file type"
