import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Edit2, Package, MapPin, Calendar, CreditCard, Eye } from 'lucide-react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doSignOut } from '../firebase/auth';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Firebase authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
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
    emoji: '👤',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Mock order history
  const [orders] = useState([
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      total: 299.99,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      total: 149.50,
      status: 'Shipped',
      items: 2
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-25',
      total: 89.99,
      status: 'Processing',
      items: 1
    }
  ]);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const emojis = ['👤', '😊', '🙂', '😎', '🤔', '😋', '🥳', '🤗', '🧑‍💼', '👨‍💻', '👩‍💻', '🧑‍🎨'];

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

  const handleEmojiSelect = (emoji) => {
    setUserProfile(prev => ({
      ...prev,
      emoji: emoji,
      profileImage: null
    }));
    setShowEmojiPicker(false);
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
      case 'Delivered': return 'text-green-400 bg-green-400/10';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10';
      case 'Processing': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-neutral-400 bg-neutral-400/10';
    }
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
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Edit2 size={20} />
                Profile
              </h2>

              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center overflow-hidden group-hover:border-neutral-500 transition-all duration-300">
                    {userProfile.profileImage ? (
                      <img 
                        src={userProfile.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{userProfile.emoji}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Choose Emoji
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {showEmojiPicker && (
                  <motion.div 
                    className="mt-4 p-4 bg-neutral-800 rounded-lg grid grid-cols-6 gap-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiSelect(emoji)}
                        className="w-10 h-10 text-xl hover:bg-neutral-700 rounded-lg transition-all duration-300 hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">First Name</label>
                  <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                    {userProfile.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Last Name</label>
                  <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                    {userProfile.lastName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                  <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                    {userProfile.email}
                  </div>
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
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
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
                    <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                      {userProfile.address.street || 'No address added'}
                    </div>
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
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {userProfile.address.city || 'N/A'}
                      </div>
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
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {userProfile.address.state || 'N/A'}
                      </div>
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
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {userProfile.address.zipCode || 'N/A'}
                      </div>
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
                      <div className="px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg text-white">
                        {userProfile.address.country || 'N/A'}
                      </div>
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
                          <h3 className="font-semibold text-white">{order.id}</h3>
                          <div className="flex items-center gap-4 text-sm text-neutral-400">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package size={14} />
                              {order.items} item{order.items > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard size={16} className="text-neutral-400" />
                          <span className="font-semibold text-white">${order.total}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300">
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package size={48} className="text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                  <p className="text-neutral-400 mb-4">Start shopping to see your orders here</p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-neutral-100 transition-all duration-300 hover:scale-105"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 