# 📧 Email Templates for Order Notifications

## 🎯 **Customer Order Confirmation Email**

**Subject**: Order Confirmation - {orderId}

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation - Rodella Composites</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3B82F6;">Rodella Composites Shop</h1>
            <h2 style="color: #059669;">Order Confirmation</h2>
        </div>

        <!-- Order Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Invoice ID:</strong> {invoiceId}</p>
            <p><strong>Order Date:</strong> {orderDate}</p>
            <p><strong>Payment ID:</strong> {paymentId}</p>
            <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        </div>

        <!-- Customer Information -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Email:</strong> {customerEmail}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
            <p><strong>Address:</strong> {customerAddress}</p>
        </div>

        <!-- Order Items -->
        <div style="margin-bottom: 20px;">
            <h3>Ordered Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #3B82F6; color: white;">
                        <th style="padding: 10px; text-align: left;">Item</th>
                        <th style="padding: 10px; text-align: center;">Quantity</th>
                        <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems}
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>Estimated Delivery:</strong> 5-7 business days</p>
            <p>Thank you for choosing Rodella Composites!</p>
            <p>For support: paymentsrodellaecomerce@gmail.com | +91 9999999999</p>
            <p><a href="https://www.rodella.shop" style="color: #3B82F6;">Visit our website</a></p>
        </div>
    </div>
</body>
</html>
```

---

## 🔔 **Admin Order Notification Email**

**Subject**: New Order Received - {orderId}

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Order - Rodella Composites Admin</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #DC2626;">🚨 NEW ORDER ALERT</h1>
            <h2 style="color: #3B82F6;">Rodella Composites Shop</h2>
        </div>

        <!-- Order Summary -->
        <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #DC2626;">Order Summary</h3>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Invoice ID:</strong> {invoiceId}</p>
            <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
            <p><strong>Total Items:</strong> {totalItems}</p>
            <p><strong>Payment ID:</strong> {paymentId}</p>
        </div>

        <!-- Customer Details -->
        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #0369a1;">Customer Details</h3>
            <p><strong>Name:</strong> {customerName}</p>
            <p><strong>Email:</strong> {customerEmail}</p>
            <p><strong>Phone:</strong> {customerPhone}</p>
            <p><strong>Address:</strong></p>
            <div style="margin-left: 20px;">
                <p>{customerAddress.street}</p>
                <p>{customerAddress.city}, {customerAddress.state}</p>
                <p>{customerAddress.zipCode}, {customerAddress.country}</p>
            </div>
        </div>

        <!-- Order Items -->
        <div style="margin-bottom: 20px;">
            <h3>Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <thead>
                    <tr style="background: #3B82F6; color: white;">
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: center;">Qty</th>
                        <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {adminOrderItems}
                </tbody>
            </table>
        </div>

        <!-- Actions -->
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://dashboard.razorpay.com/" 
               style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">
                View in Razorpay
            </a>
            <a href="https://console.firebase.google.com/" 
               style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px;">
                View in Firebase
            </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p><strong>Action Required:</strong> Process this order and update inventory</p>
            <p>Rodella Composites Admin Panel</p>
        </div>
    </div>
</body>
</html>
```

---

## 📱 **SMS Template (Optional)**

**For Customer:**
```
🎉 Order confirmed! 
Order: {orderId}
Amount: ₹{totalAmount}
Delivery: 5-7 days
Track: https://www.rodella.shop/orders
- Rodella Composites
```

**For Admin:**
```
🚨 NEW ORDER: {orderId}
Customer: {customerName}
Amount: ₹{totalAmount}
Items: {totalItems}
Check dashboard immediately!
```

---

## 🔧 **Email Integration Options**

### **Option 1: EmailJS (Recommended for Quick Setup)**
- Free tier available
- Client-side email sending
- No backend required

### **Option 2: Firebase Functions + SendGrid**
- Requires Blaze plan
- Server-side email sending
- More reliable

### **Option 3: Vercel Serverless Functions + Resend**
- Works with current Vercel deployment
- Serverless email sending
- Professional email service

---

## 📊 **Current Implementation**

The email data is currently logged to console. To implement actual email sending:

1. **Choose email service** (EmailJS recommended)
2. **Create templates** using above HTML
3. **Replace console.log** with actual email sending
4. **Test with small orders** first

**Next Steps:**
1. Set up EmailJS account
2. Configure email templates
3. Replace console.log with EmailJS.send()
4. Test email notifications
