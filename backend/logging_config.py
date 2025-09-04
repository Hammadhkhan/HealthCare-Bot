import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

def setup_logging():
    logger = logging.getLogger("uvicorn.access")
    logger.setLevel(logging.INFO)

    # Rotating logs: max 5 MB each, keep 5 backups
    handler = RotatingFileHandler(
        os.path.join(LOG_DIR, "app.log"),
        maxBytes=5*1024*1024,
        backupCount=5
    )
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )
    handler.setFormatter(formatter)

    if not logger.handlers:
        logger.addHandler(handler)

    return logger
