import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jotspace-backend.onrender.com';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial: Automatically sends HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle global errors (e.g. session expiration)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the user is unauthorized
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/me')) {
        // Force redirect to login on 401
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
