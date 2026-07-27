import API from './config';

// Create new order
export const createOrder = (orderData) => API.post('/order/new', orderData);

// Get single order details
export const getOrderDetails = (id) => API.get(`/order/${id}`);

// Get logged-in user's orders
export const myOrders = () => API.get('/orders/me');

// Admin - Get all orders
export const getAllOrders = () => API.get('/admin/orders');

// Admin - Update order status
export const updateOrder = (id, orderData) => API.put(`/admin/order/${id}`, orderData);

// Admin - Delete order
export const deleteOrder = (id) => API.delete(`/admin/order/${id}`);
