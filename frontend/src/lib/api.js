import axios from 'axios';

// URL base del backend. Puede ser configurada mediante variables de entorno en producción.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true, // Indispensable para que se envíen las cookies httpOnly (access_token)
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
