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
      if (user) {
        const isAdmin = await checkAdminStatus(user.uid);
        if (isAdmin) {
          setCurrentAdmin(user);
          loadAllData();
        } else {
          navigate('/rodella-admin-access-2024');
        }
      } else {
        navigate('/rodella-admin-access-2024');
      }
      setLoading(false);
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
      
      setUsers(usersData);
      setOrders(ordersData);
      setCarts(cartsData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
    setDataLoading(false);
  };

  // Handle admin logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminToken');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch user data for order details
  const fetchOrderUserData = async (uid) => {
    if (!uid) return null;
    setLoadingUserData(true);
    try {
      const userRef = doc(firedb, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setOrderUserData(userData);
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setLoadingUserData(false);
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
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    activeCarts: carts.filter(cart => cart.items.length > 0).length,
    completedOrders: orders.filter(order => order.status === 'Completed').length,
    processingOrders: orders.filter(order => order.status === 'Processing').length,
    pendingOrders: orders.filter(order => order.status === 'Pending').length
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadAllData}
                disabled={dataLoading}
                className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="text-sm text-gray-300">
                <span className="font-medium">{currentAdmin?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'carts', label: 'Active Carts', icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Carts</p>
                    <p className="text-2xl font-bold text-white">{stats.activeCarts}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Order Status Overview */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-400">Completed</span>
                  </div>
                  <span className="text-green-400 font-semibold">{stats.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-yellow-400">Processing</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">{stats.processingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-orange-400">Pending</span>
                  </div>
                  <span className="text-orange-400 font-semibold">{stats.pendingOrders}</span>
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
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Users ({users.length})</h3>
              
              {/* Users Grid Layout */}
              <div className="space-y-4">
                {users.map((user) => {
                  const isExpanded = expandedUsers.has(user.id);
                  
                  return (
                    <div key={user.id} className="bg-gray-700/30 border border-gray-600 rounded-xl overflow-hidden">
                      {/* Compact User Header */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white">
                                {user.firstName || user.lastName ? 
                                  `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                                  user.name || 'Unknown User'
                                }
                              </h4>
                              <p className="text-gray-400 text-sm truncate">{user.email}</p>
                              <p className="text-gray-500 text-xs">{user.phone || 'No phone number'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {/* Account Type Badge */}
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                              user.isAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            }`}>
                              {user.isAdmin ? '👑 Admin' : '👤 User'}
                            </span>
                            
                            {/* Orders Count Badge */}
                            <span className="inline-flex px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                              {orders.filter(order => order.uid === user.id).length} orders
                            </span>
                            
                            {/* Toggle Button */}
                            <button
                              onClick={() => toggleUserExpansion(user.id)}
                              className="flex items-center px-3 py-1 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-colors text-sm"
                            >
                              {isExpanded ? (
                                <>
                                  <span className="mr-1">Hide Details</span>
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <span className="mr-1">View More</span>
                                  <ChevronDown className="w-4 h-4" />
                                </>
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
                            <div className="p-6">
                              {/* User Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Personal Information */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Personal Information
                        </h5>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-400">First Name</p>
                              <p className="text-white">{user.firstName || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Last Name</p>
                              <p className="text-white">{user.lastName || 'N/A'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Full Name</p>
                            <p className="text-white">{user.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-white">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p className="text-white">{user.phone || 'Not provided'}</p>
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
                    <div className="mt-4 flex flex-wrap gap-2">
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
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors"
                      >
                        View Orders ({orders.filter(order => order.uid === user.id).length})
                      </button>
                      
                      {carts.find(cart => cart.uid === user.id && cart.items.length > 0) && (
                        <button 
                          onClick={() => {
                            setActiveTab('carts');
                          }}
                          className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-xs hover:bg-purple-600/30 transition-colors"
                        >
                          View Cart
                        </button>
                      )}
                      
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(user.email);
                          alert('Email copied to clipboard');
                        }}
                        className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs hover:bg-green-600/30 transition-colors"
                      >
                        Copy Email
                      </button>
                      
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(user.id);
                          alert('User ID copied to clipboard');
                        }}
                        className="px-3 py-1 bg-gray-600/20 text-gray-400 rounded-lg text-xs hover:bg-gray-600/30 transition-colors"
                      >
                        Copy ID
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
              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-400 mb-2">No Users Found</h4>
                  <p className="text-gray-500">No registered users in the system.</p>
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
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders by customer name, email, order ID, or payment ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-8 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Orders ({filteredOrders.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400">Payment ID</th>
                      <th className="text-left py-3 px-4 text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400">Actions</th>
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
                            <div className="text-white">{order.customerName}</div>
                            <div className="text-gray-400 text-sm">{order.customerEmail}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                          {order.razorpayPaymentId?.slice(0, 12)}...
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                              disabled={orderUpdateLoading}
                              className={`appearance-none border rounded-lg px-3 py-1 pr-8 text-sm font-medium ${getStatusColor(order.status)} focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none" />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOrderDetailsView(order)}
                            className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
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
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
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
                      <div key={cart.uid} className="bg-gray-700/30 border border-gray-600 rounded-xl p-6">
                        {/* User Header */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-600">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{user?.name || 'Unknown User'}</h4>
                              <p className="text-sm text-gray-400">{user?.email}</p>
                              {user?.phone && (
                                <p className="text-sm text-gray-400">📞 {user.phone}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-purple-400 mb-1">
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              <span className="font-medium">{totalItems} items</span>
                            </div>
                            <p className="text-white font-bold text-lg">{formatCurrency(totalValue)}</p>
                          </div>
                        </div>

                        {/* Cart Items Details */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-3">Cart Items:</h5>
                          <div className="space-y-3">
                            {cart.items.map((item, index) => (
                              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start flex-1">
                                    {/* Product Image */}
                                    {item.product?.image && (
                                      <div className="w-16 h-16 bg-gray-600 rounded-lg overflow-hidden mr-3 flex-shrink-0">
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
                                      <h6 className="text-white font-medium truncate">
                                        {item.product?.title || item.title || 'Unknown Product'}
                                      </h6>
                                      <div className="mt-1 space-y-1">
                                        <div className="flex items-center text-sm text-gray-400">
                                          <span>Quantity: {item.quantity}</span>
                                          {item.length && item.length !== 1 && (
                                            <span className="ml-3">Length: {item.length}m</span>
                                          )}
                                        </div>
                                        {item.product?.selectedSize && (
                                          <div className="text-sm text-gray-400">
                                            Size: {item.product.selectedSize}
                                          </div>
                                        )}
                                        {item.area && item.area > 0 && (
                                          <div className="text-sm text-gray-400">
                                            Area: {item.area.toFixed(2)} sq.m
                                          </div>
                                        )}
                                        {item.weight && item.weight > 0 && (
                                          <div className="text-sm text-gray-400">
                                            Weight: {item.weight.toFixed(2)} kg
                                          </div>
                                        )}
                                        <div className="text-sm text-gray-400">
                                          Unit Price: {formatCurrency(item.unitPrice)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Price */}
                                  <div className="text-right ml-4">
                                    <p className="text-white font-semibold">
                                      {formatCurrency(item.totalPrice)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {formatCurrency(item.unitPrice)} × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Product Type Badge */}
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {item.product?.isCompositePlate && (
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                                      Composite Plate
                                    </span>
                                  )}
                                  {item.product?.isTubeProduct && (
                                    <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                                      Tube Product
                                    </span>
                                  )}
                                  {item.product?.isReinforcementProduct && (
                                    <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                                      Reinforcement
                                    </span>
                                  )}
                                  {item.product?.isCoreProduct && (
                                    <span className="inline-block px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">
                                      Core Material
                                    </span>
                                  )}
                                  {item.product?.isEpoxyProduct && (
                                    <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                                      Epoxy System
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cart Summary */}
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-400">
                              Last updated: {cart.items[0]?.addedAt ? 
                                new Date(cart.items[0].addedAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'N/A'
                              }
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Total Items: {totalItems}</p>
                              <p className="text-lg font-bold text-white">{formatCurrency(totalValue)}</p>
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
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Order Details</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Order ID</label>
                    <p className="text-white font-mono">{selectedOrder.orderId}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Payment ID</label>
                    <p className="text-white font-mono">{selectedOrder.razorpayPaymentId}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Order Date</label>
                    <p className="text-white">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Total Amount</label>
                    <p className="text-white font-semibold text-lg">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Payment Status</label>
                    <p className="text-green-400">{selectedOrder.paymentStatus || 'Completed'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
                    <p className="text-white">{selectedOrder.paymentMethod || 'Razorpay'}</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name</label>
                      <p className="text-white">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <p className="text-white">{selectedOrder.customerEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <p className="text-white">{selectedOrder.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Customer ID (Full)</label>
                      <p className="text-white font-mono text-xs break-all">{selectedOrder.uid}</p>
                    </div>
                  </div>
                  
                  {/* Customer Address */}
                  <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-2">Customer Address</label>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      {loadingUserData ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                          <span className="text-gray-400 text-sm">Loading address...</span>
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
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Street:</span> {orderUserData.address.street || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">City:</span> {orderUserData.address.city || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">State:</span> {orderUserData.address.state || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">ZIP Code:</span> {orderUserData.address.zipCode || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Country:</span> {orderUserData.address.country || 'N/A'}
                              </p>
                              {/* <p className="text-xs text-green-400 mt-2">✓ Fetched from user profile</p> */}
                            </div>
                          ) : 
                          /* Fallback to order data if available */
                          (selectedOrder.shippingAddress || selectedOrder.customerAddress) ? (
                            <div className="space-y-1">
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Street:</span> {(selectedOrder.shippingAddress?.street || selectedOrder.customerAddress?.street) || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">City:</span> {(selectedOrder.shippingAddress?.city || selectedOrder.customerAddress?.city) || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">State:</span> {(selectedOrder.shippingAddress?.state || selectedOrder.customerAddress?.state) || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">ZIP Code:</span> {(selectedOrder.shippingAddress?.zipCode || selectedOrder.customerAddress?.zipCode) || 'N/A'}
                              </p>
                              <p className="text-white text-sm">
                                <span className="text-gray-400">Country:</span> {(selectedOrder.shippingAddress?.country || selectedOrder.customerAddress?.country) || 'N/A'}
                              </p>
                              <p className="text-xs text-yellow-400 mt-2">⚠ From order data (may be outdated)</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">No address information available</p>
                              <p className="text-xs text-red-400">Address not found in user profile or order data</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Order Status</label>
                  <div className="relative inline-block">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleOrderStatusUpdate(selectedOrder.id, e.target.value)}
                      disabled={orderUpdateLoading}
                      className={`appearance-none border rounded-lg px-4 py-2 pr-8 font-medium ${getStatusColor(selectedOrder.status)} focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Order Items - Detailed */}
                <div>
                  <label className="block text-sm text-gray-400 mb-3">Detailed Order Items ({selectedOrder.items?.length || 0})</label>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start flex-1">
                            {/* Product Image */}
                            {item.image && (
                              <div className="w-20 h-20 bg-gray-600 rounded-lg overflow-hidden mr-4 flex-shrink-0">
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
                              <h4 className="text-white font-semibold text-lg mb-2">{item.title}</h4>
                              
                              {/* Basic Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="space-y-1">
                                  <p className="text-sm"><span className="text-gray-400">Quantity:</span> <span className="text-white">{item.quantity}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Unit Price:</span> <span className="text-white">{formatCurrency(item.unitPrice)}</span></p>
                                  <p className="text-sm"><span className="text-gray-400">Total Price:</span> <span className="text-white font-semibold">{formatCurrency(item.totalPrice)}</span></p>
                                </div>
                                <div className="space-y-1">
                                  {item.weight && (
                                    <p className="text-sm"><span className="text-gray-400">Weight:</span> <span className="text-white">{item.weight.toFixed(2)} kg</span></p>
                                  )}
                                  {item.area && item.area > 0 && (
                                    <p className="text-sm"><span className="text-gray-400">Area:</span> <span className="text-white">{item.area.toFixed(2)} sq.m</span></p>
                                  )}
                                  {item.length && item.length !== 1 && (
                                    <p className="text-sm"><span className="text-gray-400">Length:</span> <span className="text-white">{item.length}m</span></p>
                                  )}
                                </div>
                              </div>

                              {/* Product Categories */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.isCompositePlate && (
                                  <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                                    Composite Plate
                                  </span>
                                )}
                                {item.isTubeProduct && (
                                  <span className="inline-block px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded border border-green-500/30">
                                    Tube Product
                                  </span>
                                )}
                                {item.isReinforcementProduct && (
                                  <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                                    Reinforcement
                                  </span>
                                )}
                                {item.isCoreProduct && (
                                  <span className="inline-block px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                                    Core Material
                                  </span>
                                )}
                                {item.isEpoxyProduct && (
                                  <span className="inline-block px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded border border-red-500/30">
                                    Epoxy System
                                  </span>
                                )}
                              </div>

                              {/* Detailed Specifications */}
                              <div className="">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Product Specifications:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                  
                                  {/* Tube Product Dimensions */}
                                  {item.dimensions && (
                                    <>
                                      <div className="space-y-1">
                                        <p><span className="text-gray-400">Size:</span> <span className="text-white">{item.dimensions.size}</span></p>
                                        <p><span className="text-gray-400">Wall Thickness:</span> <span className="text-white">{item.dimensions.wallThickness}mm</span></p>
                                        <p><span className="text-gray-400">Length:</span> <span className="text-white">{item.dimensions.length}mm</span></p>
                                        <p><span className="text-gray-400">Unit:</span> <span className="text-white">{item.dimensions.unit}</span></p>
                                      </div>
                                    </>
                                  )}

                                  {/* Epoxy Product Size */}
                                  {item.selectedSize && (
                                    <div>
                                      <p><span className="text-gray-400">Selected Size:</span> <span className="text-white">{item.selectedSize}</span></p>
                                    </div>
                                  )}

                                  {/* Additional Product Details */}
                                  <div className="space-y-1">
                                    <p><span className="text-gray-400">Product ID:</span> <span className="text-white font-mono">{item.id}</span></p>
                                    {item.material && (
                                      <p><span className="text-gray-400">Material:</span> <span className="text-white">{item.material}</span></p>
                                    )}
                                  </div>
                                </div>

                                {/* Manufacturing Details */}
                                {(item.isTubeProduct || item.isReinforcementProduct || item.isCoreProduct) && (
                                  <div className="mt-3 pt-3 border-t border-gray-600">
                                    <h6 className="text-xs font-medium text-gray-300 mb-1">Manufacturing Specs:</h6>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                      {item.isTubeProduct && (
                                        <>
                                          <p><span className="text-gray-400">Type:</span> <span className="text-white">Composite Tube</span></p>
                                          <p><span className="text-gray-400">Cross-section:</span> <span className="text-white">{item.dimensions?.size}</span></p>
                                          <p><span className="text-gray-400">Custom Length:</span> <span className="text-white">Yes</span></p>
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
                                          <p><span className="text-gray-400">Standard Size:</span> <span className="text-white">600x600mm</span></p>
                                          <p><span className="text-gray-400">Thickness:</span> <span className="text-white">2-3mm</span></p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Price Summary */}
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-white font-bold text-xl">{formatCurrency(item.totalPrice)}</p>
                            <p className="text-gray-400 text-sm">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                            {item.weight && (
                              <p className="text-gray-400 text-xs mt-1">Weight: {item.weight.toFixed(2)} kg</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-gray-700/30 border border-gray-600 rounded-lg p-4">
                    <h5 className="text-lg font-semibold text-white mb-3">Order Summary</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Total Items</p>
                        <p className="text-xl font-bold text-white">{selectedOrder.totalItems || selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total Weight</p>
                        <p className="text-xl font-bold text-white">
                          {selectedOrder.totalWeight ? 
                            `${selectedOrder.totalWeight.toFixed(2)} kg` : 
                            `${selectedOrder.items?.reduce((sum, item) => sum + (item.weight * item.quantity || 0), 0).toFixed(2)} kg`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Grand Total</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(selectedOrder.total)}</p>
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
