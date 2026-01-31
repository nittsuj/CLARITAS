"""Tests for the main FastAPI application endpoints."""
import io


def test_analyze_audio_success(client):
    """Test the /analyze-audio endpoint with a valid file."""
    # Create a dummy audio file (simulating a WAV file with some bytes)
    dummy_audio = b"RIFF" + b"\x00" * 100  # Simple WAV-like header + data
    
    files = {"file": ("test_audio.wav", io.BytesIO(dummy_audio), "audio/wav")}
    
    response = client.post("/analyze-audio", files=files)
    
    # Assert the response is successful
    assert response.status_code == 200
    
    # Assert the response contains expected fields
    data = response.json()
    assert "speech_fluency" in data
    assert "lexical_score" in data
    assert "coherence_score" in data
    assert "risk_band" in data
    assert "summary" in data
    assert "technical" in data
    
    # Assert values are in expected ranges
    assert 0 <= data["speech_fluency"] <= 100
    assert 0 <= data["lexical_score"] <= 100
    assert 0 <= data["coherence_score"] <= 100
    assert data["risk_band"] in ["Baik", "Sedang", "Buruk"]


def test_analyze_audio_no_file(client):
    """Test the /analyze-audio endpoint without a file."""
    response = client.post("/analyze-audio")
    
    # Should return a 422 Unprocessable Entity (missing required field)
    assert response.status_code == 422


def test_analyze_audio_empty_file(client):
    """Test the /analyze-audio endpoint with an empty file."""
    files = {"file": ("empty.wav", io.BytesIO(b""), "audio/wav")}
    
    response = client.post("/analyze-audio", files=files)
    
    # Should return 400 Bad Request for empty file
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()
