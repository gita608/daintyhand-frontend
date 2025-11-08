# AI Prompt: Build Laravel + MySQL Backend for DaintyHand E-commerce

## Your Task
Build a complete Laravel 10+ REST API backend with MySQL database for the DaintyHand e-commerce platform. The frontend is a React/TypeScript application that needs to connect to this backend.

## Reference Document
See `BACKEND_SPECIFICATION.md` for complete details. This document contains:
- Complete database schema
- All API endpoints with request/response formats
- Validation rules
- Implementation requirements

## Quick Start Instructions

### 1. Create Laravel Project
```bash
composer create-project laravel/laravel daintyhand-backend
cd daintyhand-backend
composer require laravel/sanctum
```

### 2. Database Setup
- Create MySQL database: `daintyhand_db`
- Configure `.env` file with database credentials
- Run migrations (create all tables as specified in BACKEND_SPECIFICATION.md)

### 3. Required Tables
Create migrations for:
- products
- product_images
- product_features
- product_specifications
- cart_items
- wishlist_items
- custom_orders
- contact_messages
- users (Laravel default)

### 4. Required API Endpoints

**Products:**
- GET `/api/products` - List all products (with pagination, filtering, search)
- GET `/api/products/{id}` - Get single product
- GET `/api/categories` - Get all categories

**Cart:**
- GET `/api/cart` - Get cart items
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/{id}` - Update cart item quantity
- DELETE `/api/cart/{id}` - Remove item from cart

**Wishlist:**
- GET `/api/wishlist` - Get wishlist items
- POST `/api/wishlist` - Add item to wishlist
- DELETE `/api/wishlist/{id}` - Remove item from wishlist

**Custom Orders:**
- POST `/api/custom-orders` - Submit custom order request

**Contact:**
- POST `/api/contact` - Submit contact form

### 5. Key Requirements

1. **CORS:** Configure CORS to allow React frontend (localhost:5173, localhost:8080)
2. **Session Management:** Support guest users with session_id (header: X-Session-ID)
3. **Validation:** Use Laravel Form Requests for all POST/PUT requests
4. **Response Format:** All responses in JSON format:
   ```json
   {
     "success": true/false,
     "message": "Optional message",
     "data": { ... }
   }
   ```
5. **Error Handling:** Return consistent error format with appropriate HTTP status codes
6. **Database Seeding:** Create seeder with 12 products (data from BACKEND_SPECIFICATION.md)

### 6. Product Data to Seed
Seed these 12 products:
1. Floral Wedding Invitation Set - ₹10,000 - Invitations
2. Pressed Flower Art - ₹5,200 - Wall Art
3. Custom Baby Shower Cards - ₹3,600 - Invitations
4. Watercolor Bookmarks - ₹2,240 - Paper Crafts
5. Memory Scrapbook Album - ₹7,600 - Albums
6. Botanical Wall Hanging - ₹6,240 - Wall Art
7. Thank You Card Set - ₹2,560 - Cards
8. Custom Name Banner - ₹4,400 - Decorations
9. Vintage Journal - ₹3,360 - Journals
10. Gift Box Set - ₹3,040 - Gift Wrap
11. Celebration Garland - ₹3,840 - Decorations
12. Custom Portrait Frame - ₹5,440 - Frames

### 7. Validation Rules

**Custom Order:**
- name: required, string, min:2, max:255
- email: required, email
- phone: required, string, min:10
- product_type: required, in:invitations,wall-art,paper-crafts,albums,cards,decorations,journals,gift-wrap,frames,other
- quantity: required, string
- budget: required, in:under-5k,5k-10k,10k-25k,25k-50k,50k-plus,flexible
- event_date: nullable, date
- description: required, string, min:10
- additional_notes: nullable, string

**Contact Form:**
- name: required, string, min:2, max:255
- email: required, email
- subject: required, string, min:3, max:255
- message: required, string, min:10

### 8. Implementation Checklist

- [ ] Create all database migrations
- [ ] Create all Eloquent models with relationships
- [ ] Create all API controllers
- [ ] Create Form Request classes for validation
- [ ] Configure CORS
- [ ] Set up API routes
- [ ] Create database seeders
- [ ] Implement error handling
- [ ] Test all endpoints
- [ ] Document API responses

### 9. Important Notes

- Store prices as decimal in database (e.g., 10000.00)
- Support guest users with session_id for cart/wishlist
- Use eager loading for relationships
- Return consistent JSON response format
- Handle 404 errors for invalid product IDs
- Return validation errors in consistent format

### 10. Testing
After implementation, test:
- All GET endpoints return correct data
- POST endpoints validate input correctly
- Cart/Wishlist work for guest users (session_id)
- Error handling works properly
- Database relationships work correctly

---

## Deliverables
1. Complete Laravel project with all migrations
2. All models with relationships
3. All API controllers
4. Form Request validators
5. Database seeders
6. CORS configuration
7. API routes file
8. Working API endpoints that match the specification

---

**Reference the BACKEND_SPECIFICATION.md file for complete details on:**
- Exact database schema
- Request/response formats
- Field types and constraints
- Additional implementation details

**Start by reading BACKEND_SPECIFICATION.md completely, then build the backend step by step following Laravel best practices.**

