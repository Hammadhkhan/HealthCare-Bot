import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_and_login():
    # Signup
    response = client.post("/api/auth/signup", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200

    # Login
    response = client.post("/api/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
