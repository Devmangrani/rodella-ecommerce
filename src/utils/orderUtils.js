// Enhanced Order Management Utils for Production

/**
 * Generate unique Order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Generate unique Invoice ID
 */
export const generateInvoiceId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

/**
 * Generate App ID for tracking
 */
export const generateAppId = () => {
  return `RODELLA-WEB-${Date.now()}`;
};

/**
 * Format order data for production with all required fields
 */
export const formatProductionOrderData = (cartItems, totals, paymentResponse, userInfo, userAddress = null) => {
  const orderId = generateOrderId();
  const invoiceId = generateInvoiceId();
  const appId = generateAppId();
  
  return {
    // Order identifiers
    orderId: orderId,
    invoiceId: invoiceId,
    appId: appId,
    appName: "Rodella Composites Shop",
    
    // Razorpay payment details
    razorpayPaymentId: paymentResponse.razorpay_payment_id,
    razorpayOrderId: paymentResponse.razorpay_order_id || '',
    razorpaySignature: paymentResponse.razorpay_signature || '',
    
    // Order details
    items: cartItems.map(item => ({
      id: item.product?.id || item.id,
      title: item.product?.title || item.title,
      category: item.product?.category || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      weight: item.weight || 0,
      area: item.area || 0,
      length: item.length || 1,
      image: item.product?.images?.[0] || item.image || '',
      // Include dimensions for different product types
      dimensions: item.product?.dimensions || item.dimensions || {},
      selectedSize: item.product?.selectedSize || item.selectedSize || '',
      isCompositePlate: item.product?.isCompositePlate || item.isCompositePlate || false,
      isTubeProduct: item.product?.isTubeProduct || item.isTubeProduct || false,
      isReinforcementProduct: item.product?.isReinforcementProduct || item.isReinforcementProduct || false,
      isCoreProduct: item.product?.isCoreProduct || item.isCoreProduct || false,
      isEpoxyProduct: item.product?.isEpoxyProduct || item.isEpoxyProduct || false
    })),
    
    // Totals
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
    totalWeight: totals.totalWeight,
    totalArea: totals.totalArea || 0,
    total: totals.totalPrice,
    
    // Customer information
    uid: userInfo.uid,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
    customerPhone: userInfo.contact,
    
    // Customer address (enhanced)
    customerAddress: userAddress || {
      street: 'Not provided',
      city: 'Not provided',
      state: 'Not provided',
      zipCode: 'Not provided',
      country: 'India'
    },
    
    // Payment information
    paymentMethod: 'Razorpay',
    paymentStatus: 'Captured',
    currency: 'INR',
    
    // Order status and tracking
    status: 'Processing',
    orderStage: 'Confirmed',
    trackingNumber: null,
    estimatedDelivery: null,
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Business information
    businessInfo: {
      companyName: 'Rodella Composites Shop',
      website: 'https://www.rodella.shop',
      supportEmail: 'paymentsrodellaecomerce@gmail.com',
      supportPhone: '+91 9999999999'
    },
    
    // Order notes
    notes: {
      customerNote: '',
      internalNote: `Order placed via web app - Payment ID: ${paymentResponse.razorpay_payment_id}`,
      userId: userInfo.uid
    }
  };
};

/**
 * Generate order confirmation email data
 */
export const generateOrderEmailData = (orderData) => {
  return {
    to: orderData.customerEmail,
    subject: `Order Confirmation - ${orderData.orderId}`,
    orderDetails: {
      orderId: orderData.orderId,
      invoiceId: orderData.invoiceId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderData.items,
      totalAmount: orderData.total,
      paymentMethod: orderData.paymentMethod,
      paymentId: orderData.razorpayPaymentId,
      orderDate: orderData.createdAt,
      estimatedDelivery: '5-7 business days'
    }
  };
};

/**
 * Format order for admin notification
 */
export const generateAdminNotificationData = (orderData) => {
  return {
    to: 'paymentsrodellaecomerce@gmail.com',
    subject: `New Order Received - ${orderData.orderId}`,
    orderDetails: {
      orderId: orderData.orderId,
      invoiceId: orderData.invoiceId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      totalAmount: orderData.total,
      totalItems: orderData.totalItems,
      paymentId: orderData.razorpayPaymentId,
      items: orderData.items.map(item => ({
        name: item.title,
        quantity: item.quantity,
        price: item.totalPrice
      }))
    }
  };
};

export default {
  generateOrderId,
  generateInvoiceId,
  generateAppId,
  formatProductionOrderData,
  generateOrderEmailData,
  generateAdminNotificationData
};
