import { Car, ChatResponse, FilterParams } from '../types/car';

const API_BASE_URL = 'http://localhost:8000/api';

export const chatWithAI = async (message: string, history: any[] = []): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, conversation_history: history }),
  });

  if (!response.ok) {
    throw new Error('Failed to communicate with AI');
  }

  return response.json();
};

export const fetchCars = async (filters?: FilterParams): Promise<Car[]> => {
  let url = `${API_BASE_URL}/cars`;
  
  if (filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cars');
  }

  return response.json();
};
