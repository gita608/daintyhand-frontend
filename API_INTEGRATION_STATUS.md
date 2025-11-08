# API Integration Status

## ✅ Completed
- [x] API configuration (`src/lib/api.ts`)
- [x] API service functions (`src/services/api.ts`)
- [x] Login page - Connected to API
- [x] Register page - Connected to API
- [x] Profile page - Connected to API (getUser, updateProfile, changePassword, logout)
- [x] Cart page - Connected to API (getCart, updateCartItem, removeFromCart)

## 🔄 In Progress / Needs Update
- [ ] Wishlist page - Update to use API
- [ ] AllProducts page - Update to use API
- [ ] ProductDetail page - Update to use API
- [ ] OrderHistory page - Update to use API
- [ ] CustomOrder page - Update to use API
- [ ] ContactPage - Update to use API
- [ ] Products component (homepage) - Update to use API
- [ ] Header component - Update cart/wishlist counts

## 📝 Notes
- Base URL: `https://daintyhand-backend.test/api`
- Production URL: To be provided later
- All API calls use axios with interceptors for auth tokens and session IDs
- Guest users use `X-Session-ID` header
- Authenticated users use `Authorization: Bearer {token}` header

