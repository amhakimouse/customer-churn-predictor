from pydantic import BaseModel, Field
from typing import Literal

class CustomerFeatures(BaseModel):
    Age: int = Field(..., ge=18, le=100, description="Age of the customer")
    Gender: Literal['M', 'F'] = Field(..., description="Gender of the customer")
    MaritalStatus: Literal['Single', 'Married', 'Divorced', 'Widowed'] = Field(..., description="Marital status")
    IncomeLevel: Literal['Low', 'Medium', 'High'] = Field(..., description="Income level")
    
    # Transaction History
    TotalAmountSpent: float = Field(0.0, description="Total amount spent")
    TransactionCount: int = Field(0, description="Total number of transactions")
    AverageTransactionValue: float = Field(0.0, description="Average value of a transaction")
    MostFrequentProductCategory: str = Field('Electronics', description="Most frequent product category bought")
    
    # Customer Service
    InteractionCount_CS: int = Field(0, description="Total interactions with customer service")
    Complaint_Count_CS: int = Field(0, description="Number of complaint interactions")
    Feedback_Count_CS: int = Field(0, description="Number of feedback interactions")
    Inquiry_Count_CS: int = Field(0, description="Number of inquiry interactions")
    UnresolvedCount_CS: int = Field(0, description="Number of unresolved customer service issues")
    UnresolvedRatio_CS: float = Field(0.0, description="Ratio of unresolved issues to total interactions")
    
    # Online Activity
    TotalLoginFrequency: int = Field(0, description="Total login frequency")
    MostFrequentServiceUsage: Literal['Mobile App', 'Website'] = Field('Mobile App', description="Most frequent service usage platform")

class PredictionResponse(BaseModel):
    churn_probability: float = Field(..., description="Probability of the customer churning (0.0 to 1.0)")
    risk_level: Literal['Low Risk', 'Medium Risk', 'High Risk'] = Field(..., description="Categorized risk level")
