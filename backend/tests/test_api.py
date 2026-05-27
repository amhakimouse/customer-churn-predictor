from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_predict_endpoint_valid_input():
    valid_payload = {
        "Age": 45,
        "Gender": "M",
        "MaritalStatus": "Married",
        "IncomeLevel": "Medium",
        "TotalAmountSpent": 1500.50,
        "TransactionCount": 15,
        "AverageTransactionValue": 100.03,
        "MostFrequentProductCategory": "Electronics",
        "InteractionCount_CS": 2,
        "Complaint_Count_CS": 0,
        "Feedback_Count_CS": 1,
        "Inquiry_Count_CS": 1,
        "UnresolvedCount_CS": 0,
        "UnresolvedRatio_CS": 0.0,
        "TotalLoginFrequency": 20,
        "MostFrequentServiceUsage": "Mobile App"
    }
    response = client.post("/api/predict", json=valid_payload)
    assert response.status_code == 200
    data = response.json()
    assert "churn_probability" in data
    assert "risk_level" in data
    assert data["churn_probability"] >= 0.0 and data["churn_probability"] <= 1.0

def test_predict_endpoint_invalid_input():
    invalid_payload = {
        "Age": 5, # Invalid age
        "Gender": "X", # Invalid gender
    }
    response = client.post("/api/predict", json=invalid_payload)
    assert response.status_code == 422 # Validation error
