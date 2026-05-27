export interface CustomerFeatures {
  Age: number;
  Gender: 'M' | 'F';
  MaritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  IncomeLevel: 'Low' | 'Medium' | 'High';
  TotalAmountSpent: number;
  TransactionCount: number;
  AverageTransactionValue: number;
  MostFrequentProductCategory: string;
  InteractionCount_CS: number;
  Complaint_Count_CS: number;
  Feedback_Count_CS: number;
  Inquiry_Count_CS: number;
  UnresolvedCount_CS: number;
  UnresolvedRatio_CS: number;
  TotalLoginFrequency: number;
  MostFrequentServiceUsage: 'Mobile App' | 'Website';
}

export interface PredictionResponse {
  churn_probability: number;
  risk_level: 'Low Risk' | 'Medium Risk' | 'High Risk';
}
