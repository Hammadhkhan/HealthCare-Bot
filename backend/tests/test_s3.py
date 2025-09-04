import pytest
from app.s3 import upload_file_to_s3, generate_presigned_url
from pathlib import Path

def test_s3_upload_and_presigned(tmp_path):
    test_file = tmp_path / "sample.txt"
    test_file.write_text("Hello S3!")

    key = "test/sample.txt"
    success = upload_file_to_s3(str(test_file), key)
    assert success is True

    url = generate_presigned_url(key)
    assert url is not None
    assert "https://" in url
