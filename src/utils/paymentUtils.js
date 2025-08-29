// Client-side payment utilities for production
import { RAZORPAY_CONFIG } from '../config/razorpay';

/**
 * Generate a unique order receipt ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `order_${timestamp}_${random}`;
};

/**
 * Format order data for Firestore (client-side)
 */
export const formatOrderData = (cartItems, totals, paymentResponse, userInfo) => {
  return {
    // Order identifiers
    orderId: generateOrderId(),
    razorpayPaymentId: paymentResponse.razorpay_payment_id,
    razorpayOrderId: paymentResponse.razorpay_order_id || '',
    razorpaySignature: paymentResponse.razorpay_signature || '',
    
    // Order details
    items: cartItems.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      weight: item.weight || 0,
      area: item.area || 0,
      length: item.length || 0,
      dimensions: item.dimensions || {},
      // Product type flags
      isCompositePlate: item.isCompositePlate || false,
      isTubeProduct: item.isTubeProduct || false,
      isReinforcementProduct: item.isReinforcementProduct || false,
      isCoreProduct: item.isCoreProduct || false,
      isEpoxyProduct: item.isEpoxyProduct || false,
      selectedSize: item.selectedSize || ''
    })),
    
    // Totals
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
    totalWeight: totals.totalWeight,
    total: totals.totalPrice,
    
    // User information
    uid: userInfo.uid,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    customerPhone: userInfo.contact,
    
    // Payment information
    paymentMethod: 'razorpay',
    paymentStatus: 'completed',
    currency: RAZORPAY_CONFIG.CURRENCY,
    
    // Order status
    status: 'Processing',
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Create Razorpay options for client-side payment
 */
export const createRazorpayOptions = (amount, totals, userInfo, onSuccess, onFailure) => {
  return {
    key: RAZORPAY_CONFIG.KEY_ID,
    amount: Math.round(amount * 100), // Convert to paise
    currency: RAZORPAY_CONFIG.CURRENCY,
    name: RAZORPAY_CONFIG.COMPANY_NAME,
    description: `Order for ${totals.totalItems} items`,
    image: RAZORPAY_CONFIG.COMPANY_LOGO,
    
    // User prefill
    prefill: {
      name: userInfo.name,
      email: userInfo.email,
      contact: userInfo.contact
    },
    
    // Notes for tracking
    notes: {
      userId: userInfo.uid,
      totalItems: totals.totalItems,
      orderType: 'ecommerce'
    },
    
    // Theme
    theme: {
      color: RAZORPAY_CONFIG.THEME_COLOR
    },
    
    // Handlers
    handler: onSuccess,
    modal: {
      ondismiss: onFailure
    }
  };
};

/**
 * Validate payment response from Razorpay
 */
export const validatePaymentResponse = (response) => {
  const requiredFields = ['razorpay_payment_id'];
  return requiredFields.every(field => response[field]);
};

/**
 * Generate order confirmation message
 */
export const generateOrderConfirmation = (orderId) => {
  return `Payment successful! Your order has been placed. Order ID: ${orderId.slice(-8).toUpperCase()}`;
};

/**
 * Handle payment success (client-side only)
 */
export const handlePaymentSuccess = async (paymentResponse, cartItems, totals, userInfo, saveOrderCallback) => {
  try {
    // Validate payment response
    if (!validatePaymentResponse(paymentResponse)) {
      throw new Error('Invalid payment response');
    }

    // Format order data
    const orderData = formatOrderData(cartItems, totals, paymentResponse, userInfo);
    
    // Save order to Firestore
    const orderId = await saveOrderCallback(orderData);
    
    if (!orderId) {
      throw new Error('Failed to save order');
    }

    return {
      success: true,
      orderId: orderId,
      message: generateOrderConfirmation(orderId)
    };

  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
};

export default {
  generateOrderId,
  formatOrderData,
  createRazorpayOptions,
  validatePaymentResponse,
  generateOrderConfirmation,
  handlePaymentSuccess
};
