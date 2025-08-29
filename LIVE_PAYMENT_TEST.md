# Live Payment Testing Guide

## ⚠️ IMPORTANT NOTICE
**THIS IS LIVE MODE - REAL MONEY WILL BE PROCESSED**

All transactions in live mode will process actual payments. Use minimal amounts for testing.

## 🧪 Testing Steps

### Step 1: Verify Configuration
1. Check that the frontend is using live key: `rzp_live_RBAnaQ0QJRsFF4`
2. Ensure Firebase project is upgraded to Blaze plan
3. Confirm Firebase functions are deployed

### Step 2: Small Amount Test (₹1)
```
1. Add a low-cost item to cart
2. Proceed to checkout
3. Use a real payment method with ₹1
4. Complete the transaction
5. Verify order appears in dashboard
```

### Step 3: Payment Methods to Test
- **UPI**: PhonePe, Google Pay, Paytm
- **Cards**: Debit/Credit cards
- **Net Banking**: Any bank
- **Wallets**: Paytm, PhonePe wallet

### Step 4: Verification Points

#### Frontend Verification
- ✅ Payment popup shows "Live" mode (not test)
- ✅ Real payment methods are displayed
- ✅ Order confirmation appears after payment
- ✅ User redirected to dashboard

#### Backend Verification
- ✅ Order saved in Firestore with payment details
- ✅ Payment ID matches Razorpay dashboard
- ✅ Order status updated correctly

#### Razorpay Dashboard
- ✅ Payment appears in live dashboard
- ✅ Amount matches the order total
- ✅ Payment status is "Captured"
- ✅ Customer details are correct

## 🔍 Debugging Checklist

### If Payment Fails
1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Keys**: Ensure live key is correct in config
3. **Network Tab**: Check API calls to Razorpay
4. **Firebase Logs**: Check function execution logs

### If Order Doesn't Save
1. **Firestore Rules**: Verify write permissions
2. **Firebase Functions**: Check function logs
3. **Authentication**: Ensure user is logged in
4. **Data Structure**: Verify order data format

## 💳 Test Transaction Details

### Recommended Test Amount
**₹1.00** - Minimal amount to verify integration

### Test Card (if needed)
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Test User
```

### UPI Test
Use your actual UPI ID for testing (₹1 will be deducted)

## 📊 Success Criteria

### ✅ Integration Successful If:
1. Payment processes without errors
2. Order appears in user dashboard
3. Payment visible in Razorpay live dashboard
4. Email confirmation sent (if configured)
5. Order status updates correctly

### ❌ Integration Failed If:
1. Payment popup doesn't appear
2. Payment fails with error
3. Order doesn't save to database
4. Payment not visible in Razorpay dashboard

## 🚨 Emergency Procedures

### If Large Amount Charged by Mistake
1. **Contact Razorpay Support** immediately
2. **Refund via Dashboard**: Process refund through Razorpay
3. **Disable Live Mode**: Switch back to test mode if needed

### If Multiple Test Payments
- All test payments will be real charges
- Process refunds through Razorpay dashboard
- Consider using Razorpay's refund API

## 📞 Support Contacts

### Immediate Issues
- **Razorpay Support**: https://razorpay.com/support/
- **Firebase Support**: https://firebase.google.com/support/

### Dashboard Access
- **Razorpay Live**: https://dashboard.razorpay.com/
- **Firebase Console**: https://console.firebase.google.com/

---

## ⚡ Quick Test Commands

### Check Configuration
```bash
# Verify live key in code
grep -r "rzp_live_RBAnaQ0QJRsFF4" src/

# Check Firebase functions status
firebase functions:log --project rodella-ecommerce-app
```

### Monitor Real-Time
1. **Razorpay Dashboard**: Keep open during testing
2. **Firebase Console**: Monitor Firestore updates
3. **Browser DevTools**: Watch network requests

**Remember: Every transaction in live mode processes real money. Test responsibly!**
