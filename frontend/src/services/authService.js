// authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Corregido para usar el nombre consistente

export const register = async (name, email, password) => {
  try {
    const response = await axios.post(API_URL + 'register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL + 'login', { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data.message);
    throw new Error(error.response.data.message);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};
