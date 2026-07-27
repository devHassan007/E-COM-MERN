import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingRoutes from '../Components/LandingPages/LandingRoutes';
import SignUp from '../Components/Auth/SignUp';
import SignIn from '../Components/Auth/SignIn';
import OTPVerification from '../Components/Auth/OTPVerification';
import UpdatePassword from '../Components/Auth/UpdatePassword';
import SendEmail from '../Components/Auth/sendEmail';
import ResetPassword from '../Components/Auth/ResetPassword';
import Products from '../Components/Products/Products';
import ProductDetails from '../Components/Products/ProductDetails';

// Route Protection
import { ProtectedRoute, GuestRoute, AdminRoute } from '../Components/Routes/ProtectedRoute';

// Cart & Order Components
import Cart from '../Components/Cart/Cart';
import Shipping from '../Components/Cart/Shipping';
import Payment from '../Components/Cart/Payment';
import ConfirmOrder from '../Components/Cart/ConfirmOrder';
import OrderSuccess from '../Components/Cart/OrderSuccess';
import MyOrders from '../Components/Orders/MyOrders';
import OrderDetails from '../Components/Orders/OrderDetails';

// Admin Components
import AdminDashboard from '../Components/Admin/AdminDashboard';
import AdminProductList from '../Components/Admin/AdminProductList';
import CreateProduct from '../Components/Admin/CreateProduct';
import EditProduct from '../Components/Admin/EditProduct';
import AdminOrderList from '../Components/Admin/AdminOrderList';
import AdminOrderDetails from '../Components/Admin/AdminOrderDetails';
import AdminUserList from '../Components/Admin/AdminUserList';
import EditUser from '../Components/Admin/EditUser';
import AdminChatDashboard from '../Components/Admin/AdminChatDashboard';
import AdminReturnsManagement from '../Components/Admin/AdminReturnsManagement';

// Customer Return Components
import MyReturns from '../Components/Returns/MyReturns';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingRoutes />} />
                <Route path="/product" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/contact" element={<LandingRoutes />} />
                <Route path="/about" element={<LandingRoutes />} />
                <Route path="/cart" element={<Cart />} />

                {/* Guest Only Routes (redirect if logged in) */}
                <Route path="/signup" element={<GuestRoute><SignUp /></GuestRoute>} />
                <Route path="/login" element={<GuestRoute><SignIn /></GuestRoute>} />
                <Route path="/otp-verification" element={<OTPVerification />} />
                <Route path="/send-email" element={<SendEmail />} />
                <Route path="/password/reset/:token" element={<ResetPassword />} />

                {/* Protected Routes (require login) */}
                <Route path="/update-password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
                <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                <Route path="/confirm-order" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                <Route path="/returns" element={<ProtectedRoute><MyReturns /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
                <Route path="/admin/product/new" element={<AdminRoute><CreateProduct /></AdminRoute>} />
                <Route path="/admin/product/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrderList /></AdminRoute>} />
                <Route path="/admin/order/:id" element={<AdminRoute><AdminOrderDetails /></AdminRoute>} />
                <Route path="/admin/returns" element={<AdminRoute><AdminReturnsManagement /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><AdminUserList /></AdminRoute>} />
                <Route path="/admin/user/edit/:id" element={<AdminRoute><EditUser /></AdminRoute>} />
                <Route path="/admin/chats" element={<AdminRoute><AdminChatDashboard /></AdminRoute>} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;