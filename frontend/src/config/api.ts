// API Configuration
// In production (Vercel), use relative URLs so API calls go to /api/*
// In development, use localhost:5000
export const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
