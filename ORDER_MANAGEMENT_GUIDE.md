# Order Management System - Complete Guide

## 📦 How Orders Work

### Order Flow
1. **Customer Places Order** → Completes payment via Razorpay
2. **Order Saved to Backend** → Stored in MongoDB database
3. **Order Visible in Admin Panel** → You can view all orders in the admin dashboard
4. **Stock Updated** → Product stock automatically decreases

---

## 🎯 Where to View Orders

### Admin Panel - Orders Tab

**Access:** `admin.html` → Click "Orders" tab

The admin panel has TWO tabs:
1. **Products Tab** - Manage your product inventory
2. **Orders Tab** - View all customer orders

### Order Information Displayed:

| Column | Description |
|--------|-------------|
| **Order ID** | Unique order identifier |
| **Customer** | Customer name and email |
| **Items** | Number of products ordered |
| **Total** | Total amount paid (₹) |
| **Status** | PAID / PENDING / FAILED |
| **Date** | Order date and time |
| **Actions** | "View Details" button |

---

## 📋 Order Details

Click **"View Details"** on any order to see:

### Customer Information
- Full Name
- Email Address
- Phone Number

### Shipping Address
- Address Line 1 & 2
- Landmark (if provided)
- City, State, Pincode

### Order Items
- Product names
- Individual prices
- Quantities
- Subtotals

### Payment Information
- Order ID
- Razorpay Payment ID
- Payment Status
- Order Date & Time

### Order Summary
- Subtotal (products cost)
- Tax (18% GST)
- Delivery Charge (Regular/Premium)
- **Grand Total**

---

## 🔍 Filter Orders

Use the **Status Filter** dropdown to view:
- **All Orders** - Show everything
- **Paid** - Successfully completed orders
- **Pending** - Orders awaiting payment
- **Failed** - Failed payment attempts

---

## 📧 Where You Receive Order Notifications

### Current System (Frontend Only):
Orders are currently stored in:
1. **MongoDB Database** (Backend)
2. **Admin Panel** (View in browser)

### ⚠️ Important Note:
**You do NOT receive email notifications automatically.** You need to:
1. Regularly check the admin panel
2. Manually note down customer details
3. Process orders based on admin panel information

---

## 🔔 How to Get Order Notifications (Future Enhancement)

To receive email notifications when orders are placed, you would need to add:

### Backend Email Service (Not Currently Implemented):
```javascript
// Example: Add to backend server.js
const nodemailer = require('nodemailer');

// When order is created, send email:
await sendOrderEmail({
    to: 'your-email@example.com',
    subject: 'New Order Received',
    orderDetails: order
});
```

### Recommended Email Services:
- **SendGrid** - Free tier available
- **Mailgun** - Good for transactional emails
- **Nodemailer** - Self-hosted SMTP
- **AWS SES** - Amazon's email service

---

## 📱 Current Order Workflow

### For You (Store Owner):

1. **Check Admin Panel Regularly**
   - Open `admin.html`
   - Click "Orders" tab
   - Review new orders

2. **View Order Details**
   - Click "View Details" on each order
   - Note customer information
   - Check shipping address

3. **Process Order**
   - Prepare products for shipping
   - Pack items
   - Ship to customer address

4. **Update Customer**
   - Manually email customer with tracking info
   - Confirm shipment

### For Customer:

1. **Places Order** → Pays via Razorpay
2. **Receives Confirmation** → Alert message on website
3. **Waits for Shipment** → You process and ship
4. **Receives Products** → Delivery complete

---

## 💾 Order Data Storage

### Backend Database (MongoDB):
```javascript
Order Schema:
{
    orderId: "ORD-1234567890",
    customer: {
        name: "Customer Name",
        email: "customer@email.com",
        phone: "1234567890",
        address: { ... }
    },
    items: [
        {
            productId: "MongoDB_ID",
            name: "Product Name",
            price: 299.99,
            quantity: 2
        }
    ],
    total: 699.98,
    tax: 125.99,
    deliveryCharge: 100,
    deliveryType: "regular",
    status: "paid",
    razorpayPaymentId: "pay_xxxxx",
    createdAt: "2025-01-10T12:00:00Z"
}
```

### Access Orders:
- **Admin Panel:** Visual interface in browser
- **Backend API:** `GET /api/orders`
- **Database:** Direct MongoDB access

---

## 🛠️ Admin Panel Features

### Products Tab:
✅ Add new products
✅ Edit existing products
✅ Delete products
✅ View stock levels
✅ See product statistics

### Orders Tab:
✅ View all orders
✅ Filter by status
✅ View detailed order information
✅ See customer details
✅ Check payment status

---

## 📊 Order Statistics

The admin panel shows:
- Total number of orders
- Orders by status (Paid/Pending/Failed)
- Revenue information
- Recent order activity

---

## 🔐 Admin Panel Access

### URL:
```
file:///C:/Users/khana/Desktop/pokemon-cards-store/admin.html
```

Or if deployed:
```
https://your-domain.com/admin.html
```

### Password Protection:
The admin panel has password protection. Default password is set in the HTML file.

---

## 📝 Order Processing Checklist

When you receive a new order:

- [ ] Check admin panel for new orders
- [ ] Click "View Details" to see full information
- [ ] Note down customer details
- [ ] Verify payment status is "PAID"
- [ ] Check Razorpay Payment ID
- [ ] Prepare products for shipping
- [ ] Pack items securely
- [ ] Ship to customer address
- [ ] Send tracking info to customer email
- [ ] Mark order as fulfilled (manually track)

---

## 🚀 Recommended Improvements

### 1. Email Notifications
Add email service to automatically notify you of new orders

### 2. Order Status Updates
Add ability to update order status (Processing, Shipped, Delivered)

### 3. Tracking Integration
Integrate with shipping providers for automatic tracking

### 4. Customer Notifications
Send automated emails to customers about order status

### 5. Invoice Generation
Automatically generate PDF invoices for orders

### 6. Analytics Dashboard
Add charts and graphs for sales analytics

---

## 🆘 Troubleshooting

### Orders Not Showing in Admin Panel?

**Check:**
1. Backend server is running
2. API URL is correct in `api-config.js`
3. MongoDB database is connected
4. Browser console for errors

**Solution:**
```bash
# Check backend logs
cd Froakie_TCG_Backend
npm start
```

### Can't Access Admin Panel?

**Check:**
1. Admin password is correct
2. File path is correct
3. All JavaScript files are loaded

---

## 📞 Support

If you need help with:
- Setting up email notifications
- Adding order status updates
- Integrating shipping providers
- Custom features

Refer to the backend documentation or contact your developer.

---

## 🎉 Summary

**Where to View Orders:**
- Admin Panel → Orders Tab → View all orders

**How to Access:**
- Open `admin.html` in browser
- Click "Orders" tab
- View and manage all customer orders

**Current Limitations:**
- No automatic email notifications
- Manual order processing required
- No automated status updates

**What Works:**
✅ All orders saved to database
✅ Full order details available
✅ Customer information captured
✅ Payment status tracked
✅ Order filtering by status
✅ Detailed order view
