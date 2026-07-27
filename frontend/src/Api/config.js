import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const API = axios.create({
  baseURL,
  withCredentials: true,
});

export default API;
export { baseURL };
