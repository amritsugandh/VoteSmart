from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
import pytest

client = TestClient(app)

@pytest.mark.asyncio
@patch('google.generativeai.GenerativeModel')
def test_chat_response(mock_model):
    # Setup mock response
    mock_instance = MagicMock()
    mock_instance.generate_content.return_value.text = "Hello, I am Kiran, your Election Assistant."
    mock_model.return_value = mock_instance
    
    test_data = {
        "message": "Hi",
        "state": "Delhi",
        "lang": "en"
    }
    
    response = client.post("/api/chat", json=test_data)
    assert response.status_code == 200
    assert "response" in response.json()
    assert "Kiran" in response.json()["response"]

def test_chat_empty_message():
    test_data = {
        "message": "",
        "state": "Delhi",
        "lang": "en"
    }
    response = client.post("/api/chat", json=test_data)
    # Depending on implementation, empty message might be 400 or handled gracefully
    assert response.status_code in [200, 422]
