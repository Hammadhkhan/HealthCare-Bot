FROM python:3.11-slim

# Install system deps for OCR + ClamAV
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    clamav \
    clamav-daemon \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Update ClamAV DB
RUN freshclam || true

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
