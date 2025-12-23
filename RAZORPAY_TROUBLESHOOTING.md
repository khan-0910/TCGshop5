# Razorpay Payment Error - Complete Troubleshooting Guide

## 🔍 Common Reasons for "Payment Failed" Error

### 1. **Razorpay Account Not Activated (Most Common)**
Your Razorpay account needs to be fully activated for LIVE mode to work.

#### Check Activation Status:
1. Go to https://dashboard.razorpay.com/
2. Look for activation status banner
3. Check if you see "Account Pending Activation" or similar message

#### What's Required for Activation:
- ✅ Business KYC documents
- ✅ Bank account verification
- ✅ GST details (if applicable)
- ✅ Business address proof
- ✅ Identity proof (PAN/Aadhaar)

#### Activation Timeline:
- Usually takes 2-3 business days
- Can take up to 7 days in some cases

---

### 2. **Incorrect API Keys**
Even if keys are entered, they might be incorrect.

#### Verify Your Keys:
1. Go to https://dashboard.razorpay.com/app/keys
2. Click "Live Mode" tab
3. Check if keys match exactly

**Frontend:** `pokemon-cards-store/js/razorpay-config.js`
```javascript
live: {
    keyId: 'rzp_live_XXXXXXXXXXXXX',  // Must match dashboard
    keySecret: 'XXXXXXXXXXXXXXXX'      // Must match dashboard
},
```

**Backend:** Environment variables on Render.com
```
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXX
```

---

### 3. **Backend Not Updated**
Frontend has new keys but backend still has old keys.

#### Check Backend Environment Variables:
1. Go to https://dashboard.render.com/
2. Find your backend service
3. Go to "Environment" tab
4. Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
5. Click "Save Changes"
6. **Important:** Click "Manual Deploy" → "Deploy latest commit"

---

### 4. **Browser Cache**
Old JavaScript files cached in browser.

#### Clear Cache:
- **Chrome/Edge:** Press `Ctrl + Shift + Delete`
- **Firefox:** Press `Ctrl + Shift + Delete`
- Or use Incognito/Private mode

#### Hard Refresh:
- Press `Ctrl + F5` (Windows)
- Press `Cmd + Shift + R` (Mac)

---

### 5. **Payment Method Restrictions**
Some Razorpay accounts have payment method restrictions.

#### Check Payment Methods:
1. Go to https://dashboard.razorpay.com/app/payment-methods
2. Ensure Cards, UPI, Netbanking are enabled
3. Check if there are any restrictions

---

## 🧪 Recommended Solution: Use TEST Mode First

Since LIVE mode requires activation, I recommend using TEST mode until your account is activated.

### Switch to TEST Mode:

**File:** `pokemon-cards-store/js/razorpay-config.js`

```javascript
// Current Mode: 'test' or 'live'
mode: 'test',  // Change from 'live' to 'test'
```

### Test Card Details:
- **Card Number:** `4111 1111 1111 1111`
- **Expiry:** Any future date (e.g., `12/25`)
- **CVV:** Any 3 digits (e.g., `123`)
- **Name:** Any name

### Benefits of TEST Mode:
✅ Works immediately (no activation needed)
✅ Test complete checkout flow
✅ Verify all features work
✅ No real money involved
✅ Orders still saved to database
✅ Can test unlimited times

---

## 🔧 Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open your website
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Try making a payment
5. Look for error messages

### Common Console Errors:

**Error:** `Invalid key_id`
**Solution:** Check if key ID is correct in `razorpay-config.js`

**Error:** `Account not activated`
**Solution:** Your Razorpay account needs activation

**Error:** `Network error`
**Solution:** Check if backend is running

**Error:** `CORS error`
**Solution:** Backend CORS settings issue

---

### Step 2: Test Backend API

Open this URL in browser:
```
https://froakie-tcg-backend.onrender.com/
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Froakie_TCG Backend Server Running",
  "timestamp": "2025-01-XX..."
}
```

If you don't see this, backend is down.

---

### Step 3: Check Razorpay Dashboard

1. Go to https://dashboard.razorpay.com/app/dashboard
2. Check "Recent Payments" section
3. See if any payment attempts are showing
4. Check error messages if any

---

### Step 4: Verify Environment Variables

**On Render.com:**
1. Go to your backend service
2. Click "Environment" tab
3. Verify these variables exist:
   - `MONGODB_URI`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Make sure no extra spaces or quotes

---

## 📋 Checklist Before Going LIVE

- [ ] Razorpay account fully activated
- [ ] KYC documents submitted and approved
- [ ] Bank account verified
- [ ] Live API keys generated
- [ ] Frontend updated with live keys
- [ ] Backend environment variables updated
- [ ] Backend redeployed after key update
- [ ] Browser cache cleared
- [ ] Test payment successful
- [ ] Payment methods enabled in dashboard

---

## 🎯 Quick Fix: Use TEST Mode Now

**Immediate Solution:**

1. **Change to TEST mode:**
   ```javascript
   // In pokemon-cards-store/js/razorpay-config.js
   mode: 'test',
   ```

2. **Clear browser cache:** Press `Ctrl + Shift + Delete`

3. **Test with test card:** `4111 1111 1111 1111`

4. **Verify it works**

5. **Switch to LIVE later** when account is activated

---

## 🆘 Still Not Working?

### Check These:

1. **Is backend running?**
   - Visit: https://froakie-tcg-backend.onrender.com/
   - Should show "ok" status

2. **Are products loading?**
   - If products don't load, backend issue
   - Check backend logs on Render.com

3. **Is cart working?**
   - Can you add items to cart?
   - If not, check browser console

4. **Does checkout page load?**
   - Can you reach checkout page?
   - Does cart preview show?

5. **Does Razorpay popup open?**
   - If popup doesn't open, key issue
   - Check browser console for errors

---

## 📞 Get Help from Razorpay

If account activation is the issue:

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: +91-80-6890-6890
- Dashboard: https://dashboard.razorpay.com/app/support

**Ask them:**
- "When will my account be activated?"
- "What documents are pending?"
- "Can you expedite activation?"

---

## ✅ Recommended Approach

### For Now (Immediate):
1. Use **TEST mode**
2. Test all features
3. Verify everything works
4. Show to customers (explain it's test mode)

### For Production (Later):
1. Wait for Razorpay activation
2. Get live keys
3. Update frontend and backend
4. Test with small real payment
5. Go live!

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Razorpay popup opens
- ✅ Payment form loads
- ✅ Payment processes successfully
- ✅ Order appears in admin panel
- ✅ Stock updates
- ✅ No error messages

---

## 📝 Summary

**Most Likely Issue:** Razorpay account not activated for LIVE mode

**Best Solution:** Use TEST mode until activation complete

**Test Mode Benefits:**
- Works immediately
- Test all features
- No real money
- Orders still saved
- Perfect for development

**When to Use LIVE Mode:**
- Account fully activated
- KYC approved
- Ready for real payments
- All testing complete
