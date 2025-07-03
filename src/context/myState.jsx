import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserCart, fetchUserCart } from '../firebase/firebase';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);

  // Helper to get current user UID
  const getCurrentUid = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData).uid;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Load cart from Firestore on login
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated()) {
        const uid = getCurrentUid();
        if (uid) {
          const firestoreCart = await fetchUserCart(uid);
          setCartItems(firestoreCart);
        }
      } else {
        setCartItems([]);
      }
      setCartLoaded(true);
    };
    window.addEventListener('authStateChanged', loadCart);
    loadCart();
    return () => window.removeEventListener('authStateChanged', loadCart);
  }, []);

  // Save cart to Firestore whenever cartItems changes (if authenticated and after initial load)
  useEffect(() => {
    const saveCart = async () => {
      if (isAuthenticated() && cartLoaded) {
        const uid = getCurrentUid();
        if (uid) {
          await saveUserCart(uid, cartItems);
        }
      }
    };
    saveCart();
  }, [cartItems, cartLoaded]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    // Both must exist for user to be considered authenticated
    return !!(authToken && userData);
  };

  // Global add to cart function with authentication check
  const addToCartWithAuth = (product, calculations, quantityOrLength = 1, navigate = null) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Store redirect flag to go to cart after login
      localStorage.setItem('redirectToCartAfterLogin', 'true');
      
      // Redirect to login without alert
      if (navigate) {
        navigate('/login');
      } else {
        // Fallback navigation using window.location
        window.location.href = '/login';
      }
      return false;
    }

    // User is authenticated, proceed with adding to cart
    // Check if this is a composite plate (quantity) or tube (length)
    if (product.isCompositePlate) {
      addToCart(product, calculations, 1, quantityOrLength); // length=1, quantity=quantityOrLength
    } else {
      addToCart(product, calculations, quantityOrLength, 1); // length=quantityOrLength, quantity=1
    }
    return true;
  };

  // Check if should redirect to cart after login
  const checkCartRedirect = () => {
    const shouldRedirect = localStorage.getItem('redirectToCartAfterLogin');
    if (shouldRedirect && isAuthenticated()) {
      localStorage.removeItem('redirectToCartAfterLogin');
      return true;
    }
    return false;
  };

  // Add item to cart (internal function)
  const addToCart = (product, calculations, length = 1, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.length === length
    );

    if (existingItemIndex >= 0) {
      // If item already exists with same length, increase quantity
      const updatedItems = cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + quantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice
          };
        }
        return item;
      });
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      const newItem = {
        id: `${product.id}_${length}_${Date.now()}`, // Unique ID for cart item
        product,
        length,
        quantity: quantity, // Use the passed quantity instead of hardcoding 1
        unitPrice: calculations.mrp || calculations.price || calculations.mass, // Handle different price field names
        totalPrice: quantity * (calculations.mrp || calculations.price || calculations.mass),
        area: calculations.area || 0,
        weight: calculations.weight || calculations.mass || 0,
        addedAt: new Date().toISOString()
      };
      setCartItems(prev => [...prev, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice
        };
      }
      return item;
    }));
  };

  // Update item length (recalculates price)
  const updateLength = (itemId, newLength) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const lengthInMeters = parseFloat(newLength) || 1;
        const widthInMeters = 1; // 1000mm = 1m
        const area = lengthInMeters * widthInMeters; // sq meters
        const pricePerSqMeter = item.product.mrp; // Use product's specific MRP per sq meter
        const unitPrice = area * pricePerSqMeter;
        
        // Extract GSM value from product weight details
        const gsmValue = parseInt(item.product.details.weight.match(/\d+/)[0]);
        const weight = area * gsmValue / 1000; // weight in kg

        return {
          ...item,
          length: newLength,
          unitPrice,
          totalPrice: item.quantity * unitPrice,
          area,
          weight
        };
      }
      return item;
    }));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart totals
  const getCartTotals = () => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalArea = cartItems.reduce((sum, item) => sum + (item.area * item.quantity), 0);

    return {
      totalItems,
      totalPrice,
      totalWeight,
      totalArea
    };
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    addToCartWithAuth,
    checkCartRedirect,
    isAuthenticated,
    removeFromCart,
    updateQuantity,
    updateLength,
    clearCart,
    getCartTotals,
    toggleCart,
    setIsCartOpen,
    cartLoaded
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Export the context for direct use if needed
export default CartContext;