# Pokemon Cards Store - Configuration Complete ✅

## What Has Been Updated

### 1. Backend API Configuration
**File Created:** `js/api-config.js`
- Backend URL: `https://froakie-tcg-backend.onrender.com`
- All API endpoints configured
- Helper functions for API requests

### 2. Razorpay Configuration
**File:** `js/razorpay-config.js`
- Live Mode: ENABLED
- Razorpay Key ID: `rzp_live_Rn3w5m3jxnc59J`
- Currency: INR
- Store Name: PokéCards Store

### 3. Data Management Updated
**File:** `js/data.js`
- Now fetches products from backend API
- Falls back to sample products if backend is unavailable
- Maintains cart in localStorage
- Orders stored locally

### 4. HTML Files Updated
The following files now include `api-config.js`:
- ✅ `index.html`
- ✅ `cart.html`
- ✅ `checkout.html`
- ⚠️ `admin.html` (needs update)

### 5. Policy Pages (Already Complete)
- ✅ `privacy.html`
- ✅ `terms.html`
- ✅ `shipping.html`
- ✅ `refund-policy.html`
- ✅ `contact.html`

## Remaining Tasks

### 1. Update admin.html
Add this line before other scripts:
```html
<script src="js/api-config.js"></script>
```

### 2. Update checkout.js
The checkout.js file needs to be updated to use the backend API for:
- Creating Razorpay orders
- Verifying payments
- Storing order information

### 3. Remove Admin Link from Customer View
Update the navigation in `index.html`, `cart.html`, and `checkout.html` to hide the Admin link from regular customers.

## How to Upload to GitHub

1. **Create a new repository** on GitHub (e.g., `froakie-tcg-frontend`)

2. **Upload these files** from the `pokemon-cards-store` folder:
   - All HTML files (index.html, cart.html, checkout.html, admin.html, policy pages)
   - css/ folder (style.css, admin.css if exists)
   - js/ folder (all JavaScript files including the new api-config.js)
   - Any images or assets

3. **DO NOT upload:**
   - .env files
   - node_modules/
   - Any backend files

4. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to Pages section
   - Select main branch as source
   - Save

5. **Your site will be live at:**
   `https://YOUR_USERNAME.github.io/froakie-tcg-frontend/`

## Testing Checklist

Before going live, test:
- [ ] Products load from backend
- [ ] Add to cart works
- [ ] Cart page displays correctly
- [ ] Checkout form validation
- [ ] Razorpay payment integration
- [ ] Order confirmation
- [ ] Admin panel (password protected)
- [ ] All policy pages load
- [ ] Mobile responsiveness

## Backend Requirements

Make sure your backend at `https://froakie-tcg-backend.onrender.com` has:
- [ ] CORS enabled for your GitHub Pages domain
- [ ] MongoDB connected with products
- [ ] Razorpay keys configured in environment variables
- [ ] All API endpoints working:
  - GET /api/products
  - POST /api/create-order
  - POST /api/verify-payment
  - GET /api/orders
  - POST /api/initialize

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Confirm Razorpay keys are correct
4. Test API endpoints using tools like Postman

---

**Configuration Date:** January 2025
**Backend URL:** https://froakie-tcg-backend.onrender.com
**Razorpay Mode:** LIVE
