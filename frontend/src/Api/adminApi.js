import API from './config';

// ==================== PRODUCT CRUD ====================

// Get all products (Admin)
export const getAdminProducts = () => API.get('/products');

// Create new product
export const createProduct = (productData) => API.post('/admin/product/new', productData);

// Update product
export const updateProduct = (id, productData) => API.put(`/admin/product/${id}`, productData);

// Delete product
export const deleteProduct = (id) => API.delete(`/admin/product/${id}`);

// Get single product details
export const getProductDetails = (id) => API.get(`/product/${id}`);

// ==================== USER CRUD (Admin) ====================

// Get all users
export const getAllUsers = () => API.get('/admin/users');

// Get single user
export const getSingleUser = (id) => API.get(`/admin/user/${id}`);

// Update user role
export const updateUser = (id, userData) => API.put(`/admin/user/${id}`, userData);

// Delete user
export const deleteUser = (id) => API.delete(`/admin/user/${id}`);

// ==================== ORDER CRUD (Admin) ====================

// Get all orders
export const getAllOrders = () => API.get('/admin/orders');

// Update order status
export const updateOrder = (id, orderData) => API.put(`/admin/order/${id}`, orderData);

// Delete order
export const deleteOrder = (id) => API.delete(`/admin/order/${id}`);
