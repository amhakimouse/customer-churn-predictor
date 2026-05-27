from fastapi import APIRouter, HTTPException
from app.schemas.models import CustomerFeatures, PredictionResponse
from app.ml.predict import predictor, get_risk_level

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_churn(customer_data: CustomerFeatures):
    try:
        # Convert pydantic model to dict
        data_dict = customer_data.model_dump()
        
        # Make prediction
        probability = predictor.predict(data_dict)
        risk = get_risk_level(probability)
        
        return PredictionResponse(
            churn_probability=probability,
            risk_level=risk
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": predictor.model is not None}
