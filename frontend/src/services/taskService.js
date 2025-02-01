import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { 
    Authorization: `Bearer ${user.token}` 
  };
};

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const getTasks = async (filters = {}) => {
  const response = await axios.get(API_URL, { 
    params: filters,
    headers: getAuthHeader() 
  });
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(API_URL + id, taskData, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(API_URL + id, { 
    headers: getAuthHeader() 
  });
  return response.data;
};