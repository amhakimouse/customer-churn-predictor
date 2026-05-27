import React, { useState } from 'react';
import { CustomerForm } from './components/CustomerForm';
import { GaugeResult } from './components/GaugeResult';
import { predictChurn } from './services/api';
import { CustomerFeatures, PredictionResponse } from './types';
import { ShieldAlert } from 'lucide-react';

function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: CustomerFeatures) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await predictChurn(data);
      setPrediction(result);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to prediction service. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-textMain py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-card rounded-full border border-border">
              <ShieldAlert className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Customer Churn Predictor
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto">
            Interactive ML-powered dashboard to analyze customer behavior and predict churn risk in real-time.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-900/50 border border-red-500 rounded-lg text-center text-red-200">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-xl border border-border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 border-b border-border pb-4">Customer Profile</h2>
              <CustomerForm onSubmit={handlePredict} isLoading={isLoading} />
            </div>
          </div>
          
          <div className="lg:col-span-1 flex flex-col space-y-8">
            {prediction ? (
              <GaugeResult probability={prediction.churn_probability} riskLevel={prediction.risk_level} />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl h-full shadow-lg text-textMuted text-center space-y-4">
                <ShieldAlert className="w-16 h-16 opacity-50" />
                <p className="text-lg">Submit customer profile to view churn risk analysis.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 text-center text-textMuted text-sm flex items-center justify-center space-x-2">
          <span>Created by</span>
          <a 
            href="https://github.com/amhakimouse" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary hover:text-primaryHover transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-semibold">Hakim</span>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
