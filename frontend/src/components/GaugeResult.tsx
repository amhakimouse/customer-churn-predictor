import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface GaugeResultProps {
  probability: number;
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
}

export const GaugeResult: React.FC<GaugeResultProps> = ({ probability, riskLevel }) => {
  const getIcon = () => {
    switch (riskLevel) {
      case 'Low Risk':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Medium Risk':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'High Risk':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (riskLevel) {
      case 'Low Risk':
        return 'text-green-500';
      case 'Medium Risk':
        return 'text-yellow-500';
      case 'High Risk':
        return 'text-red-500';
      default:
        return 'text-textMain';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl shadow-lg w-full">
      <h2 className="text-xl font-semibold mb-4 text-textMain">Churn Prediction Result</h2>
      
      <div className="w-full max-w-sm mb-6">
        <GaugeChart 
          id="churn-gauge" 
          nrOfLevels={3} 
          colors={["#22c55e", "#eab308", "#ef4444"]} 
          arcWidth={0.3} 
          percent={probability} 
          textColor="#f8fafc"
          needleColor="#94a3b8"
          needleBaseColor="#94a3b8"
          hideText={true}
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-2">
        <div className="text-4xl font-bold">
          {(probability * 100).toFixed(1)}%
        </div>
        <div className="text-textMuted text-sm tracking-wider uppercase">
          Probability of Churn
        </div>
        
        <div className={`flex items-center space-x-2 mt-4 px-4 py-2 rounded-full bg-background border border-border ${getTextColor()}`}>
          {getIcon()}
          <span className="font-semibold text-lg">{riskLevel}</span>
        </div>
      </div>
    </div>
  );
};
