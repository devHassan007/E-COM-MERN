import axios from 'axios';
import { baseURL } from './config';

const API_URL = baseURL;

// Get Dashboard Stats
export const getDashboardStats = async () => {
  return await axios.get(`${API_URL}/dashboard/stats`, {
    withCredentials: true,
  });
};

// Customer Return APIs
export const createReturnRequest = async (returnData) => {
  return await axios.post(`${API_URL}/return/new`, returnData, {
    withCredentials: true,
  });
};

export const getMyReturns = async () => {
  return await axios.get(`${API_URL}/returns/me`, {
    withCredentials: true,
  });
};

export const getSingleReturn = async (returnId) => {
  return await axios.get(`${API_URL}/return/${returnId}`, {
    withCredentials: true,
  });
};

// Admin Return APIs
export const getAllReturns = async (status = '') => {
  const url = status ? `${API_URL}/admin/returns?status=${status}` : `${API_URL}/admin/returns`;
  return await axios.get(url, {
    withCredentials: true,
  });
};

export const approveReturn = async (returnId, adminComment = '') => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/approve`,
    { adminComment },
    { withCredentials: true }
  );
};

export const rejectReturn = async (returnId, adminComment) => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/reject`,
    { adminComment },
    { withCredentials: true }
  );
};

export const schedulePickup = async (returnId, pickupDate) => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/pickup`,
    { pickupDate },
    { withCredentials: true }
  );
};

export const confirmItemReceived = async (returnId) => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/received`,
    {},
    { withCredentials: true }
  );
};

export const processRefund = async (returnId, refundAmount) => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/refund`,
    { refundAmount },
    { withCredentials: true }
  );
};

export const processReplacement = async (returnId) => {
  return await axios.put(
    `${API_URL}/admin/return/${returnId}/replacement`,
    {},
    { withCredentials: true }
  );
};

export const deleteReturn = async (returnId) => {
  return await axios.delete(`${API_URL}/admin/return/${returnId}`, {
    withCredentials: true,
  });
};
