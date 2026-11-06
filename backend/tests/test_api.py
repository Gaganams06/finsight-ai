import os
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Finsight" in data["service"]

def test_sample_endpoint():
    response = client.get("/api/sample")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "health_score" in data
    assert data["health_score"]["overall_score"] > 0
    assert len(data["monthly_trends"]) > 0
    assert len(data["transactions"]) > 0
    assert "meta" in data

def test_upload_csv_endpoint():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_statement_sbi.csv")
    with open(sample_path, "rb") as f:
        response = client.post(
            "/api/upload",
            files={"file": ("sample_statement_sbi.csv", f, "text/csv")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["transactions"]) >= 20
    assert "SBI" in data["meta"]["bank_detected"]

def test_upload_invalid_file_type():
    response = client.post(
        "/api/upload",
        files={"file": ("malicious.exe", b"not-a-statement", "application/octet-stream")}
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]
