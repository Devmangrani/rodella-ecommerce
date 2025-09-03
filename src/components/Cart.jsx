import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/myState';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { saveOrder, firedb, auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { RAZORPAY_CONFIG, formatAmountToPaise, validatePaymentData } from '../config/razorpay';
import { createRazorpayOptions, handlePaymentSuccess } from '../utils/paymentUtils';
import { formatProductionOrderData, generateOrderEmailData, generateAdminNotificationData } from '../utils/orderUtils';

// Toast notification component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
    type === 'success' ? 'bg-green-600 text-white' : 
    type === 'error' ? 'bg-red-600 text-white' : 
    'bg-blue-600 text-white'
  }`}>
    <div className="flex items-center justify-between">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  </div>
);

// Cart Item Component
const CartItem = ({ item, index }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setIsUpdating(true);
    updateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`bg-gradient-to-br from-neutral-800/70 to-neutral-900/50 border border-neutral-700/40 rounded-xl p-6 hover:border-neutral-600/60 transition-all duration-300 ${isUpdating ? 'scale-[0.98] opacity-70' : ''}`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 rounded-lg overflow-hidden">
            <img 
              src={item.product.images[0]} 
              alt={item.product.title}
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-grow space-y-4">
          {/* Product Title and Category */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              {item.product.title}
            </h3>
            {item.product.category && (
              <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-full">
                {item.product.category}
              </span>
            )}
          </div>

          {/* Product Specifications */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Show dimensions for composite plates */}
            {item.product.isCompositePlate && item.product.dimensions && (
              <div className="bg-gradient-to-br from-cyan-500/8 to-cyan-600/4 border border-cyan-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-cyan-300 text-xs font-medium">Dimensions</span>
                <span className="text-white font-bold text-xs">
                  {item.product.dimensions.length} × {item.product.dimensions.breadth} × {item.product.dimensions.thickness} mm
                </span>
              </div>
            )}
            
            {/* Show dimensions for tube products */}
            {item.product.isTubeProduct && item.product.dimensions && (
              <div className="bg-gradient-to-br from-yellow-500/8 to-yellow-600/4 border border-yellow-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-yellow-300 text-xs font-medium">Dimensions</span>
                <span className="text-white font-bold text-xs">
                  {item.product.tubeType === 'circular' ? (
                    <>ID: {item.product.dimensions.innerDiameter}mm | Wall: {item.product.dimensions.wallThickness}mm | Length: {(item.product.dimensions.length / 1000).toFixed(1)}m</>
                  ) : (
                    <>Size: {item.product.dimensions.size}mm | Wall: {item.product.dimensions.wallThickness}mm | Length: {(item.product.dimensions.length / 1000).toFixed(1)}m</>
                  )}
                </span>
              </div>
            )}
            
            {/* Show dimensions for reinforcement products */}
            {item.product.isReinforcementProduct && item.product.dimensions && (
              <div className="bg-gradient-to-br from-emerald-500/8 to-emerald-600/4 border border-emerald-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-emerald-300 text-xs font-medium">Dimensions</span>
                <span className="text-white font-bold text-xs">
                  Width: {item.product.dimensions.width}mm | Length: {item.product.dimensions.lengthInMeters}m 
                </span>
              </div>
            )}
            
            {/* Show dimensions for core products */}
            {item.product.isCoreProduct && item.product.dimensions && (
              <div className="bg-gradient-to-br from-indigo-500/8 to-indigo-600/4 border border-indigo-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-indigo-300 text-xs font-medium">Dimensions</span>
                <span className="text-white font-bold text-xs">
                  {item.product.dimensions.width} × {item.product.dimensions.height} × {item.product.dimensions.thickness}mm | Length: {item.product.dimensions.lengthInMeters}m
                </span>
              </div>
            )}
            
            {/* Show selected size for epoxy products */}
            {item.product.isEpoxyProduct && item.product.selectedSize && (
              <div className="bg-gradient-to-br from-blue-500/8 to-blue-600/4 border border-blue-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-blue-300 text-xs font-medium">Selected Size</span>
                <span className="text-white font-bold text-sm">{item.product.selectedSize}</span>
              </div>
            )}
            
            {/* Show weight only for non-epoxy products */}
            {!item.product.isEpoxyProduct && (
              <div className="bg-gradient-to-br from-purple-500/8 to-purple-600/4 border border-purple-500/15 px-3 py-2 rounded-lg text-center">
                <span className="block text-purple-300 text-xs font-medium">Weight</span>
                <span className="text-white font-bold text-sm">{(item.weight * item.quantity).toFixed(2)} kg</span>
              </div>
            )}
            
            <div className="bg-gradient-to-br from-orange-500/8 to-orange-600/4 border border-orange-500/15 px-3 py-2 rounded-lg text-center">
              <span className="block text-orange-300 text-xs font-medium">Unit Price</span>
              <span className="text-white font-bold text-sm">₹{item.unitPrice.toLocaleString()}</span>
            </div>
            <div className="bg-gradient-to-br from-green-500/8 to-green-600/4 border border-green-500/15 px-3 py-2 rounded-lg text-center">
              <span className="block text-green-300 text-xs font-medium">Total</span>
              <span className="text-green-400 font-bold text-sm">₹{item.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neutral-300 whitespace-nowrap">
                  Quantity:
                </label>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    className="w-8 h-8 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <RemoveIcon fontSize="small" />
                  </motion.button>
                  <span className="w-8 text-center text-white font-medium">
                    {item.quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    className="w-8 h-8 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded-lg flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <AddIcon fontSize="small" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeFromCart(item.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg transition-all duration-200"
            >
              <DeleteIcon fontSize="small" />
              <span className="text-sm font-medium">Remove</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Empty Cart Component
const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCartIcon className="text-neutral-500 text-6xl" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </motion.button>
      </div>
    </motion.div>
  );
};

// Cart Summary Component
const CartSummary = ({ totals, currentUser: currentUserAuth, onShowToast }) => {
  const navigate = useNavigate();
  const { clearCart, cartItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the passed toast function
  const showToast = onShowToast;

  const handleCheckout = async () => {
    // Validate cart before proceeding
    if (totals.totalItems === 0) {
      showToast('Your cart is empty. Please add items before checkout.', 'error');
      return;
    }

    if (totals.totalPrice <= 0) {
      showToast('Invalid order amount. Please check your cart items.', 'error');
      return;
    }

    // Validate minimum amount for Razorpay (₹1 minimum)
    if (totals.totalPrice < 1) {
      showToast(`Order amount is too low: ₹${totals.totalPrice}. Minimum order value is ₹1.`, 'error');
      return;
    }

    // Use actual cart total for production
    const finalAmount = totals.totalPrice;

    // Check if user is authenticated
    if (!currentUserAuth) {
      showToast('Please login to proceed with checkout.', 'error');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Get user data
      const userData = localStorage.getItem('userData');
      let userInfo = {
        uid: currentUserAuth.uid,
        name: currentUserAuth.displayName || 'Customer',
        email: currentUserAuth.email || 'customer@example.com',
        contact: '9999999999'
      };
      
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          userInfo = {
            uid: currentUserAuth.uid,
            name: `${parsedUserData.firstName || ''} ${parsedUserData.lastName || ''}`.trim() || currentUserAuth.displayName || 'Customer',
            email: currentUserAuth.email || parsedUserData.email || 'customer@example.com',
            contact: parsedUserData.phone || '9999999999'
          };
        } catch (error) {
          // Handle parsing error silently
        }
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Ensure amount is properly formatted for Razorpay (integer in paise)
        const amountInPaise = formatAmountToPaise(finalAmount);
        
        const options = {
          key: RAZORPAY_CONFIG.KEY_ID, // Live Razorpay key
          amount: amountInPaise, // Amount in paise (integer)
          currency: RAZORPAY_CONFIG.CURRENCY,
          name: RAZORPAY_CONFIG.COMPANY_NAME,
          description: `Order for ${totals.totalItems} items`,
          image: RAZORPAY_CONFIG.COMPANY_LOGO,
          order_id: '', // This will be generated by your backend
          // Live mode settings with auto-capture
          mode: RAZORPAY_CONFIG.MODE, // Explicitly set to live mode
          payment_capture: 1, // Auto capture payment
          handler: async function (response) {
            try {
              // Get user address from Firebase (most up-to-date)
              let userAddress = null;
              
              if (auth.currentUser) {
                try {
                  const userRef = doc(firedb, 'users', auth.currentUser.uid);
                  const userSnap = await getDoc(userRef);
                  if (userSnap.exists()) {
                    const userData = userSnap.data();
                    userAddress = userData.address || null;
                  }
                } catch (error) {
                  console.error('Error fetching user address:', error);
                }
              }
              
              // Fallback to localStorage if Firebase fetch fails
              if (!userAddress) {
                const userData = localStorage.getItem('userData');
                if (userData) {
                  try {
                    const parsedUserData = JSON.parse(userData);
                    userAddress = parsedUserData.address || null;
                  } catch (error) {
                    // Handle parsing error silently
                  }
                }
              }

              // Payment successful - prepare enhanced order data with Order ID, Invoice ID, etc.
              const orderData = formatProductionOrderData(
                cartItems,
                totals,
                response,
                userInfo,
                userAddress
              );

              // Add compatibility fields for existing UserDashboard
              orderData.customerInfo = {
                name: userInfo.name,
                email: userInfo.email,
                contact: userInfo.contact
              };
              orderData.paymentStatus = 'Completed'; // UserDashboard compatibility

              // Save order to Firestore
              const orderId = await saveOrder(orderData);
              
              if (orderId) {
                // Generate email data for customer and admin notifications
                const customerEmailData = generateOrderEmailData(orderData);
                const adminEmailData = generateAdminNotificationData(orderData);
                
                // Log email data for now (you can integrate with email service later)
                console.log('📧 Customer Email Data:', customerEmailData);
                console.log('📧 Admin Email Data:', adminEmailData);
                
                showToast(`Payment successful! Order ID: ${orderData.orderId} | Invoice: ${orderData.invoiceId}`, 'success');
                clearCart();
                navigate('/dashboard'); // Redirect to dashboard to show order
              } else {
                throw new Error('Failed to save order');
              }
              
            } catch (orderError) {
              showToast('Payment successful but there was an issue saving your order. Please contact support with payment ID: ' + response.razorpay_payment_id, 'error');
              clearCart(); // Clear cart even if order save fails
              navigate('/');
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.contact
          },
          notes: {
            address: 'Customer Address', // You can get this from user context
            userId: currentUserAuth.uid
          },
          theme: {
            color: RAZORPAY_CONFIG.THEME_COLOR // Blue color matching your theme
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        
        // Handle payment failures
        rzp.on('payment.failed', function (response) {
          showToast(`Payment failed: ${response.error.description || 'Something went wrong. Please try again.'}`, 'error');
          setIsProcessing(false);
        });
        
        rzp.open();
      };

      script.onerror = () => {
        showToast('Failed to load payment gateway. Please try again.', 'error');
        setIsProcessing(false);
      };

    } catch (error) {
      showToast('Payment failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:sticky lg:top-4 bg-gradient-to-br from-neutral-800/70 to-neutral-900/50 border border-neutral-700/40 rounded-xl p-6 h-fit"
    >
      <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
      
      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
          <span className="text-neutral-300">Total Items:</span>
          <span className="text-white font-semibold">{totals.totalItems}</span>
        </div>
        {/* Show weight only if there are non-epoxy products */}
        {totals.totalWeight > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
            <span className="text-neutral-300">Total Weight:</span>
            <span className="text-white font-semibold">{totals.totalWeight.toFixed(2)} kg</span>
          </div>
        )}
        <div className="flex justify-between items-center py-3 border-b border-neutral-700/50">
          <span className="text-neutral-300">Subtotal:</span>
          <span className="text-white font-semibold">₹{totals.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-lg font-bold text-white">Total:</span>
          <span className="text-lg font-bold text-green-400">₹{totals.totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckout}
          disabled={isProcessing || totals.totalItems === 0}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-600/50 disabled:to-green-700/50 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {isProcessing ? 'Processing Payment...' : totals.totalItems === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Continue Shopping
        </motion.button>
        
        {/* <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClearCart}
          className="w-full bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 text-red-400 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Clear Cart
        </motion.button> */}
      </div>
    </motion.div>
  );
};

// Simple Loading Spinner for Cart
const CartLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
    <p className="text-white text-lg">Loading cart...</p>
  </div>
);



// Main Cart Component
const Cart = () => {
  const { cartItems, getCartTotals, cartLoaded, isAuthenticated } = useCart();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const totals = getCartTotals();

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Check authentication state
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      
      if (!user) {
        // If user is not authenticated, redirect to login
        localStorage.setItem('redirectToCartAfterLogin', 'true');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // If still checking authentication or cart not loaded yet, show loading
  if (authLoading || !cartLoaded) {
    return <CartLoading />;
  }

  // If user is not authenticated, don't render cart
  if (!currentUser || !isAuthenticated()) {
    return <CartLoading />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-8">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors duration-200"
            >
              <ArrowBackIcon className="text-white" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
              <p className="text-neutral-400">
                {totals.totalItems} {totals.totalItems === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="text-blue-400" />
            <span className="text-lg font-semibold text-white">
              ₹{totals.totalPrice.toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Cart Content */}
        {!cartLoaded ? (
          <CartLoading />
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <CartItem key={item.id} item={item} index={index} />
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary totals={totals} currentUser={currentUser} onShowToast={showToast} />
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 