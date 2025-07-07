# 🧪 Rodella E-commerce Testing Guide

## Complete Order Flow Testing (No Real Money)

### Prerequisites
- App running on http://localhost:5174/
- Firebase project configured
- Razorpay test key: `rzp_test_TZsfCOp4wKi2nJ`

### 🔐 Step 1: Authentication Test
1. **Sign Up/Login:**
   ```
   - Go to http://localhost:5174/signup
   - Create account or use Google Sign-in
   - Verify you're redirected to dashboard
   ```

2. **Profile Setup:**
   ```
   - Go to Dashboard → Edit Profile
   - Add: Name, Phone, Address
   - Save changes
   ```

### 🛒 Step 2: Shopping Cart Test
1. **Add Products:**
   ```
   - Browse to any product category
   - Configure product (dimensions, quantity)
   - Click "Add to Cart"
   - Verify cart updates
   ```

2. **Cart Management:**
   ```
   - Go to /cart
   - Update quantities
   - Remove items
   - Verify calculations
   ```

### 💳 Step 3: Checkout Test (FREE - No Real Money)

#### Option A: Test Credit Card
```
Card Number: 4111 1111 1111 1111
Expiry Date: 12/25
CVV: 123
Cardholder: Test User
```

#### Option B: Test UPI
```
UPI ID: success@razorpay
```

#### Option C: Test Netbanking
```
Select any bank → Will redirect to test page
Username: test
Password: test
```

### 🔄 Step 4: Complete Flow Test
1. **Place Order:**
   ```
   - Cart → "Proceed to Checkout"
   - Razorpay modal opens
   - Use test payment method above
   - Click "Pay Now"
   ```

2. **Verify Success:**
   ```
   - Payment success message
   - Cart clears automatically
   - Redirected to dashboard
   ```

3. **Check Order History:**
   ```
   - Dashboard → Order History section
   - Verify order appears
   - Check order details match cart
   - Verify status: "Processing"
   ```

### 📊 Step 5: Firebase Verification

#### Check Firestore Console:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Check collections:
   ```
   📁 users/
     └── [user_uid]/
         ├── firstName: "John"
         ├── lastName: "Doe"
         ├── email: "john@example.com"
         └── address: {...}

   📁 orders/
     └── [order_id]/
         ├── uid: "user_uid"
         ├── total: 1299.50
         ├── status: "Processing"
         ├── items: [...]
         ├── razorpayPaymentId: "pay_xxxxx"
         └── createdAt: Timestamp
   ```

### 🚨 Common Test Scenarios

#### Test Failed Payment:
```
Card Number: 4000 0000 0000 0002
Result: Payment will fail (expected behavior)
```

#### Test Without Login:
```
Add to cart → Checkout
Result: Redirected to login page
```

#### Test Empty Cart:
```
Go to cart with no items
Result: "Proceed to Checkout" button disabled
```

### 🎯 Expected Results Checklist

#### ✅ Cart Functionality:
- [ ] Products add to cart
- [ ] Quantities update correctly
- [ ] Price calculations accurate
- [ ] Cart persists after login

#### ✅ Checkout Process:
- [ ] Authentication required
- [ ] Razorpay modal opens
- [ ] Test payments work
- [ ] Order saves to Firebase
- [ ] Cart clears after payment

#### ✅ Order Management:
- [ ] Orders appear in dashboard
- [ ] Order details accurate
- [ ] Status displays correctly
- [ ] Currency formatted as ₹

#### ✅ Firebase Integration:
- [ ] Orders collection created
- [ ] User data linked correctly
- [ ] Timestamps working
- [ ] Order retrieval working

### 🔧 Debugging Tips

#### If Orders Don't Appear:
1. Check browser console for errors
2. Verify Firebase rules allow read/write
3. Check user authentication state
4. Verify order UID matches current user

#### If Payment Fails:
1. Check Razorpay key is correct
2. Verify test card numbers
3. Check browser console
4. Ensure test mode is enabled

#### If Cart Issues:
1. Check localStorage for cart data
2. Verify user authentication
3. Check network requests to Firebase
4. Clear browser cache and retry

### 📞 Support
- Check browser console for detailed error messages
- Verify Firebase project permissions
- Ensure all environment variables are set correctly 