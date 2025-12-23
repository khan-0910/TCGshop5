# Comprehensive Testing Guide - Cart Functionality Fix

## Backend API Testing Results ✅

### Test 1: Get Products Endpoint
**Endpoint:** `GET https://froakie-tcg-backend.onrender.com/api/products`

**Result:** ✅ SUCCESS
```json
{
  "success": true,
  "products": [
    {
      "_id": "693968a3a30996a08473e62c",
      "name": "a",
      "price": 11,
      "stock": 10,
      "description": "yuh",
      "image": "https://via.placeholder.com/300x420?text=No+Image",
      "marketPrice": 12,
      "marketUrl": "https://www.tcgplayer.com/product/223194",
      "marketSource": "TCGPlayer"
    },
    {
      "_id": "69395e46a30996a08473e5e6",
      "name": "Charizard VMAX",
      "price": 11,
      "stock": 1,
      "description": "a",
      "image": "https://via.placeholder.com/300x420?text=No+Image",
      "marketPrice": 11,
      "marketUrl": "https://www.tcgplayer.com/product/223194",
      "marketSource": "TCGPlayer"
    }
  ]
}
```

**Verification:**
- ✅ Backend is online and responding
- ✅ Products have MongoDB `_id` fields (strings)
- ✅ Two products available for testing
- ✅ Products have stock available

---

## Frontend Testing Checklist

### Prerequisites
1. Open the website: `file:///C:/Users/khana/Desktop/pokemon-cards-store/index.html`
2. Open browser console (F12) to check for errors
3. Clear localStorage before testing (optional): `localStorage.clear()`

---

### Test Suite 1: Store Page (index.html)

#### Test 1.1: Products Display
- [ ] Open index.html in browser
- [ ] Verify 2 products are displayed
- [ ] Check product names: "a" and "Charizard VMAX"
- [ ] Verify product images load
- [ ] Check prices display correctly (₹11.00)
- [ ] Verify stock status shows correctly

**Expected Result:** All products display with correct information

---

#### Test 1.2: Add to Cart - Quick Add
- [ ] Click "Add to Cart" button on first product ("a")
- [ ] Check for success toast message: "Added to cart!"
- [ ] Verify cart count in header updates to "1"
- [ ] Click "Add to Cart" on same product again
- [ ] Verify cart count updates to "2"

**Expected Result:** 
- Toast notification appears
- Cart count increases correctly
- No console errors

---

#### Test 1.3: Add to Cart - Product Modal
- [ ] Click on product image to open modal
- [ ] Verify modal shows product details
- [ ] Check quantity selector (default should be 1)
- [ ] Change quantity to 3
- [ ] Click "Add to Cart" in modal
- [ ] Verify success message shows quantity added
- [ ] Check cart count updates correctly

**Expected Result:**
- Modal opens and displays correctly
- Quantity can be changed
- Cart updates with correct quantity

---

#### Test 1.4: Stock Limit Validation
- [ ] Open modal for "Charizard VMAX" (stock: 1)
- [ ] Try to set quantity to 5
- [ ] Click "Add to Cart"
- [ ] Verify error message: "Insufficient stock"

**Expected Result:** Error message appears, item not added beyond stock limit

---

### Test Suite 2: Cart Page (cart.html)

#### Test 2.1: View Cart
- [ ] After adding items, click "Cart" in navigation
- [ ] Verify cart page loads
- [ ] Check all added items are displayed
- [ ] Verify product images show
- [ ] Check product names and descriptions
- [ ] Verify prices are correct
- [ ] Check quantities match what was added

**Expected Result:** All cart items display correctly with accurate information

---

#### Test 2.2: Update Quantity - Increase
- [ ] Click "+" button on an item
- [ ] Verify quantity increases
- [ ] Check subtotal updates
- [ ] Verify total updates
- [ ] Check cart count in header updates

**Expected Result:** Quantity increases, all totals recalculate correctly

---

#### Test 2.3: Update Quantity - Decrease
- [ ] Click "-" button on an item with quantity > 1
- [ ] Verify quantity decreases
- [ ] Check subtotal updates
- [ ] Verify total updates

**Expected Result:** Quantity decreases, totals recalculate

---

#### Test 2.4: Remove Item - Via Decrease
- [ ] Find item with quantity = 1
- [ ] Click "-" button
- [ ] Verify confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Check item is removed from cart
- [ ] Verify totals update

**Expected Result:** Item removed after confirmation

---

#### Test 2.5: Remove Item - Via Remove Button
- [ ] Click "Remove" button on any item
- [ ] Verify success toast: "Item removed from cart"
- [ ] Check item disappears from cart
- [ ] Verify totals update
- [ ] Check cart count in header updates

**Expected Result:** Item removed immediately, UI updates

---

#### Test 2.6: Cart Calculations
- [ ] Add multiple items with different quantities
- [ ] Verify subtotal = sum of (price × quantity) for all items
- [ ] Check tax = subtotal × 0.18 (18% GST)
- [ ] Verify total = subtotal + tax
- [ ] All amounts should show 2 decimal places

**Expected Result:** All calculations are accurate

---

#### Test 2.7: Empty Cart
- [ ] Remove all items from cart
- [ ] Verify "Your cart is empty" message appears
- [ ] Check "Continue Shopping" link works
- [ ] Verify cart count shows "0"

**Expected Result:** Empty cart state displays correctly

---

### Test Suite 3: Edge Cases & Error Handling

#### Test 3.1: Multiple Same Items
- [ ] Add same product 3 times via quick add
- [ ] Go to cart
- [ ] Verify only ONE cart item exists with quantity = 3
- [ ] Not 3 separate items

**Expected Result:** Items consolidate into single cart entry

---

#### Test 3.2: Stock Validation in Cart
- [ ] Add "Charizard VMAX" (stock: 1) to cart
- [ ] Try to increase quantity beyond stock
- [ ] Verify "+" button is disabled when at max stock
- [ ] Check error message if trying to exceed stock

**Expected Result:** Cannot exceed available stock

---

#### Test 3.3: Mixed Product IDs
- [ ] Add product with ID "693968a3a30996a08473e62c"
- [ ] Add product with ID "69395e46a30996a08473e5e6"
- [ ] Go to cart
- [ ] Verify both products display correctly
- [ ] Update quantities on both
- [ ] Remove one item
- [ ] Verify other item remains

**Expected Result:** Different MongoDB IDs handled correctly

---

#### Test 3.4: Browser Console Check
- [ ] Open browser console (F12)
- [ ] Perform all cart operations
- [ ] Check for any JavaScript errors
- [ ] Verify no "undefined" or "null" errors
- [ ] Check network tab for API calls

**Expected Result:** No console errors, clean execution

---

#### Test 3.5: LocalStorage Persistence
- [ ] Add items to cart
- [ ] Refresh the page (F5)
- [ ] Verify cart items persist
- [ ] Check cart count remains correct
- [ ] Open cart page, verify items still there

**Expected Result:** Cart data persists across page refreshes

---

### Test Suite 4: Checkout Flow

#### Test 4.1: Proceed to Checkout
- [ ] Add items to cart
- [ ] Go to cart page
- [ ] Click "Proceed to Checkout"
- [ ] Verify redirects to checkout.html
- [ ] Check cart data is available on checkout page

**Expected Result:** Smooth transition to checkout

---

#### Test 4.2: Empty Cart Checkout Prevention
- [ ] Clear cart completely
- [ ] Try to click "Proceed to Checkout"
- [ ] Verify error message appears
- [ ] Check that checkout page doesn't load

**Expected Result:** Cannot proceed with empty cart

---

## Testing Summary Template

After completing all tests, fill out this summary:

### ✅ Passed Tests:
- [ ] Backend API returns products correctly
- [ ] Products display on store page
- [ ] Quick add to cart works
- [ ] Modal add to cart works
- [ ] Cart page displays items
- [ ] Quantity increase works
- [ ] Quantity decrease works
- [ ] Remove item works
- [ ] Cart calculations correct
- [ ] Empty cart state works
- [ ] Stock validation works
- [ ] Multiple same items consolidate
- [ ] Mixed product IDs work
- [ ] No console errors
- [ ] LocalStorage persistence works
- [ ] Checkout flow works

### ❌ Failed Tests:
(List any tests that failed with details)

### 🐛 Bugs Found:
(List any bugs discovered during testing)

### 📝 Notes:
(Any additional observations)

---

## Quick Test Commands

### Clear Cart (Browser Console)
```javascript
localStorage.removeItem('cart');
location.reload();
```

### View Cart Data (Browser Console)
```javascript
console.log(JSON.parse(localStorage.getItem('cart')));
```

### Check Product IDs (Browser Console)
```javascript
dataManager.getProducts().forEach(p => console.log(p.id, p._id));
```

### Verify Cart Operations (Browser Console)
```javascript
// Add item
dataManager.addToCart('693968a3a30996a08473e62c', 2);

// View cart
console.log(dataManager.getCart());

// Get cart total
console.log(dataManager.getCartTotal());
```

---

## Test Completion Date: _____________

## Tester Name: _____________

## Overall Status: ⬜ PASS / ⬜ FAIL
