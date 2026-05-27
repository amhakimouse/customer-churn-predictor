import axios from 'axios';
import { CustomerFeatures, PredictionResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const predictChurn = async (data: CustomerFeatures): Promise<PredictionResponse> => {
  const response = await axios.post(`${API_URL}/predict`, data);
  return response.data;
};

export const checkHealth = async () => {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
};
