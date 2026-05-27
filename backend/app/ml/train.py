import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import os
import sys

# Determine the absolute paths based on the script location
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'artifacts')
DATA_PATH = os.path.join(os.path.dirname(BASE_DIR), 'Customer_Churn_Data_Large.xlsx') # Assuming it's placed in project root

def load_data(file_path):
    print(f"Loading data from {file_path}...")
    df = pd.read_excel(file_path, header=0, sheet_name='Customer_Demographics') # Assuming demographics is first/default
    
    transaction_history = pd.read_excel(file_path, sheet_name="Transaction_History")
    customer_service = pd.read_excel(file_path, sheet_name="Customer_Service")
    online_activity = pd.read_excel(file_path, sheet_name="Online_Activity")
    churn_status = pd.read_excel(file_path, sheet_name="Churn_Status")
    
    return df, transaction_history, customer_service, online_activity, churn_status

def preprocess_data(df, transaction_history, customer_service, online_activity, churn_status):
    print("Preprocessing data...")
    # Merge demographics and churn status
    customer_data = pd.merge(df, churn_status, on='CustomerID', how='left')
    
    # Feature Engineering from Transaction History
    transaction_features = transaction_history.groupby('CustomerID').agg(
        TotalAmountSpent=('AmountSpent', 'sum'),
        TransactionCount=('TransactionID', 'count'),
        AverageTransactionValue=('AmountSpent', 'mean')
    ).reset_index()
    
    most_frequent_category = transaction_history.groupby('CustomerID')['ProductCategory'].agg(lambda x: x.mode()[0]).reset_index()
    most_frequent_category.rename(columns={'ProductCategory': 'MostFrequentProductCategory'}, inplace=True)
    
    customer_data = pd.merge(customer_data, transaction_features, on='CustomerID', how='left')
    customer_data = pd.merge(customer_data, most_frequent_category, on='CustomerID', how='left')
    
    # Feature Engineering from Customer Service
    cs_interaction_count = customer_service.groupby('CustomerID').agg(InteractionCount_CS=('InteractionID', 'count')).reset_index()
    cs_interaction_types = customer_service.groupby(['CustomerID', 'InteractionType']).size().unstack(fill_value=0).reset_index()
    cs_interaction_types.columns = ['CustomerID'] + [col + '_Count_CS' for col in cs_interaction_types.columns[1:]]
    
    unresolved_issues = customer_service[customer_service['ResolutionStatus'] == 'Unresolved'].groupby('CustomerID').agg(UnresolvedCount_CS=('InteractionID', 'count')).reset_index()
    unresolved_issues = pd.merge(cs_interaction_count, unresolved_issues, on='CustomerID', how='left').fillna(0)
    unresolved_issues['UnresolvedRatio_CS'] = unresolved_issues['UnresolvedCount_CS'] / unresolved_issues['InteractionCount_CS']
    unresolved_issues.fillna(0, inplace=True) # Handle division by zero
    
    customer_data = pd.merge(customer_data, cs_interaction_count, on='CustomerID', how='left')
    customer_data = pd.merge(customer_data, cs_interaction_types, on='CustomerID', how='left')
    customer_data = pd.merge(customer_data, unresolved_issues[['CustomerID', 'UnresolvedCount_CS', 'UnresolvedRatio_CS']], on='CustomerID', how='left')
    
    # Feature Engineering from Online Activity
    online_activity_features = online_activity.groupby('CustomerID').agg(
        TotalLoginFrequency=('LoginFrequency', 'sum')
    ).reset_index()
    
    most_frequent_service_usage = online_activity.groupby('CustomerID')['ServiceUsage'].agg(lambda x: x.mode()[0]).reset_index()
    most_frequent_service_usage.rename(columns={'ServiceUsage': 'MostFrequentServiceUsage'}, inplace=True)
    
    customer_data = pd.merge(customer_data, online_activity_features, on='CustomerID', how='left')
    customer_data = pd.merge(customer_data, most_frequent_service_usage, on='CustomerID', how='left')
    
    customer_data.fillna(0, inplace=True)
    
    # Encoding Categorical Features
    categorical_cols_to_encode = ['Gender', 'MaritalStatus', 'IncomeLevel', 'MostFrequentProductCategory', 'MostFrequentServiceUsage']
    
    # We will use pandas get_dummies but save the resulting columns to ensure consistency during inference
    final_customer_data = pd.get_dummies(customer_data, columns=categorical_cols_to_encode, drop_first=True)
    
    # Extract feature columns (drop CustomerID and ChurnStatus)
    y = final_customer_data['ChurnStatus']
    X = final_customer_data.drop(columns=['CustomerID', 'ChurnStatus'])
    
    feature_columns = X.columns.tolist()
    
    return X, y, feature_columns

def train_model():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        print("Please ensure 'Customer_Churn_Data_Large.xlsx' is in the project root.")
        sys.exit(1)
        
    df, trans, cs, online, churn = load_data(DATA_PATH)
    X, y, feature_columns = preprocess_data(df, trans, cs, online, churn)
    
    # Handle Imbalance
    print("Applying SMOTE...")
    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X, y)
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)
    
    # Train Model
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluation (Quick printout)
    from sklearn.metrics import classification_report, roc_auc_score
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    print("\n--- Model Evaluation ---")
    print(classification_report(y_test, y_pred))
    print(f"ROC AUC: {roc_auc_score(y_test, y_proba):.4f}")
    
    # Save Artifacts
    os.makedirs(ARTIFACTS_DIR, exist_rule=True)
    
    model_path = os.path.join(ARTIFACTS_DIR, 'rf_model.joblib')
    features_path = os.path.join(ARTIFACTS_DIR, 'feature_columns.joblib')
    
    print(f"\nSaving model to {model_path}...")
    joblib.dump(model, model_path)
    joblib.dump(feature_columns, features_path)
    print("Artifacts saved successfully.")

if __name__ == "__main__":
    train_model()
