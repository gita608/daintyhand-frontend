import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://daintyhand-backend.test/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token and session ID interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  let sessionId = localStorage.getItem('session_id');
  
  // Ensure session ID exists (needed for cart/wishlist operations)
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  
  // For authenticated users, send both token and session ID
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-Session-ID'] = sessionId;
  } else {
    // For guest users, only send session ID
    config.headers['X-Session-ID'] = sessionId;
  }
  
  return config;
});

// Generate session ID for guest users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default api;

