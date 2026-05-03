from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def test_submit_registration():
    test_data = {
        "name": "Test User",
        "fatherName": "Father Name",
        "dob": "2000-01-01",
        "gender": "Male",
        "email": "test@example.com",
        "phone": "1234567890",
        "state": "Delhi",
        "district": "New Delhi",
        "pincode": "110001",
        "address": "123 Street",
        "idType": "Aadhar",
        "idNumber": "1234-5678-9012"
    }
    response = client.post("/api/registration/submit", json=test_data)
    assert response.status_code == 200
    assert "id" in response.json()

def test_get_registration_status():
    # Submit first
    test_data = {"name": "Status User"}
    sub_res = client.post("/api/registration/submit", json=test_data)
    app_id = sub_res.json()["id"]
    
    response = client.get(f"/api/registration/status/{app_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Status User"
    assert response.json()["status"] == "pending"

def test_submit_partial_data():
    test_data = {
        "name": "Only Name"
    }
    response = client.post("/api/registration/submit", json=test_data)
    assert response.status_code == 200
    assert "id" in response.json()
