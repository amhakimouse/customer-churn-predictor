import React, { useState } from 'react';
import { CustomerFeatures } from '../types';

interface CustomerFormProps {
  onSubmit: (data: CustomerFeatures) => void;
  isLoading: boolean;
}

const defaultValues: CustomerFeatures = {
  Age: 40,
  Gender: 'F',
  MaritalStatus: 'Married',
  IncomeLevel: 'Medium',
  TotalAmountSpent: 1200,
  TransactionCount: 12,
  AverageTransactionValue: 100,
  MostFrequentProductCategory: 'Electronics',
  InteractionCount_CS: 2,
  Complaint_Count_CS: 0,
  Feedback_Count_CS: 1,
  Inquiry_Count_CS: 1,
  UnresolvedCount_CS: 0,
  UnresolvedRatio_CS: 0.0,
  TotalLoginFrequency: 15,
  MostFrequentServiceUsage: 'Mobile App'
};

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CustomerFeatures>(defaultValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number = value;
    if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: parsedValue };
      // Auto-calculate ratio if dependencies change
      if (name === 'UnresolvedCount_CS' || name === 'InteractionCount_CS') {
        const unresolved = name === 'UnresolvedCount_CS' ? Number(parsedValue) : prev.UnresolvedCount_CS;
        const total = name === 'InteractionCount_CS' ? Number(parsedValue) : prev.InteractionCount_CS;
        newData.UnresolvedRatio_CS = total > 0 ? Number((unresolved / total).toFixed(2)) : 0;
      }
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full p-2 bg-background border border-border rounded text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
  const labelClass = "block text-sm font-medium text-textMuted mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-primary">Demographics</h3>
          
          <div>
            <label className={labelClass}>Age</label>
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} min="18" max="100" required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange} className={inputClass}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Marital Status</label>
            <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className={inputClass}>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Income Level</label>
            <select name="IncomeLevel" value={formData.IncomeLevel} onChange={handleChange} className={inputClass}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Behavior */}
        <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-primary">Financial & Activity</h3>
          
          <div>
            <label className={labelClass}>Total Amount Spent ($)</label>
            <input type="number" name="TotalAmountSpent" value={formData.TotalAmountSpent} onChange={handleChange} min="0" step="0.01" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Transaction Count</label>
            <input type="number" name="TransactionCount" value={formData.TransactionCount} onChange={handleChange} min="0" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Login Frequency (Last 30 Days)</label>
            <input type="number" name="TotalLoginFrequency" value={formData.TotalLoginFrequency} onChange={handleChange} min="0" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Preferred Platform</label>
            <select name="MostFrequentServiceUsage" value={formData.MostFrequentServiceUsage} onChange={handleChange} className={inputClass}>
              <option value="Mobile App">Mobile App</option>
              <option value="Website">Website</option>
            </select>
          </div>
        </div>

        {/* Customer Service */}
        <div className="space-y-4 p-4 bg-background rounded-lg border border-border md:col-span-2">
          <h3 className="text-lg font-semibold text-primary">Customer Service Interactions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Total CS Interactions</label>
              <input type="number" name="InteractionCount_CS" value={formData.InteractionCount_CS} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unresolved Issues</label>
              <input type="number" name="UnresolvedCount_CS" value={formData.UnresolvedCount_CS} onChange={handleChange} min="0" max={formData.InteractionCount_CS} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Complaints Count</label>
              <input type="number" name="Complaint_Count_CS" value={formData.Complaint_Count_CS} onChange={handleChange} min="0" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary hover:bg-primaryHover text-white font-bold rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="animate-pulse">Analyzing...</span>
        ) : (
          'Predict Churn Risk'
        )}
      </button>
    </form>
  );
};
