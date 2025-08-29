import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Edit2, Package, MapPin, Calendar, CreditCard, Eye, X, ShoppingBag, Truck, Weight, Layers } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doSignOut } from '../firebase/auth';
import { createOrUpdateUser, fetchUserOrders } from '../firebase/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { firedb } from '../firebase/firebase';

// Order Details Modal Component
const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getProductTypeIcon = (item) => {
    if (item.isCompositePlate) return <Layers className="text-neutral-400" size={16} />;
    if (item.isTubeProduct) return <Package className="text-neutral-400" size={16} />;
    if (item.isReinforcementProduct) return <Truck className="text-neutral-400" size={16} />;
    if (item.isCoreProduct) return <Weight className="text-neutral-400" size={16} />;
    if (item.isEpoxyProduct) return <ShoppingBag className="text-neutral-400" size={16} />;
    return <Package className="text-neutral-400" size={16} />;
  };

  const getProductTypeBadge = (item) => {
    if (item.isCompositePlate) return { label: 'Composite Plate', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
    if (item.isTubeProduct) return { label: 'Tube Product', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
    if (item.isReinforcementProduct) return { label: 'Reinforcement', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
    if (item.isCoreProduct) return { label: 'Core Material', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
    if (item.isEpoxyProduct) return { label: 'Epoxy System', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
    return { label: 'Product', color: 'bg-neutral-700/50 text-neutral-300 border-neutral-600/50' };
  };

  const formatDimensions = (item) => {
    if (item.isCompositePlate && item.dimensions) {
      return `${item.dimensions.length} × ${item.dimensions.breadth} × ${item.dimensions.thickness} mm`;
    }
    if (item.isTubeProduct && item.dimensions) {
      if (item.dimensions.innerDiameter) {
        return `ID: ${item.dimensions.innerDiameter}mm | Wall: ${item.dimensions.wallThickness}mm | Length: ${(item.dimensions.length / 1000).toFixed(1)}m`;
      } else {
        return `Size: ${item.dimensions.size}mm | Wall: ${item.dimensions.wallThickness}mm | Length: ${(item.dimensions.length / 1000).toFixed(1)}m`;
      }
    }
    if (item.isReinforcementProduct && item.dimensions) {
      return `Width: ${item.dimensions.width}mm | Length: ${item.dimensions.lengthInMeters}m`;
    }
    if (item.isCoreProduct && item.dimensions) {
      return `${item.dimensions.width} × ${item.dimensions.height} × ${item.dimensions.thickness}mm | Length: ${item.dimensions.lengthInMeters}m`;
    }
    if (item.isEpoxyProduct && item.selectedSize) {
      return `Selected Size: ${item.selectedSize}`;
    }
    return 'N/A';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Order Details</h2>
                  <p className="text-neutral-400 text-sm">
                    {order.orderId ? `Order: ${order.orderId}` : `#${order.id.slice(-8).toUpperCase()}`}
                  </p>
                  {order.invoiceId && (
                    <p className="text-neutral-400 text-xs">Invoice: {order.invoiceId}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-200"
              >
                <X className="text-neutral-400 hover:text-white" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Order Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={14} className="text-neutral-400" />
                    <span className="text-neutral-400 text-xs font-medium">Total Amount</span>
                  </div>
                  <span className="text-white font-semibold text-lg">₹{order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</span>
                </div>
                
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={14} className="text-neutral-400" />
                    <span className="text-neutral-400 text-xs font-medium">Items</span>
                  </div>
                  <span className="text-white font-semibold text-lg">{order.totalItems || 0}</span>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Weight size={14} className="text-neutral-400" />
                    <span className="text-neutral-400 text-xs font-medium">Weight</span>
                  </div>
                  <span className="text-white font-semibold text-lg">{order.totalWeight?.toFixed(2) || '0.00'} kg</span>
                </div>

                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={14} className="text-neutral-400" />
                    <span className="text-neutral-400 text-xs font-medium">Order Date</span>
                  </div>
                  <span className="text-white font-semibold text-sm">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Ordered Products */}
              <div>
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-neutral-400" />
                  Ordered Products ({order.items?.length || 0})
                </h3>
                
                <div className="space-y-3">
                  {order.items?.map((item, index) => {
                    const productType = getProductTypeBadge(item);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-900/50 transition-all duration-200"
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-neutral-800/50 rounded-lg overflow-hidden flex items-center justify-center">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {getProductTypeIcon(item)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow space-y-3">
                            {/* Product Title and Type */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${productType.color} w-fit`}>
                                {productType.label}
                              </span>
                            </div>

                            {/* Product Specifications */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              <div className="bg-neutral-800/30 border border-neutral-700/50 px-3 py-2 rounded-md">
                                <span className="block text-neutral-400 text-xs font-medium">Quantity</span>
                                <span className="text-white font-medium">{item.quantity}</span>
                              </div>
                              
                              <div className="bg-neutral-800/30 border border-neutral-700/50 px-3 py-2 rounded-md">
                                <span className="block text-neutral-400 text-xs font-medium">Unit Price</span>
                                <span className="text-white font-medium">₹{item.unitPrice?.toLocaleString('en-IN') || '0'}</span>
                              </div>
                              
                              <div className="bg-neutral-800/30 border border-neutral-700/50 px-3 py-2 rounded-md">
                                <span className="block text-neutral-400 text-xs font-medium">Total Price</span>
                                <span className="text-white font-medium">₹{item.totalPrice?.toLocaleString('en-IN') || '0'}</span>
                              </div>
                            </div>

                            {/* Dimensions and Specifications */}
                            <div className="bg-neutral-800/20 border border-neutral-700/40 rounded-md p-3">
                              <span className="block text-neutral-400 text-xs font-medium mb-2">Specifications</span>
                              <span className="text-white text-sm">{formatDimensions(item)}</span>
                              
                              {/* Weight and Area (if applicable) */}
                              <div className="flex flex-wrap gap-3 mt-2">
                                {item.weight > 0 && (
                                  <span className="text-neutral-400 text-xs">
                                    Weight: {(item.weight * item.quantity).toFixed(3)} kg
                                  </span>
                                )}
                                {item.area > 0 && (
                                  <span className="text-neutral-400 text-xs">
                                    Area: {(item.area * item.quantity).toFixed(2)} m²
                                  </span>
                                )}
                                {item.length > 1 && (
                                  <span className="text-neutral-400 text-xs">
                                    Length: {item.length} m
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Information */}
              {order.razorpayPaymentId && (
                <div className="mt-6 bg-neutral-900/30 border border-neutral-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-neutral-400" />
                    Payment Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment ID:</span>
                      <span className="text-white font-mono text-xs">{order.razorpayPaymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Method:</span>
                      <span className="text-white">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Status:</span>
                      <span className="text-green-400 font-medium">{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Order Status:</span>
                      <span className="text-white font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Check Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        setProfileLoading(true);
        setOrdersLoading(true);
        
        // Fetch user profile from Firestore
        const userRef = doc(firedb, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserProfile(prev => ({
            ...prev,
            ...data,
            phone: typeof data.phone === 'string' ? data.phone : '',
            address: data.address || {
              street: '', city: '', state: '', zipCode: '', country: ''
            },
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || ''
          }));
        } else {
          // If no Firestore data, initialize empty fields for user to fill
          setUserProfile(prev => ({
            ...prev,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: { street: '', city: '', state: '', zipCode: '', country: '' }
          }));
        }
        setProfileLoading(false);
        
        // Fetch user orders from Firestore
        try {
          const userOrders = await fetchUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          setOrders([]);
        }
        setOrdersLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Get user data from Firebase user or localStorage fallback
  const getUserData = () => {
    if (currentUser) {
      const displayName = currentUser.displayName || '';
      const nameParts = displayName.split(' ');
      return {
        firstName: nameParts[0] || currentUser.email?.split('@')[0] || 'User',
        lastName: nameParts[1] || '',
        email: currentUser.email || 'user@example.com',
        uid: currentUser.uid,
        emailVerified: currentUser.emailVerified
      };
    }
    
    // Fallback to localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return {
      firstName: 'User',
      lastName: '',
      email: 'user@example.com'
    };
  };

  const [userProfile, setUserProfile] = useState({
    ...getUserData(),
    profileImage: null,
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profileImage: e.target.result,
          emoji: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-400/10 border border-green-400/20';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10 border border-blue-400/20';
      case 'Processing': return 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20';
      case 'Completed': return 'text-green-400 bg-green-400/10 border border-green-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/10 border border-red-400/20';
      default: return 'text-neutral-400 bg-neutral-400/10 border border-neutral-400/20';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    // Handle Firestore Timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString();
    }
    
    // Handle regular Date object or string
    return new Date(date).toLocaleDateString();
  };

  const formatOrderTotal = (total) => {
    if (typeof total === 'number') {
      return total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return total || '0.00';
  };

  const getOrderItemsCount = (items) => {
    if (Array.isArray(items)) {
      return items.reduce((total, item) => total + (item.quantity || 1), 0);
    }
    return items || 0;
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      
      // Clear ALL localStorage data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('rodella_cart');
      localStorage.removeItem('redirectToCartAfterLogin');
      
      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new Event('authStateChanged'));
      
      // Force navigation to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if Firebase logout fails, clear local data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('rodella_cart');
      localStorage.removeItem('redirectToCartAfterLogin');
      
      window.dispatchEvent(new Event('authStateChanged'));
      navigate('/', { replace: true });
    }
  };

  const handleProfileSave = async () => {
    setIsEditingProfile(false);
    if (currentUser) {
      // Only send non-empty fields to Firestore
      const userData = {
        uid: currentUser.uid,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        address: userProfile.address
      };
      if (userProfile.phone && userProfile.phone.trim()) {
        userData.phone = userProfile.phone.trim();
      }
      await createOrUpdateUser(userData);
      // Fetch latest user data from Firestore and update UI
      const userRef = doc(firedb, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile(prev => ({
          ...prev,
          ...data,
          phone: typeof data.phone === 'string' ? data.phone : '',
          address: data.address || {
            street: '', city: '', state: '', zipCode: '', country: ''
          },
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        }));
      }
    }
  };

  const handleAddressSave = async () => {
    setIsEditingAddress(false);
    if (currentUser) {
      // Only send non-empty fields to Firestore
      const userData = {
        uid: currentUser.uid,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        address: userProfile.address
      };
      if (userProfile.phone && userProfile.phone.trim()) {
        userData.phone = userProfile.phone.trim();
      }
      await createOrUpdateUser(userData);
      // Fetch latest user data from Firestore and update UI
      const userRef = doc(firedb, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserProfile(prev => ({
          ...prev,
          ...data,
          phone: typeof data.phone === 'string' ? data.phone : '',
          address: data.address || {
            street: '', city: '', state: '', zipCode: '', country: ''
          },
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        }));
      }
    }
  };

  // Handle order details modal
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center pt-20">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-28 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8 flex justify-between items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-neutral-400">Manage your profile and track your orders</p>
            {currentUser && (
              <p className="text-sm text-green-400 mt-1">
                Welcome back, {getUserData().firstName}! 
                {/* {currentUser.emailVerified ? ' ✅ Verified' : ' ⚠️ Email not verified'} */}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105"
          >
            Logout
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Edit2 size={20} />
                  Profile
                </h2>
                <button
                  onClick={() => {
                    if (isEditingProfile) {
                      handleProfileSave();
                    } else {
                      setIsEditingProfile(true);
                    }
                  }}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                >
                  {isEditingProfile ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">First Name</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={e => setUserProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[2.75rem] bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                      placeholder="First Name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                      {userProfile.firstName && userProfile.firstName.trim() ? userProfile.firstName : 'Not added'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Last Name</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={userProfile.lastName}
                      onChange={e => setUserProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 min-h-[2.75rem] bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                      placeholder="Last Name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                      {userProfile.lastName && userProfile.lastName.trim() ? userProfile.lastName : 'Not added'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Phone Number</label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={e => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                      placeholder="Phone Number"
                    />
                  ) : (
                    profileLoading ? (
                      <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                    ) : (
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {(userProfile.phone && userProfile.phone.trim()) ? userProfile.phone : 'Not added'}
                      </div>
                    )
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={e => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                      placeholder="Email"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                      {userProfile.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPin size={20} />
                  Delivery Address
                </h2>
                <button
                  onClick={() => {
                    if (isEditingAddress) {
                      handleAddressSave();
                    } else {
                      setIsEditingAddress(true);
                    }
                  }}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                >
                  {isEditingAddress ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Street Address</label>
                  {isEditingAddress ? (
                    <input
                      type="text"
                      value={userProfile.address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                      placeholder="Enter street address"
                    />
                  ) : (
                    profileLoading ? (
                      <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                    ) : (
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {userProfile.address.street || 'No address added'}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">City</label>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={userProfile.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                        placeholder="City"
                      />
                    ) : (
                      profileLoading ? (
                        <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                      ) : (
                        <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                          {userProfile.address.city || 'N/A'}
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">State</label>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={userProfile.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                        placeholder="State"
                      />
                    ) : (
                      profileLoading ? (
                        <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                      ) : (
                        <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                          {userProfile.address.state || 'N/A'}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Zip Code</label>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={userProfile.address.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                        placeholder="Zip Code"
                      />
                    ) : (
                      profileLoading ? (
                        <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                      ) : (
                        <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                          {userProfile.address.zipCode || 'N/A'}
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Country</label>
                    {isEditingAddress ? (
                      <input
                        type="text"
                        value={userProfile.address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-neutral-600 focus:border-transparent transition-all duration-300"
                        placeholder="Country"
                      />
                    ) : (
                      profileLoading ? (
                        <div className="w-full h-10 bg-neutral-800 rounded-lg animate-pulse" />
                      ) : (
                        <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                          {userProfile.address.country || 'N/A'}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Orders Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Package size={20} />
                Order History
              </h2>

              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
                        <div className="h-3 bg-neutral-700 rounded w-1/2"></div>
                        <div className="h-3 bg-neutral-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                  <p className="text-neutral-400 mb-4">Looks like you haven't ordered anything yet. Start shopping to fill it up!</p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      className="p-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-white">
                              {order.orderId ? order.orderId : `Order #${order.id.slice(-8).toUpperCase()}`}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(order.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package size={14} />
                                {getOrderItemsCount(order.items)} item{getOrderItemsCount(order.items) > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={16} className="text-neutral-400" />
                            <span className="font-semibold text-white">₹{formatOrderTotal(order.total)}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleViewOrderDetails(order)}
                          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 hover:bg-neutral-700/30 px-3 py-1 rounded-lg"
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={showOrderDetails}
        onClose={closeOrderDetails}
      />
    </div>
  );
};

export default UserDashboard; 