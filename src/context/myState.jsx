import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rodella_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('rodella_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, calculations, length = 1) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product.id === product.id && item.length === length
    );

    if (existingItemIndex >= 0) {
      // If item already exists with same length, increase quantity
      const updatedItems = cartItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
            totalPrice: (item.quantity + 1) * item.unitPrice
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
        quantity: 1,
        unitPrice: calculations.mrp,
        totalPrice: calculations.mrp,
        area: calculations.area,
        weight: calculations.weight,
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
    removeFromCart,
    updateQuantity,
    updateLength,
    clearCart,
    getCartTotals,
    toggleCart,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Export the context for direct use if needed
export default CartContext;