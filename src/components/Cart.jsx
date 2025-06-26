import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/myState';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Cart Item Component
const CartItem = ({ item, index }) => {
  const { updateQuantity, updateLength, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    setIsUpdating(true);
    updateQuantity(item.id, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleLengthChange = (newLength) => {
    setIsUpdating(true);
    updateLength(item.id, newLength);
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
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
            {/* <div className="bg-gradient-to-br from-blue-500/8 to-blue-600/4 border border-blue-500/15 px-3 py-2 rounded-lg text-center">
              <span className="block text-blue-300 text-xs font-medium">Area</span>
              <span className="text-white font-bold text-sm">{(item.area * item.quantity).toFixed(2)} m²</span>
            </div> */}
            <div className="bg-gradient-to-br from-purple-500/8 to-purple-600/4 border border-purple-500/15 px-3 py-2 rounded-lg text-center">
              <span className="block text-purple-300 text-xs font-medium">Weight</span>
              <span className="text-white font-bold text-sm">{(item.weight * item.quantity).toFixed(2)} kg</span>
            </div>
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
            {/* Length and Quantity Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Length Input */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-neutral-300 whitespace-nowrap">
                  Length (m):
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={item.length}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className="w-20 bg-neutral-700/60 border border-neutral-600/40 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>

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
const CartSummary = ({ totals }) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    // Validate cart before proceeding
    if (totals.totalItems === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    if (totals.totalPrice <= 0) {
      alert('Invalid order amount. Please check your cart items.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('userData');
      let userInfo = {
        name: 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      };
      
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          userInfo = {
            name: `${parsedUserData.firstName || ''} ${parsedUserData.lastName || ''}`.trim() || 'Customer',
            email: parsedUserData.email || 'customer@example.com',
            contact: '9999999999' // You can add phone to user data if needed
          };
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: 'rzp_test_TZsfCOp4wKi2nJ', // Your Razorpay test key
          amount: totals.totalPrice * 100, // Amount in paise (multiply by 100)
          currency: 'INR',
          name: 'Eco-Front',
          description: `Order for ${totals.totalItems} items`,
          image: '/src/assets/logo.jpg', // Your logo
          order_id: '', // This will be generated by your backend
          handler: function (response) {
            // Payment successful
            console.log('Payment successful:', response);
            alert('Payment successful! Your order has been placed.');
            clearCart();
            navigate('/');
          },
          prefill: {
            name: userInfo.name,
            email: userInfo.email,
            contact: userInfo.contact
          },
          notes: {
            address: 'Customer Address' // You can get this from user context
          },
          theme: {
            color: '#3B82F6' // Blue color matching your theme
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
          console.error('Payment failed:', response.error);
          alert(`Payment failed: ${response.error.description || 'Something went wrong. Please try again.'}`);
          setIsProcessing(false);
        });
        
        rzp.open();
      };

      script.onerror = () => {
        alert('Failed to load payment gateway. Please try again.');
        setIsProcessing(false);
      };

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
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
        <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
          <span className="text-neutral-300">Total Weight:</span>
          <span className="text-white font-semibold">{totals.totalWeight.toFixed(2)} kg</span>
        </div>
        {/* <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
          <span className="text-neutral-300">Total Area:</span>
          <span className="text-white font-semibold">{totals.totalArea.toFixed(2)} m²</span>
        </div> */}
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
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-600/50 disabled:to-green-700/50 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
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
  const { cartItems, getCartTotals, cartLoaded } = useCart();
  const navigate = useNavigate();
  const totals = getCartTotals();

  // If cart is not loaded yet, show simple loading
  if (!cartLoaded) {
    return <CartLoading />;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-8">
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
              <CartSummary totals={totals} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 