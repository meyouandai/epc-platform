const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://epc-platform-production.up.railway.app';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API call to:', url); // Debug log
  return fetch(url, options);
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};