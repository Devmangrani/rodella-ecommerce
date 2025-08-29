# Razorpay Live Integration Guide

## ✅ Integration Status
- **Frontend**: ✅ Updated to use live keys
- **Backend**: ✅ Firebase functions configured (pending deployment)
- **Configuration**: ✅ Environment variables set
- **Webhooks**: ✅ Configured for live mode

## 🔑 Live API Keys (Configured)

### Frontend Integration
- **Live Key ID**: `rzp_live_RBAnaQ0QJRsFF4`
- **Location**: `/src/config/razorpay.js`
- **Usage**: Cart payment processing

### Backend Integration (Firebase Functions)
- **Live Key ID**: `rzp_live_RBAnaQ0QJRsFF4`
- **Live Key Secret**: `4UT0hzvMSGq3Qhzpb9U6q6Oj`
- **Webhook Secret**: `MyStrongWebhookSecret123!`

## 🚀 Deployment Requirements

### Firebase Project Upgrade
**⚠️ IMPORTANT**: The Firebase project needs to be upgraded to the **Blaze (Pay-as-you-go)** plan to deploy functions.

1. Visit: https://console.firebase.google.com/project/rodella-ecommerce-app/usage/details
2. Upgrade to Blaze plan
3. Deploy functions using: `firebase deploy --only functions --project rodella-ecommerce-app`

### Firebase Functions Endpoints (After Deployment)
```
Create Order: https://us-central1-rodella-ecommerce-app.cloudfunctions.net/createRazorpayOrder
Verify Payment: https://us-central1-rodella-ecommerce-app.cloudfunctions.net/verifyRazorpayPayment  
Webhook Handler: https://us-central1-rodella-ecommerce-app.cloudfunctions.net/razorpayWebhook
```

## 🔧 Configuration Files Updated

### 1. Frontend Configuration
- **File**: `/src/config/razorpay.js`
- **Purpose**: Centralized Razorpay configuration
- **Features**: Live keys, theme, helper functions

### 2. Cart Component
- **File**: `/src/components/Cart.jsx`
- **Changes**: 
  - Updated to use live key: `rzp_live_RBAnaQ0QJRsFF4`
  - Added live mode configuration
  - Integrated with centralized config

### 3. Firebase Functions
- **File**: `/functions/functions/index.js`
- **Features**:
  - Order creation with Razorpay
  - Payment verification
  - Webhook handling
  - Firestore integration

## 🎯 Live Mode Features

### Payment Processing
- **Real payments**: All transactions will be processed with real money
- **Live dashboard**: Payments visible in Razorpay live dashboard
- **Automatic capture**: Payments are automatically captured
- **Order tracking**: Orders saved to Firestore with payment details

### Security Features
- **Signature verification**: All payments verified using webhook signatures
- **CORS protection**: Functions protected with proper CORS configuration
- **Environment variables**: Sensitive keys stored in Firebase config

## 📋 Testing Checklist

### Pre-Deployment (Current Status)
- ✅ Live keys configured in frontend
- ✅ Firebase functions code ready
- ✅ Configuration files created
- ✅ Dependencies installed
- ⏳ **Pending**: Firebase project upgrade to Blaze plan

### Post-Deployment Testing
1. **Real Payment Test**: Use a small amount (₹1) to test live integration
2. **Order Verification**: Check order appears in Firestore
3. **Webhook Testing**: Verify webhook events are processed
4. **Dashboard Check**: Confirm payments appear in Razorpay dashboard

## ⚠️ Important Notes

### Security Considerations
- **Live Keys**: Never commit live keys to public repositories
- **Webhook Security**: Webhook signatures are verified for security
- **HTTPS Only**: All live transactions require HTTPS

### Cost Implications
- **Firebase Functions**: Blaze plan required (pay-per-use)
- **Razorpay Fees**: Live transactions incur standard Razorpay fees
- **Real Money**: All test transactions will process real payments

## 🔄 Migration from Test to Live

### What Changed
1. **API Keys**: `rzp_test_*` → `rzp_live_*`
2. **Mode Setting**: Added explicit live mode configuration
3. **Webhook URLs**: Updated to use live webhook endpoints
4. **Security**: Enhanced signature verification

### What Stays the Same
- **UI/UX**: No changes to user experience
- **Order Flow**: Same order processing workflow
- **Data Structure**: Same order data format in Firestore

## 📞 Support Information

### Razorpay Support
- **Dashboard**: https://dashboard.razorpay.com/
- **Documentation**: https://razorpay.com/docs/
- **Support**: https://razorpay.com/support/

### Firebase Support
- **Console**: https://console.firebase.google.com/
- **Documentation**: https://firebase.google.com/docs/functions
- **Support**: https://firebase.google.com/support

---

## 🚀 Next Steps

1. **Upgrade Firebase Project** to Blaze plan
2. **Deploy Firebase Functions** using the command above
3. **Test with Small Amount** (₹1) to verify live integration
4. **Monitor Transactions** in both Razorpay and Firebase dashboards
5. **Update Webhook URLs** in Razorpay dashboard if needed

**Status**: Ready for deployment once Firebase project is upgraded to Blaze plan.
