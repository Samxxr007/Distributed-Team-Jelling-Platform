from fastapi.testclient import TestClient
from app.main import app
from app.model import set_pipeline

client = TestClient(app)

class MockPipeline:
    def __call__(self, text):
        return [{'label': 'POSITIVE', 'score': 0.99}]

def setup_module():
    set_pipeline(MockPipeline())

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["model_loaded"] == True

def test_analyze_valid_text():
    response = client.post("/analyze", json={"text": "This is great!"})
    assert response.status_code == 200
    assert response.json()["sentiment"] == "positive"

def test_analyze_empty_text():
    # It will fail at schema validation since we restricted min_length=1 in pydantic
    # However we specified in instructions "if empty after stripping" - so string of spaces.
    response = client.post("/analyze", json={"text": "   "})
    assert response.status_code == 200
    assert response.json()["sentiment"] == "neutral"
    
def test_analyze_validation_error():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 422

def test_analyze_batch():
    response = client.post("/analyze/batch", json={"texts": ["Great", "Awesome"]})
    assert response.status_code == 200
    assert len(response.json()["results"]) == 2
