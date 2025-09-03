import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Eye, 
  LogOut,
  Shield,
  ChevronDown,
  Filter,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  ChevronUp
} from 'lucide-react';
import { 
  auth, 
  fetchAllUsers, 
  fetchAllOrders, 
  fetchAllCarts, 
  updateOrderStatus,
  checkAdminStatus,
  firedb
} from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderUpdateLoading, setOrderUpdateLoading] = useState(false);
  const [orderUserData, setOrderUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  // Check admin authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const isAdmin = await checkAdminStatus(user.uid);
          if (isAdmin) {
            setCurrentAdmin(user);
            await loadAllData();
          } else {
            console.warn('Unauthorized access attempt to admin panel');
            navigate('/rodella-admin-access-2024');
          }
        } else {
          navigate('/rodella-admin-access-2024');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/rodella-admin-access-2024');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load all admin data
  const loadAllData = async () => {
    setDataLoading(true);
    try {
      const [usersData, ordersData, cartsData] = await Promise.all([
        fetchAllUsers(),
        fetchAllOrders(),
        fetchAllCarts()
      ]);
      
      setUsers(usersData || []);
      setOrders(ordersData || []);
      setCarts(cartsData || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Set empty arrays as fallback
      setUsers([]);
      setOrders([]);
      setCarts([]);
    } finally {
      setDataLoading(false);
    }
  };

  // Handle admin logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Clear all admin-related localStorage items
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminAuthToken');
      
      // Reset state
      setCurrentAdmin(null);
      setUsers([]);
      setOrders([]);
      setCarts([]);
      setSelectedOrder(null);
      setShowOrderDetails(false);
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  // Fetch user data for order details
  const fetchOrderUserData = async (uid) => {
    if (!uid) {
      setLoadingUserData(false);
      return null;
    }
    
    setLoadingUserData(true);
    try {
      const userRef = doc(firedb, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setOrderUserData(userData);
        return userData;
      } else {
        console.warn(`User document not found for UID: ${uid}`);
        setOrderUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setOrderUserData(null);
    } finally {
      setLoadingUserData(false);
    }
    return null;
  };

  // Update order status
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setOrderUpdateLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
    setOrderUpdateLoading(false);
  };

  // Handle order details modal with user data fetch
  const handleOrderDetailsView = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
    setOrderUserData(null);
    
    // Fetch user data for this order
    if (order.uid) {
      await fetchOrderUserData(order.uid);
    }
    setLoadingUserData(false);
  };

  // Toggle user details expansion
  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter(order => {
    try {
      const matchesStatus = statusFilter === 'all' || 
        (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());
      
      if (searchTerm === '') return matchesStatus;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
        (order.customerEmail && order.customerEmail.toLowerCase().includes(searchLower)) ||
        (order.orderId && order.orderId.toLowerCase().includes(searchLower)) ||
        (order.razorpayPaymentId && order.razorpayPaymentId.toLowerCase().includes(searchLower));
      
      return matchesStatus && matchesSearch;
    } catch (error) {
      console.error('Error filtering order:', error, order);
      return false;
    }
  });

  // Calculate statistics with error handling
  const stats = {
    totalUsers: Array.isArray(users) ? users.length : 0,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    totalRevenue: Array.isArray(orders) ? orders.reduce((sum, order) => {
      try {
        return sum + (parseFloat(order.total) || 0);
      } catch (error) {
        console.warn('Invalid order total:', order.total);
        return sum;
      }
    }, 0) : 0,
    activeCarts: Array.isArray(carts) ? carts.filter(cart => 
      cart && Array.isArray(cart.items) && cart.items.length > 0
    ).length : 0,
    completedOrders: Array.isArray(orders) ? orders.filter(order => 
      order && order.status === 'Completed'
    ).length : 0,
    processingOrders: Array.isArray(orders) ? orders.filter(order => 
      order && order.status === 'Processing'
    ).length : 0,
    pendingOrders: Array.isArray(orders) ? orders.filter(order => 
      order && order.status === 'Pending'
    ).length : 0
  };

  // Format currency with error handling
  const formatCurrency = (amount) => {
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) return '₹0.00';
      
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(numAmount);
    } catch (error) {
      console.warn('Currency formatting error:', amount);
      return '₹0.00';
    }
  };

  // Format date with error handling
  const formatDate = (date) => {
    try {
      if (!date) return 'N/A';
      
      let dateObj;
      if (date.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date(date);
      }
      
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.warn('Date formatting error:', date);
      return 'Invalid Date';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'processing':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'pending':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-base sm:text-lg">Loading Admin Dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2 sm:mr-3 flex-shrink-0" />
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={loadAllData}
                disabled={dataLoading}
                className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${dataLoading ? 'animate-spin' : ''} ${dataLoading ? '' : 'sm:mr-2'}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <div className="hidden md:block text-xs sm:text-sm text-gray-300 max-w-32 lg:max-w-none">
                <span className="font-medium truncate block">{currentAdmin?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-2 py-1.5 sm:px-3 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-6 sm:mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'carts', label: 'Carts', icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 sm:px-4 rounded-lg transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Users</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-500 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Total Orders</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Revenue</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-500 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm">Active Carts</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{stats.activeCarts}</p>
                  </div>
                  <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-500 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Order Status Overview */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Order Status Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center min-w-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-green-400 text-sm sm:text-base truncate">Completed</span>
                  </div>
                  <span className="text-green-400 font-semibold text-sm sm:text-base">{stats.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center min-w-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="text-yellow-400 text-sm sm:text-base truncate">Processing</span>
                  </div>
                  <span className="text-yellow-400 font-semibold text-sm sm:text-base">{stats.processingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center min-w-0">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-orange-400 text-sm sm:text-base truncate">Pending</span>
                  </div>
                  <span className="text-orange-400 font-semibold text-sm sm:text-base">{stats.pendingOrders}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">All Users ({users.length})</h3>
              
              {/* Users Grid Layout */}
              <div className="space-y-4">
                {users.map((user) => {
                  const isExpanded = expandedUsers.has(user.id);
                  
                  return (
                    <div key={user.id} className="bg-gray-700/30 border border-gray-600 rounded-xl overflow-hidden">
                      {/* Compact User Header */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                                {user.firstName || user.lastName ? 
                                  `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                                  user.name || 'Unknown User'
                                }
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm truncate">{user.email}</p>
                              <p className="text-gray-500 text-xs hidden sm:block">{user.phone || 'No phone number'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            {/* Account Type Badge */}
                            <span className={`inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs rounded-full font-medium ${
                              user.isAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              <span className="hidden sm:inline">{user.isAdmin ? '👑 Admin' : '👤 User'}</span>
                              <span className="sm:hidden">{user.isAdmin ? '👑' : '👤'}</span>
                            </span>
                            
                            {/* Orders Count Badge */}
                            <span className="inline-flex px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                              <span className="hidden sm:inline">{orders.filter(order => order.uid === user.id).length} orders</span>
                              <span className="sm:hidden">{orders.filter(order => order.uid === user.id).length}</span>
                            </span>
                            
                            {/* Toggle Button */}
                            <button
                              onClick={() => toggleUserExpansion(user.id)}
                              className="flex items-center px-2 py-1 sm:px-3 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors text-xs sm:text-sm"
                            >
                              <span className="hidden sm:inline mr-1">{isExpanded ? 'Hide Details' : 'View More'}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-600"
                          >
                            <div className="p-3 sm:p-4 lg:p-6">
                              {/* User Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      {/* Personal Information */}
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3 flex items-center">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Personal Information
                        </h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div>
                              <p className="text-xs text-gray-400">First Name</p>
                              <p className="text-white text-sm sm:text-base truncate">{user.firstName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Last Name</p>
                              <p className="text-white text-sm sm:text-base truncate">{user.lastName || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Full Name</p>
                            <p className="text-white text-sm sm:text-base truncate">{user.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-white text-sm sm:text-base break-all">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p className="text-white text-sm sm:text-base">{user.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          Address Information
                        </h5>
                        {user.address && (
                          user.address.street || 
                          user.address.city || 
                          user.address.state || 
                          user.address.zipCode || 
                          user.address.country
                        ) ? (
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-400">Street Address</p>
                              <p className="text-white">{user.address.street || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">City</p>
                                <p className="text-white">{user.address.city || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">State</p>
                                <p className="text-white">{user.address.state || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-400">ZIP Code</p>
                                <p className="text-white">{user.address.zipCode || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">Country</p>
                                <p className="text-white">{user.address.country || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="mt-3 p-2 bg-gray-700/50 rounded text-xs">
                              <p className="text-gray-300 font-medium">Complete Address:</p>
                              <p className="text-white mt-1">
                                {[
                                  user.address.street,
                                  user.address.city,
                                  user.address.state,
                                  user.address.zipCode,
                                  user.address.country
                                ].filter(Boolean).join(', ')}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No address information provided</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Account Information
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">User ID</p>
                          <p className="text-white font-mono text-xs break-all">{user.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Account Type</p>
                          <p className="text-white">{user.isAdmin ? 'Administrator' : 'Regular User'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Profile Status</p>
                          <p className="text-white">
                            {user.firstName && user.lastName && user.phone && user.address?.street ? 
                              'Complete' : 'Incomplete'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Activity Summary */}
                    <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Activity Summary
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Total Orders</p>
                          <p className="text-white font-semibold">
                            {orders.filter(order => order.uid === user.id).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Total Spent</p>
                          <p className="text-white font-semibold">
                            {formatCurrency(
                              orders
                                .filter(order => order.uid === user.id)
                                .reduce((sum, order) => sum + (order.total || 0), 0)
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Active Cart</p>
                          <p className="text-white">
                            {carts.find(cart => cart.uid === user.id && cart.items.length > 0) ? 
                              `${carts.find(cart => cart.uid === user.id).items.length} items` : 
                              'Empty'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                      <button 
                        onClick={() => {
                          const userOrders = orders.filter(order => order.uid === user.id);
                          if (userOrders.length > 0) {
                            setActiveTab('orders');
                            setSearchTerm(user.email);
                          } else {
                            alert('This user has no orders');
                          }
                        }}
                        className="px-2 py-1 sm:px-3 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors"
                      >
                        <span className="hidden sm:inline">View Orders ({orders.filter(order => order.uid === user.id).length})</span>
                        <span className="sm:hidden">Orders ({orders.filter(order => order.uid === user.id).length})</span>
                      </button>
                      
                      {carts.find(cart => cart.uid === user.id && cart.items.length > 0) && (
                        <button 
                          onClick={() => {
                            setActiveTab('carts');
                          }}
                          className="px-2 py-1 sm:px-3 bg-purple-600/20 text-purple-400 rounded-lg text-xs hover:bg-purple-600/30 transition-colors"
                        >
                          <span className="hidden sm:inline">View Cart</span>
                          <span className="sm:hidden">Cart</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                          alert('Email copied to clipboard');
                        }}
                        className="px-2 py-1 sm:px-3 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors"
                      >
                        <span className="hidden sm:inline">Copy Email</span>
                        <span className="sm:hidden">Email</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(user.id);
                          alert('User ID copied to clipboard');
                        }}
                        className="px-2 py-1 sm:px-3 bg-gray-600/20 text-gray-400 rounded-lg text-xs hover:bg-gray-600/30 transition-colors"
                      >
                        <span className="hidden sm:inline">Copy ID</span>
                        <span className="sm:hidden">ID</span>
                      </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {(!Array.isArray(users) || users.length === 0) && !dataLoading && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-base sm:text-lg font-medium text-gray-400 mb-2">No Users Found</h4>
                  <p className="text-sm sm:text-base text-gray-500">
                    {!Array.isArray(users) ? 'Unable to load user data.' : 'No registered users in the system.'}
                  </p>
                  {!Array.isArray(users) && (
                    <button 
                      onClick={loadAllData}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Retry Loading
                    </button>
                  )}
                </div>
              )}
              
              {/* Loading State */}
              {dataLoading && (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm sm:text-base">Loading users...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-7 sm:px-4 sm:pr-8 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Orders ({filteredOrders.length})
              </h3>
              
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-gray-700/30 border border-gray-600 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-mono text-xs truncate">
                            {order.orderId?.slice(0, 8)}...
                          </span>
                          <span className="text-white font-semibold text-sm">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        <p className="text-white text-sm truncate">{order.customerName}</p>
                        <p className="text-gray-400 text-xs truncate">{order.customerEmail}</p>
                        <p className="text-gray-400 text-xs">{formatDate(order.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => handleOrderDetailsView(order)}
                        className="flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs ml-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                          disabled={orderUpdateLoading}
                          className={`appearance-none border rounded-lg px-2 py-1 pr-6 text-xs font-medium ${getStatusColor(order.status)} focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                      <span className="text-gray-300 font-mono text-xs">
                        {order.razorpayPaymentId?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Payment ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-3 px-4 text-white font-mono text-sm">
                          {order.orderId?.slice(0, 12)}...
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="text-white text-sm">{order.customerName}</div>
                            <div className="text-gray-400 text-xs">{order.customerEmail}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-semibold text-sm">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-xs">
                          {order.razorpayPaymentId?.slice(0, 12)}...
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              disabled={orderUpdateLoading}
                              className={`appearance-none border rounded-lg px-3 py-1 pr-8 text-xs font-medium ${getStatusColor(order.status)} focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-xs">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOrderDetailsView(order)}
                            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Carts Tab */}
        {activeTab === 'carts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                Active Carts ({carts.filter(cart => cart.items.length > 0).length})
              </h3>
              <div className="space-y-6">
                {carts
                  .filter(cart => cart.items.length > 0)
                  .map((cart) => {
                    const user = users.find(u => u.id === cart.uid);
                    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                    const totalValue = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
                    
                    return (
                      <div key={cart.uid} className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 sm:p-6">
                        {/* User Header */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-600">
                          <div className="flex items-center min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-white font-semibold text-sm sm:text-base">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-white text-sm sm:text-base truncate">{user?.name || 'Unknown User'}</h4>
                              <p className="text-xs sm:text-sm text-gray-400 truncate">{user?.email}</p>
                              {user?.phone && (
                                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">📞 {user.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center text-purple-400 mb-1">
                              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="font-medium text-xs sm:text-sm">{totalItems} items</span>
                            </div>
                            <p className="text-white font-bold text-sm sm:text-lg">{formatCurrency(totalValue)}</p>
                          </div>
                        </div>

                        {/* Cart Items Details */}
                        <div>
                          <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">Cart Items:</h5>
                          <div className="space-y-2 sm:space-y-3">
                            {cart.items.map((item, index) => (
                              <div key={index} className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                  <div className="flex items-start flex-1">
                                    {/* Product Image */}
                                    {item.product?.image && (
                                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-lg overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                                        <img
                                          src={item.product.image}
                                          alt={item.product.title}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      </div>
                                    )}
                                    
                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                      <h6 className="text-white font-medium text-sm sm:text-base truncate">
                                        {item.product?.title || item.title || 'Unknown Product'}
                                      </h6>
                                      
                                      {/* Mobile Price - Show early on mobile */}
                                      <div className="sm:hidden mt-1">
                                        <p className="text-white font-semibold text-sm">
                                          {formatCurrency(item.totalPrice)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {formatCurrency(item.unitPrice)} × {item.quantity}
                                        </p>
                                      </div>
                                      
                                      <div className="mt-1 space-y-0.5 sm:space-y-1">
                                        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-400 gap-2 sm:gap-3">
                                          <span>Qty: {item.quantity}</span>
                                          {item.length && item.length !== 1 && (
                                            <span>Length: {item.length}m</span>
                                          )}
                                          {item.product?.selectedSize && (
                                            <span>Size: {item.product.selectedSize}</span>
                                          )}
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-400 gap-2 sm:gap-3">
                                          {item.area && item.area > 0 && (
                                            <span>Area: {item.area.toFixed(2)} sq.m</span>
                                          )}
                                          {item.weight && item.weight > 0 && (
                                            <span>Weight: {item.weight.toFixed(2)} kg</span>
                                          )}
                                        </div>
                                        
                                        <div className="text-xs sm:text-sm text-gray-400">
                                          Unit: {formatCurrency(item.unitPrice)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Price - Desktop Only */}
                                  <div className="hidden sm:block text-right ml-4 flex-shrink-0">
                                    <p className="text-white font-semibold">
                                      {formatCurrency(item.totalPrice)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatCurrency(item.unitPrice)} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Product Type Badges */}
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {item.product?.isCompositePlate && (
                                    <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                                      <span className="hidden sm:inline">Composite Plate</span>
                                      <span className="sm:hidden">Composite</span>
                                    </span>
                                  )}
                                  {item.product?.isTubeProduct && (
                                    <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-green-500/20 text-green-400 rounded">
                                      <span className="hidden sm:inline">Tube Product</span>
                                      <span className="sm:hidden">Tube</span>
                                    </span>
                                  )}
                                  {item.product?.isReinforcementProduct && (
                                    <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                                      <span className="hidden sm:inline">Reinforcement</span>
                                      <span className="sm:hidden">Reinforce</span>
                                    </span>
                                  )}
                                  {item.product?.isCoreProduct && (
                                    <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-orange-500/20 text-orange-400 rounded">
                                      <span className="hidden sm:inline">Core Material</span>
                                      <span className="sm:hidden">Core</span>
                                    </span>
                                  )}
                                  {item.product?.isEpoxyProduct && (
                                    <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-red-500/20 text-red-400 rounded">
                                      <span className="hidden sm:inline">Epoxy System</span>
                                      <span className="sm:hidden">Epoxy</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cart Summary */}
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                            <div className="text-xs sm:text-sm text-gray-400">
                              <span className="hidden sm:inline">Last updated: </span>
                              <span className="sm:hidden">Updated: </span>
                              {cart.items[0]?.addedAt ? 
                                new Date(cart.items[0].addedAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'
                              }
                            </div>
                            <div className="flex justify-between sm:text-right">
                              <div className="sm:hidden">
                                <p className="text-xs text-gray-400">Items: {totalItems}</p>
                                <p className="text-sm font-bold text-white">{formatCurrency(totalValue)}</p>
                              </div>
                              <div className="hidden sm:block">
                                <p className="text-sm text-gray-400">Total Items: {totalItems}</p>
                                <p className="text-lg font-bold text-white">{formatCurrency(totalValue)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* Empty State */}
              {carts.filter(cart => cart.items.length > 0).length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-400 mb-2">No Active Carts</h4>
                  <p className="text-gray-500">No users currently have items in their carts.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-3 sm:p-4 lg:p-6 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] lg:max-h-[80vh] overflow-y-auto mx-1 sm:mx-2 lg:mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Order Details</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Order ID</label>
                    <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Payment ID</label>
                    <p className="text-white font-mono text-xs sm:text-sm break-all">{selectedOrder.razorpayPaymentId}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Order Date</label>
                    <p className="text-white text-xs sm:text-sm">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Total Amount</label>
                    <p className="text-white font-semibold text-sm sm:text-lg">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Payment Status</label>
                    <p className="text-green-400 text-xs sm:text-sm">{selectedOrder.paymentStatus || 'Completed'}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm text-gray-400 mb-1">Payment Method</label>
                    <p className="text-white text-xs sm:text-sm">{selectedOrder.paymentMethod || 'Razorpay'}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">Name</label>
                      <p className="text-white text-sm sm:text-base break-words">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">Email</label>
                      <p className="text-white text-sm sm:text-base break-all">{selectedOrder.customerEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">Phone</label>
                      <p className="text-white text-sm sm:text-base">{selectedOrder.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm text-gray-400 mb-1">Customer ID</label>
                      <p className="text-white font-mono text-xs break-all">{selectedOrder.uid}</p>
                    </div>
                  </div>
                  
                  {/* Customer Address */}
                  <div className="mt-3 sm:mt-4">
                    <label className="block text-xs sm:text-sm text-gray-400 mb-2">Customer Address</label>
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3">
                      {loadingUserData ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                          <span className="text-gray-400 text-xs sm:text-sm">Loading address...</span>
                        </div>
                      ) : (
                        <>
                          {/* Try to show address from user profile first */}
                          {orderUserData?.address && (
                            orderUserData.address.street || 
                            orderUserData.address.city || 
                            orderUserData.address.state
                          ) ? (
                            <div className="space-y-1">
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">Street:</span> {orderUserData.address.street || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">City:</span> {orderUserData.address.city || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">State:</span> {orderUserData.address.state || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">ZIP:</span> {orderUserData.address.zipCode || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">Country:</span> {orderUserData.address.country || 'N/A'}
                              </p>
                            </div>
                          ) : 
                          /* Fallback to order data if available */
                          (selectedOrder.shippingAddress || selectedOrder.customerAddress) ? (
                            <div className="space-y-1">
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">Street:</span> {(selectedOrder.shippingAddress?.street || selectedOrder.customerAddress?.street) || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">City:</span> {(selectedOrder.shippingAddress?.city || selectedOrder.customerAddress?.city) || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">State:</span> {(selectedOrder.shippingAddress?.state || selectedOrder.customerAddress?.state) || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">ZIP:</span> {(selectedOrder.shippingAddress?.zipCode || selectedOrder.customerAddress?.zipCode) || 'N/A'}
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                <span className="text-gray-400">Country:</span> {(selectedOrder.shippingAddress?.country || selectedOrder.customerAddress?.country) || 'N/A'}
                              </p>
                              <p className="text-xs text-yellow-400 mt-1 sm:mt-2">⚠ From order data</p>
                            </div>
                          ) : (
                            <div className="space-y-1 sm:space-y-2">
                              <p className="text-gray-400 text-xs sm:text-sm">No address information available</p>
                              <p className="text-xs text-red-400">Address not found</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2">Order Status</label>
                  <div className="relative inline-block w-full sm:w-auto">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleOrderStatusUpdate(selectedOrder.id, e.target.value)}
                      disabled={orderUpdateLoading}
                      className={`appearance-none border rounded-lg px-3 py-2 pr-7 sm:px-4 sm:pr-8 font-medium text-sm sm:text-base w-full sm:w-auto ${getStatusColor(selectedOrder.status)} focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Order Items - Detailed */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Order Items ({selectedOrder.items?.length || 0})</label>
                  <div className="space-y-3 sm:space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3">
                          <div className="flex items-start flex-1">
                            {/* Product Image */}
                            {item.image && (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-lg overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2 break-words">{item.title}</h4>
                              
                              {/* Price Summary - Mobile First */}
                              <div className="sm:hidden mb-2">
                                <p className="text-white font-bold text-base">{formatCurrency(item.totalPrice)}</p>
                                <p className="text-gray-400 text-xs">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                              </div>
                              
                              {/* Basic Details */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                                <div className="space-y-1">
                                  <p className="text-xs sm:text-sm"><span className="text-gray-400">Qty:</span> <span className="text-white">{item.quantity}</span></p>
                                  <p className="text-xs sm:text-sm"><span className="text-gray-400">Unit Price:</span> <span className="text-white">{formatCurrency(item.unitPrice)}</span></p>
                                  <p className="text-xs sm:text-sm hidden sm:block"><span className="text-gray-400">Total:</span> <span className="text-white font-semibold">{formatCurrency(item.totalPrice)}</span></p>
                                </div>
                                <div className="space-y-1">
                                  {item.weight && (
                                    <p className="text-xs sm:text-sm"><span className="text-gray-400">Weight:</span> <span className="text-white">{item.weight.toFixed(2)} kg</span></p>
                                  )}
                                  {item.area && item.area > 0 && (
                                    <p className="text-xs sm:text-sm"><span className="text-gray-400">Area:</span> <span className="text-white">{item.area.toFixed(2)} sq.m</span></p>
                                  )}
                                  {item.length && item.length !== 1 && (
                                    <p className="text-xs sm:text-sm"><span className="text-gray-400">Length:</span> <span className="text-white">{item.length}m</span></p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Summary - Desktop */}
                          <div className="hidden sm:block text-right ml-4 flex-shrink-0">
                            <p className="text-white font-bold text-xl">{formatCurrency(item.totalPrice)}</p>
                            <p className="text-gray-400 text-sm">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                            {item.weight && (
                              <p className="text-gray-400 text-xs mt-1">Weight: {item.weight.toFixed(2)} kg</p>
                            )}
                          </div>
                        </div>

                        {/* Product Categories */}
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {item.isCompositePlate && (
                            <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                              Composite
                            </span>
                          )}
                          {item.isTubeProduct && (
                            <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                              Tube
                            </span>
                          )}
                          {item.isReinforcementProduct && (
                            <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                              Reinforcement
                            </span>
                          )}
                          {item.isCoreProduct && (
                            <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                              Core
                            </span>
                          )}
                          {item.isEpoxyProduct && (
                            <span className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-red-500/20 text-red-400 rounded border border-red-500/30">
                              Epoxy
                            </span>
                          )}
                        </div>

                        {/* Detailed Specifications - Collapsible on Mobile */}
                        <div className="border-t border-gray-600 pt-2 sm:pt-0 sm:border-t-0">
                          <h5 className="text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Specifications:</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
                            
                            {/* Tube Product Dimensions */}
                            {item.dimensions && (
                              <div className="space-y-0.5 sm:space-y-1">
                                <p><span className="text-gray-400">Size:</span> <span className="text-white">{item.dimensions.size}</span></p>
                                <p><span className="text-gray-400">Wall:</span> <span className="text-white">{item.dimensions.wallThickness}mm</span></p>
                                <p><span className="text-gray-400">Length:</span> <span className="text-white">{item.dimensions.length}mm</span></p>
                              </div>
                            )}

                            {/* Epoxy Product Size */}
                            {item.selectedSize && (
                              <div>
                                <p><span className="text-gray-400">Size:</span> <span className="text-white">{item.selectedSize}</span></p>
                              </div>
                            )}

                            {/* Additional Product Details */}
                            <div className="space-y-0.5 sm:space-y-1">
                              <p><span className="text-gray-400">ID:</span> <span className="text-white font-mono text-xs break-all">{item.id}</span></p>
                              {item.material && (
                                <p><span className="text-gray-400">Material:</span> <span className="text-white">{item.material}</span></p>
                              )}
                            </div>
                          </div>

                          {/* Manufacturing Details - Compact for Mobile */}
                          {(item.isTubeProduct || item.isReinforcementProduct || item.isCoreProduct) && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-600">
                              <h6 className="text-xs font-medium text-gray-300 mb-1">Manufacturing:</h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 text-xs">
                                {item.isTubeProduct && (
                                  <>
                                    <p><span className="text-gray-400">Type:</span> <span className="text-white">Composite</span></p>
                                    <p><span className="text-gray-400">Section:</span> <span className="text-white">{item.dimensions?.size}</span></p>
                                    <p><span className="text-gray-400">Custom:</span> <span className="text-white">Yes</span></p>
                                  </>
                                )}
                                {item.isReinforcementProduct && (
                                  <>
                                    <p><span className="text-gray-400">Weave:</span> <span className="text-white">Plain/Twill</span></p>
                                    <p><span className="text-gray-400">Width:</span> <span className="text-white">1000mm</span></p>
                                    <p><span className="text-gray-400">GSM:</span> <span className="text-white">200-400</span></p>
                                  </>
                                )}
                                {item.isCoreProduct && (
                                  <>
                                    <p><span className="text-gray-400">Density:</span> <span className="text-white">75 kg/m³</span></p>
                                    <p><span className="text-gray-400">Size:</span> <span className="text-white">600x600mm</span></p>
                                    <p><span className="text-gray-400">Thick:</span> <span className="text-white">2-3mm</span></p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 sm:mt-6 bg-gray-700/30 border border-gray-600 rounded-lg p-3 sm:p-4">
                    <h5 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">Order Summary</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Total Items</p>
                        <p className="text-lg sm:text-xl font-bold text-white">{selectedOrder.totalItems || selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Total Weight</p>
                        <p className="text-lg sm:text-xl font-bold text-white">
                          {selectedOrder.totalWeight ? 
                            `${selectedOrder.totalWeight.toFixed(2)} kg` : 
                            `${selectedOrder.items?.reduce((sum, item) => sum + (item.weight * item.quantity || 0), 0).toFixed(2)} kg`
                          }
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs sm:text-sm text-gray-400">Grand Total</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(selectedOrder.total)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
