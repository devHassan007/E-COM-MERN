import axios from 'axios';
import { baseURL } from './config';

const API_URL = baseURL;

// Get all users (Admin)
export const getAllUsersApi = async () => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    withCredentials: true,
  });
  return response.data;
};

// Get single user (Admin)
export const getSingleUserApi = async (id) => {
  const response = await axios.get(`${API_URL}/admin/user/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

// Update user (Admin)
export const updateUserApi = async (id, userData) => {
  const response = await axios.put(`${API_URL}/admin/user/${id}`, userData, {
    withCredentials: true,
  });
  return response.data;
};

// Delete user (Admin)
export const deleteUserApi = async (id) => {
  const response = await axios.delete(`${API_URL}/admin/user/${id}`, {
    withCredentials: true,
  });
  return response.data;
};
