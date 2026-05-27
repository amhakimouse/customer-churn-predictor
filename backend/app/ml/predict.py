import os
import joblib
import pandas as pd
import numpy as np

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'artifacts')
MODEL_PATH = os.path.join(ARTIFACTS_DIR, 'rf_model.joblib')
FEATURES_PATH = os.path.join(ARTIFACTS_DIR, 'feature_columns.joblib')

class ChurnPredictor:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self._load_artifacts()

    def _load_artifacts(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(FEATURES_PATH):
            self.model = joblib.load(MODEL_PATH)
            self.feature_columns = joblib.load(FEATURES_PATH)
            print("Model and features loaded successfully.")
        else:
            print("Warning: Model artifacts not found. Using fallback mock predictor.")

    def predict(self, data: dict) -> float:
        if self.model is None or self.feature_columns is None:
            # Fallback mock prediction for UI testing without the trained model
            return self._mock_predict(data)
            
        # Convert incoming dictionary to DataFrame
        df = pd.DataFrame([data])
        
        # We need to perform the same one-hot encoding
        categorical_cols = ['Gender', 'MaritalStatus', 'IncomeLevel', 'MostFrequentProductCategory', 'MostFrequentServiceUsage']
        df_encoded = pd.get_dummies(df, columns=categorical_cols)
        
        # Reindex to match the training feature columns (fill missing with 0)
        df_encoded = df_encoded.reindex(columns=self.feature_columns, fill_value=0)
        
        # Predict probability of churn (class 1)
        proba = self.model.predict_proba(df_encoded)[0][1]
        return float(proba)
        
    def _mock_predict(self, data: dict) -> float:
        # Simple heuristic to mock probability
        base_risk = 0.2
        if data.get('UnresolvedCount_CS', 0) > 2:
            base_risk += 0.3
        if data.get('TotalLoginFrequency', 10) < 5:
            base_risk += 0.2
        if data.get('TransactionCount', 10) < 3:
            base_risk += 0.1
        return min(max(base_risk, 0.0), 1.0)

# Singleton instance
predictor = ChurnPredictor()

def get_risk_level(proba: float) -> str:
    if proba < 0.3:
        return 'Low Risk'
    elif proba < 0.7:
        return 'Medium Risk'
    else:
        return 'High Risk'
