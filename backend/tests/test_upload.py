import pytest
from fastapi.testclient import TestClient
from app.main import app
from pathlib import Path

client = TestClient(app)

def test_file_upload(tmp_path):
    # Create a fake file
    test_file = tmp_path / "report.txt"
    test_file.write_text("This is a medical test report.")

    with open(test_file, "rb") as f:
        response = client.post(
            "/api/chat/upload",
            files={"files": ("report.txt", f, "text/plain")}
        )

    assert response.status_code == 200
    result = response.json()
    assert "uploaded" in result
