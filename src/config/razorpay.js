// Razorpay Configuration for Live Mode
export const RAZORPAY_CONFIG = {
  // Live Keys - DO NOT COMMIT TO PUBLIC REPOS
  KEY_ID: 'rzp_live_RBAnaQ0QJRsFF4',
  
  // Configuration options
  CURRENCY: 'INR',
  COMPANY_NAME: 'Rodella Composites Shop',
  COMPANY_LOGO: '/assets/logo.jpg',
  
  // Live mode settings
  MODE: 'live',
  
  // Theme configuration
  THEME_COLOR: '#3B82F6',
  
  // Webhook endpoints (when Firebase functions are deployed)
  WEBHOOK_ENDPOINTS: {
    CREATE_ORDER: 'https://us-central1-rodella-ecommerce-app.cloudfunctions.net/createRazorpayOrder',
    VERIFY_PAYMENT: 'https://us-central1-rodella-ecommerce-app.cloudfunctions.net/verifyRazorpayPayment',
    WEBHOOK_HANDLER: 'https://us-central1-rodella-ecommerce-app.cloudfunctions.net/razorpayWebhook'
  }
};

// Helper function to format amount to paise
export const formatAmountToPaise = (amount) => {
  return Math.round(parseFloat(amount) * 100);
};

// Helper function to format amount from paise to rupees
export const formatAmountFromPaise = (amountInPaise) => {
  return (parseFloat(amountInPaise) / 100).toFixed(2);
};

// Validation function for payment data
export const validatePaymentData = (paymentData) => {
  const required = ['razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature'];
  return required.every(field => paymentData[field]);
};

export default RAZORPAY_CONFIG;
