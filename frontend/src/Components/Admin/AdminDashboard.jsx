import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { getDashboardStats } from '../../Api/returnApi';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data } = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const dashboardCards = stats ? [
    { 
      title: 'Total Products', 
      value: formatNumber(stats.totalProducts), 
      icon: FiPackage, 
      color: 'amber',
      link: '/admin/products'
    },
    { 
      title: 'Total Orders', 
      value: formatNumber(stats.totalOrders), 
      icon: FiShoppingBag, 
      color: 'blue',
      link: '/admin/orders'
    },
    { 
      title: 'Total Users', 
      value: formatNumber(stats.totalUsers), 
      icon: FiUsers, 
      color: 'green',
      link: '/admin/users'
    },
    { 
      title: 'Total Revenue', 
      value: formatCurrency(stats.totalRevenue), 
      icon: FiDollarSign, 
      color: 'purple',
      link: '/admin/orders'
    },
  ] : [];

  const getColorClasses = (color) => {
    const colors = {
      amber: 'bg-amber-500/20 text-amber-400',
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
    };
    return colors[color] || colors.amber;
  };

  const getStatusColor = (status) => {
    const colors = {
      Processing: 'bg-blue-500/20 text-blue-400',
      Shipped: 'bg-purple-500/20 text-purple-400',
      Delivered: 'bg-green-500/20 text-green-400',
      Cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome to your admin dashboard</p>
          </div>
          <button
            onClick={fetchDashboardStats}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
          >
            <FiRefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <stat.icon size={24} />
                </div>
                <FiArrowRight className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-gray-400 text-sm mt-4">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/product/new"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <FiPackage className="text-amber-400" />
              </div>
              <span className="text-white">Add New Product</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiShoppingBag className="text-green-400" />
              </div>
              <span className="text-white">Manage Orders</span>
            </Link>
            <Link
              to="/admin/returns"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiRefreshCw className="text-blue-400" />
              </div>
              <span className="text-white">Manage Returns</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiUsers className="text-purple-400" />
              </div>
              <span className="text-white">Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link to="/admin/orders" className="text-amber-400 text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                        <FiShoppingBag className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">Order #{order._id.slice(-8)}</p>
                        <p className="text-gray-500 text-xs">
                          {order.orderItems?.length || 0} items • {formatCurrency(order.paymentInfo?.totalPrice || 0)}
                        </p>
                        <p className="text-gray-600 text-xs">{order.user?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.paymentInfo?.orderStatus)}`}>
                      {order.paymentInfo?.orderStatus || 'Unknown'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiShoppingBag size={40} className="mx-auto mb-2 opacity-50" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Top Selling Products</h2>
              <Link to="/admin/products" className="text-amber-400 text-sm hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.productImage || '/placeholder.png'}
                        alt={product.productName}
                        className="w-10 h-10 bg-gray-700 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white text-sm font-medium">{product.productName}</p>
                        <p className="text-gray-500 text-xs">{product.totalSold} sold • {formatCurrency(product.productPrice)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                      <FiTrendingUp size={14} />
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiPackage size={40} className="mx-auto mb-2 opacity-50" />
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
