# Website Enhancement Implementation Plan

## Changes Requested

### 1. Enhanced Product Detail Page ✅
**Current Issue:** Modal view is basic, wishlist icon non-functional
**Solution:**
- Create dedicated `product-detail.html` page
- Larger product image with zoom capability
- Better UI layout
- Functional wishlist button
- Related products section
- Breadcrumb navigation

### 2. Contact Information Footer ✅
**Pages to Update:**
- index.html
- cart.html
- checkout.html

**Contact Details:**
- Instagram: froakietcg._
- Email: froakietcg0910@gmail.com
- Contact: +91 7200092054

### 3. Dark Mode Text Brightness Fix ✅
**Issue:** Text too bright in dark mode on cart/checkout pages
**Solution:** Adjust CSS variables for better contrast and readability

### 4. Product Catalog System ✅ (LARGEST TASK)
**Categories:**
1. Single Cards
2. Sealed Bundles
3. Sealed Booster Boxes
4. Special Collection Boxes

**Features Needed:**
- Category navigation in header
- Filter products by category
- Admin dropdown for product category selection
- Random product display on homepage
- Category-specific pages/sections
- Update backend schema to include category field

---

## Implementation Order

### Phase 1: Quick Fixes (30 min)
1. Add contact footer to pages
2. Fix dark mode text brightness

### Phase 2: Product Detail Page (1 hour)
1. Create product-detail.html
2. Add CSS styling
3. Implement wishlist functionality
4. Add navigation from product cards

### Phase 3: Catalog System (2-3 hours)
1. Update backend schema (add category field)
2. Update admin panel (category dropdown)
3. Create category navigation
4. Implement category filtering
5. Add random product display for homepage
6. Update all related JavaScript files

---

## Files to Modify

### New Files:
- product-detail.html
- product-detail.css (or add to style.css)

### Modified Files:
- index.html (contact footer, category nav, random products)
- cart.html (contact footer, dark mode fix)
- checkout.html (contact footer, dark mode fix)
- admin.html (category dropdown)
- css/style.css or style-enhanced.css (dark mode fixes, new styles)
- js/store.js (category filtering, random display)
- js/admin.js (category field handling)
- js/data.js (category support)
- Backend: server.js (category field in schema)

---

## Testing Checklist

- [ ] Product detail page opens correctly
- [ ] Wishlist works on detail page
- [ ] Contact footer displays on all pages
- [ ] Dark mode text is readable
- [ ] Category navigation works
- [ ] Products filter by category
- [ ] Admin can assign categories
- [ ] Homepage shows random products
- [ ] All existing features still work
