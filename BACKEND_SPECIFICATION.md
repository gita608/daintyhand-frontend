# Backend API Specification for DaintyHand E-commerce Platform

## Quick Reference for AI Implementation

**Task:** Build Laravel 10+ REST API with MySQL for React e-commerce frontend.

**Key Points:**
- Use Laravel Sanctum for authentication (token-based)
- Support both guest users (session_id) and authenticated users (user_id)
- Merge guest cart when user registers/logs in
- All endpoints return JSON with consistent format
- CORS enabled for React frontend

**Required Endpoints:**
- Products: GET /api/products, GET /api/products/{id}, GET /api/categories
- Cart: GET/POST/PUT/DELETE /api/cart (works for guests and users)
- Wishlist: GET/POST/DELETE /api/wishlist (works for guests and users)
- Auth: POST /api/register, POST /api/login, POST /api/logout, GET /api/user, PUT /api/user/profile, POST /api/password/change
- Orders: POST /api/orders, GET /api/orders, GET /api/orders/{id}
- Custom Orders: POST /api/custom-orders
- Contact: POST /api/contact

**Database:** 12 tables (products, product_images, product_features, product_specifications, users, cart_items, wishlist_items, orders, order_items, custom_orders, contact_messages, categories)

**See full specification below for complete details.**

---

## Project Overview
Build a Laravel 10+ REST API backend with MySQL database for the DaintyHand e-commerce frontend (React/TypeScript). The backend should handle products, cart, wishlist, custom orders, contact form submissions, and user authentication.

---

## Technology Stack
- **Framework:** Laravel 10+ (or latest stable)
- **Database:** MySQL 8.0+
- **API:** RESTful JSON API
- **Authentication:** Laravel Sanctum (Token-based API authentication)
- **CORS:** Configured for React frontend
- **Validation:** Laravel Form Requests

## Authentication Strategy

**Hybrid Approach:**
- **Guest Users:** Can use cart/wishlist with `session_id` (no signup required)
- **Registered Users:** Can login/register for full account features
- **Cart Merging:** When guest user registers/logs in, merge their guest cart to their account
- **Both work:** Cart/wishlist work for both guests (session_id) and logged-in users (user_id)

---

## Database Schema

### 1. **products** table
```sql
- id (bigint, primary key, auto increment)
- title (string, 255, required)
- description (text, required)
- price (decimal 10,2, required) -- Store as decimal, frontend displays with ₹
- image (string, 500) -- URL to image
- category (string, 100, required) -- Enum: Invitations, Wall Art, Paper Crafts, Albums, Cards, Decorations, Journals, Gift Wrap, Frames
- rating (tinyint, default 0) -- 0-5
- reviews_count (integer, default 0)
- in_stock (boolean, default true)
- created_at (timestamp)
- updated_at (timestamp)
```

### 2. **product_images** table (for multiple images per product)
```sql
- id (bigint, primary key, auto increment)
- product_id (bigint, foreign key -> products.id, on delete cascade)
- image_url (string, 500, required)
- is_primary (boolean, default false)
- order (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### 3. **product_features** table
```sql
- id (bigint, primary key, auto increment)
- product_id (bigint, foreign key -> products.id, on delete cascade)
- feature (string, 255, required)
- created_at (timestamp)
- updated_at (timestamp)
```

### 4. **product_specifications** table
```sql
- id (bigint, primary key, auto increment)
- product_id (bigint, foreign key -> products.id, on delete cascade)
- key (string, 100, required) -- e.g., "Size", "Paper Weight"
- value (string, 255, required)
- created_at (timestamp)
- updated_at (timestamp)
```

### 5. **users** table (Laravel default + additions)
```sql
- id (bigint, primary key, auto increment)
- name (string, 255, required)
- email (string, 255, unique, required)
- email_verified_at (timestamp, nullable)
- password (string, 255, required)
- phone (string, 20, nullable)
- remember_token (string, 100, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 6. **cart_items** table
**Hybrid: Works for both guest (session_id) and logged-in users (user_id)**
```sql
- id (bigint, primary key, auto increment)
- user_id (bigint, foreign key -> users.id, nullable) -- For logged-in users
- session_id (string, 100, nullable) -- For guest users
- product_id (bigint, foreign key -> products.id, on delete cascade)
- quantity (integer, default 1, min 1)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY unique_user_product (user_id, product_id) -- When user_id is not null
- UNIQUE KEY unique_session_product (session_id, product_id) -- When session_id is not null
- CHECK: Either user_id OR session_id must be present (not both null)
```

### 7. **wishlist_items** table
**Hybrid: Works for both guest (session_id) and logged-in users (user_id)**
```sql
- id (bigint, primary key, auto increment)
- user_id (bigint, foreign key -> users.id, nullable) -- For logged-in users
- session_id (string, 100, nullable) -- For guest users
- product_id (bigint, foreign key -> products.id, on delete cascade)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY unique_user_product (user_id, product_id) -- When user_id is not null
- UNIQUE KEY unique_session_product (session_id, product_id) -- When session_id is not null
- CHECK: Either user_id OR session_id must be present (not both null)
```

### 8. **custom_orders** table
```sql
- id (bigint, primary key, auto increment)
- name (string, 255, required)
- email (string, 255, required)
- phone (string, 20, required)
- product_type (string, 100, required)
- quantity (string, 50, required) -- Store as string as frontend sends string
- budget (string, 50, required)
- event_date (date, nullable)
- description (text, required)
- additional_notes (text, nullable)
- status (enum: 'pending', 'in_progress', 'completed', 'cancelled', default 'pending')
- created_at (timestamp)
- updated_at (timestamp)
```

### 9. **contact_messages** table
```sql
- id (bigint, primary key, auto increment)
- name (string, 255, required)
- email (string, 255, required)
- subject (string, 255, required)
- message (text, required)
- is_read (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)
```

### 10. **orders** table
```sql
- id (bigint, primary key, auto increment)
- user_id (bigint, foreign key -> users.id, on delete cascade)
- order_number (string, 50, unique, required) -- e.g., "ORD-2024-001234"
- total (decimal 10,2, required)
- subtotal (decimal 10,2, required)
- tax (decimal 10,2, default 0)
- shipping (decimal 10,2, default 0)
- status (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled', default 'pending')
- payment_status (enum: 'pending', 'paid', 'failed', 'refunded', default 'pending')
- payment_method (string, 50, nullable) -- e.g., 'cod', 'online', 'card'
- shipping_name (string, 255, required)
- shipping_address (text, required)
- shipping_city (string, 100, required)
- shipping_state (string, 100, required)
- shipping_pincode (string, 10, required)
- shipping_phone (string, 20, required)
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 11. **order_items** table
```sql
- id (bigint, primary key, auto increment)
- order_id (bigint, foreign key -> orders.id, on delete cascade)
- product_id (bigint, foreign key -> products.id)
- title (string, 255, required) -- Store product title at time of order
- price (decimal 10,2, required) -- Store price at time of order
- quantity (integer, default 1, min 1)
- image (string, 500, nullable) -- Store product image at time of order
- created_at (timestamp)
- updated_at (timestamp)
```

### 12. **categories** table (optional, for better category management)
```sql
- id (bigint, primary key, auto increment)
- name (string, 100, unique, required)
- slug (string, 100, unique, required)
- description (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## API Endpoints Specification

### Base URL
```
http://localhost:8000/api
```
(Or your production domain)

### Response Format
All responses should be JSON:
```json
{
  "success": true/false,
  "message": "Optional message",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## 1. PRODUCTS API

### GET /api/products
**Description:** Get all products with optional filtering

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in title/description
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 12)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Floral Wedding Invitation Set",
        "description": "Complete wedding suite with RSVP cards",
        "price": "10000.00",
        "image": "https://images.unsplash.com/...",
        "category": "Invitations",
        "rating": 5,
        "reviews_count": 24,
        "in_stock": true,
        "images": [
          "https://images.unsplash.com/...",
          "https://images.unsplash.com/..."
        ],
        "features": [
          "Premium 300gsm cardstock",
          "Hand-painted watercolor florals"
        ],
        "specifications": {
          "Size": "5\" x 7\"",
          "Paper Weight": "300gsm"
        }
      }
    ],
    "total": 12,
    "per_page": 12,
    "last_page": 1
  }
}
```

### GET /api/products/{id}
**Description:** Get single product details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Floral Wedding Invitation Set",
    "description": "Complete wedding suite with RSVP cards",
    "price": "10000.00",
    "image": "https://images.unsplash.com/...",
    "category": "Invitations",
    "rating": 5,
    "reviews_count": 24,
    "in_stock": true,
    "images": [
      "https://images.unsplash.com/...",
      "https://images.unsplash.com/..."
    ],
    "features": [
      "Premium 300gsm cardstock",
      "Hand-painted watercolor florals"
    ],
    "specifications": {
      "Size": "5\" x 7\"",
      "Paper Weight": "300gsm",
      "Finish": "Matte"
    }
  }
}
```

### GET /api/categories
**Description:** Get all categories

**Response:**
```json
{
  "success": true,
  "data": [
    "All",
    "Invitations",
    "Wall Art",
    "Paper Crafts",
    "Albums",
    "Cards",
    "Decorations",
    "Journals",
    "Gift Wrap",
    "Frames"
  ]
}
```

---

## 2. CART API

### GET /api/cart
**Description:** Get user's cart items
**Authentication:** Optional - Uses Bearer token if logged in, or X-Session-ID for guests

**Headers:**
- `Authorization: Bearer {token}` (optional): For logged-in users
- `X-Session-ID` (optional): For guest users (if not authenticated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "product_id": 1,
      "title": "Floral Wedding Invitation Set",
      "price": "10000.00",
      "image": "https://images.unsplash.com/...",
      "description": "Complete wedding suite with RSVP cards",
      "quantity": 2
    }
  ]
}
```

### POST /api/cart
**Description:** Add item to cart

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": "uuid-string",
    "product_id": 1,
    "quantity": 2
  }
}
```

### PUT /api/cart/{id}
**Description:** Update cart item quantity

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "id": "uuid-string",
    "quantity": 3
  }
}
```

### DELETE /api/cart/{id}
**Description:** Remove item from cart

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

## 3. WISHLIST API

### GET /api/wishlist
**Description:** Get user's wishlist items
**Authentication:** Optional - Uses Bearer token if logged in, or X-Session-ID for guests

**Headers:**
- `Authorization: Bearer {token}` (optional): For logged-in users
- `X-Session-ID` (optional): For guest users (if not authenticated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "product_id": 1,
      "title": "Floral Wedding Invitation Set",
      "price": "10000.00",
      "image": "https://images.unsplash.com/...",
      "description": "Complete wedding suite with RSVP cards"
    }
  ]
}
```

### POST /api/wishlist
**Description:** Add item to wishlist

**Request Body:**
```json
{
  "product_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to wishlist",
  "data": {
    "id": "uuid-string",
    "product_id": 1
  }
}
```

### DELETE /api/wishlist/{id}
**Description:** Remove item from wishlist

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

---

## 4. CUSTOM ORDERS API

### POST /api/custom-orders
**Description:** Submit custom order request

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "product_type": "invitations",
  "quantity": "50",
  "budget": "10k-25k",
  "event_date": "2024-12-25",
  "description": "I need custom wedding invitations...",
  "additional_notes": "Please include gold foil"
}
```

**Validation Rules:**
- name: required, string, min:2, max:255
- email: required, email, max:255
- phone: required, string, min:10
- product_type: required, string, in:invitations,wall-art,paper-crafts,albums,cards,decorations,journals,gift-wrap,frames,other
- quantity: required, string
- budget: required, string, in:under-5k,5k-10k,10k-25k,25k-50k,50k-plus,flexible
- event_date: nullable, date, after:today
- description: required, string, min:10
- additional_notes: nullable, string

**Response:**
```json
{
  "success": true,
  "message": "Custom order submitted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

---

## 5. CONTACT API

### POST /api/contact
**Description:** Submit contact form

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Inquiry about custom orders",
  "message": "I would like to know more about..."
}
```

**Validation Rules:**
- name: required, string, min:2, max:255
- email: required, email, max:255
- subject: required, string, min:3, max:255
- message: required, string, min:10

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

---

## 6. AUTHENTICATION API

### POST /api/register
**Description:** Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+91 98765 43210"
}
```

**Validation Rules:**
- name: required, string, min:2, max:255
- email: required, email, unique:users
- password: required, string, min:8, confirmed
- phone: nullable, string, min:10

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210"
    },
    "token": "1|abcdef123456...",
    "cart_merged": true  // If guest cart was merged
  }
}
```

**Cart Merging Logic:**
- When user registers, check if they have guest cart (by session_id)
- If yes, merge guest cart items to user's account
- Update cart_items: set user_id, clear session_id
- Return `cart_merged: true` in response

### POST /api/login
**Description:** Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- email: required, email
- password: required, string

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210"
    },
    "token": "1|abcdef123456...",
    "cart_merged": true  // If guest cart was merged
  }
}
```

**Cart Merging Logic:**
- Same as register - merge guest cart when user logs in

### POST /api/logout
**Description:** Logout user (revoke token)
**Authentication:** Required

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/user
**Description:** Get authenticated user profile
**Authentication:** Required

**Headers:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 98765 43210",
    "email_verified_at": "2024-01-15T10:30:00.000000Z",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

### PUT /api/user/profile
**Description:** Update user profile
**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+91 98765 43211"
}
```

**Validation Rules:**
- name: required, string, min:2, max:255
- phone: nullable, string, min:10
- email: cannot be changed via this endpoint

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+91 98765 43211"
  }
}
```

### POST /api/password/change
**Description:** Change user password
**Authentication:** Required

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Validation Rules:**
- current_password: required, must match user's current password
- password: required, string, min:8, confirmed

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 7. ORDERS API

### POST /api/orders
**Description:** Create order from cart
**Authentication:** Required

**Request Body:**
```json
{
  "shipping_name": "John Doe",
  "shipping_address": "123 Main Street",
  "shipping_city": "Mumbai",
  "shipping_state": "Maharashtra",
  "shipping_pincode": "400001",
  "shipping_phone": "+91 98765 43210",
  "payment_method": "cod",
  "notes": "Please deliver before 5 PM"
}
```

**Validation Rules:**
- shipping_name: required, string, min:2, max:255
- shipping_address: required, string, min:5
- shipping_city: required, string, min:2, max:100
- shipping_state: required, string, min:2, max:100
- shipping_pincode: required, string, min:6, max:10
- shipping_phone: required, string, min:10
- payment_method: required, string, in:cod,online,card
- notes: nullable, string

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-2024-001234",
    "total": "25000.00",
    "status": "pending",
    "payment_status": "pending",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

**Logic:**
- Get all cart items for authenticated user
- Calculate total from cart items
- Create order with shipping details
- Create order_items from cart items
- Clear user's cart after order creation
- Generate unique order_number (format: ORD-YYYY-NNNNNN)

### GET /api/orders
**Description:** Get user's order history
**Authentication:** Required

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number for pagination
- `per_page` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "order_number": "ORD-2024-001234",
        "total": "25000.00",
        "status": "processing",
        "payment_status": "paid",
        "items": [
          {
            "id": 1,
            "product_id": 1,
            "title": "Floral Wedding Invitation Set",
            "price": "10000.00",
            "quantity": 2,
            "image": "https://images.unsplash.com/..."
          }
        ],
        "shipping_address": {
          "name": "John Doe",
          "address": "123 Main Street",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001",
          "phone": "+91 98765 43210"
        },
        "created_at": "2024-01-15T10:30:00.000000Z"
      }
    ],
    "total": 5,
    "per_page": 10,
    "last_page": 1
  }
}
```

### GET /api/orders/{id}
**Description:** Get single order details
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_number": "ORD-2024-001234",
    "total": "25000.00",
    "subtotal": "20000.00",
    "tax": "3600.00",
    "shipping": "1400.00",
    "status": "processing",
    "payment_status": "paid",
    "payment_method": "cod",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "title": "Floral Wedding Invitation Set",
        "price": "10000.00",
        "quantity": 2,
        "image": "https://images.unsplash.com/..."
      }
    ],
    "shipping_address": {
      "name": "John Doe",
      "address": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "+91 98765 43210"
    },
    "notes": "Please deliver before 5 PM",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z"
  }
}
```

**Note:** User can only view their own orders. Return 404 if order doesn't exist or doesn't belong to user.

---

## Implementation Requirements

### 1. CORS Configuration
Configure CORS to allow requests from React frontend:
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173', 'http://localhost:8080'], // Add your frontend URLs
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['Content-Type', 'Authorization', 'X-Session-ID'],
'supports_credentials' => true,
```

### 2. Authentication with Laravel Sanctum
- Install and configure Laravel Sanctum
- Users get token on login/register
- Token stored in frontend (localStorage)
- Send token in `Authorization: Bearer {token}` header
- Protected routes use `auth:sanctum` middleware

### 3. Session Management for Guests
- **Guest users can shop without authentication**
- Frontend generates session_id (UUID) and stores in localStorage
- Frontend sends `X-Session-ID` header for guest cart/wishlist
- Backend uses session_id to identify guest users
- When guest registers/logs in, merge their cart to account

### 4. Cart Merging Logic
When user registers or logs in:
1. Check if request has `X-Session-ID` header
2. Find all cart_items with that session_id
3. Update them: set user_id = authenticated user's id, clear session_id
4. Handle duplicates (if user already has same product, merge quantities)
5. Do the same for wishlist_items
6. Return `cart_merged: true` in response

### 5. Price Formatting
- Store prices as decimal in database (e.g., 10000.00)
- Frontend will format as ₹10,000
- API returns price as string or decimal

### 6. Image Handling
- For now, store image URLs (frontend uses Unsplash)
- Later: Add file upload capability for product images

### 7. Validation
- Use Laravel Form Requests for validation
- Return validation errors in consistent format
- Validate all required fields

### 8. Error Handling
- Use try-catch blocks
- Return consistent error format
- Log errors for debugging
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)

### 9. Database Seeding
Create seeder to populate initial products:
- Seed all 12 products from frontend data
- Add sample images, features, specifications
- Use the exact data from `src/data/products.ts`

---

## Laravel Setup Instructions

### 1. Create Laravel Project
```bash
composer create-project laravel/laravel daintyhand-backend
cd daintyhand-backend
```

### 2. Database Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=daintyhand_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Install Required Packages
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 4. Create Migrations
```bash
php artisan make:migration create_products_table
php artisan make:migration create_product_images_table
php artisan make:migration create_product_features_table
php artisan make:migration create_product_specifications_table
php artisan make:migration create_cart_items_table
php artisan make:migration create_wishlist_items_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_custom_orders_table
php artisan make:migration create_contact_messages_table
```

### 5. Create Models
```bash
php artisan make:model Product
php artisan make:model ProductImage
php artisan make:model ProductFeature
php artisan make:model ProductSpecification
php artisan make:model CartItem
php artisan make:model WishlistItem
php artisan make:model Order
php artisan make:model OrderItem
php artisan make:model CustomOrder
php artisan make:model ContactMessage
```

### 6. Create Controllers
```bash
php artisan make:controller Api/ProductController
php artisan make:controller Api/CartController
php artisan make:controller Api/WishlistController
php artisan make:controller Api/OrderController
php artisan make:controller Api/CustomOrderController
php artisan make:controller Api/ContactController
php artisan make:controller Api/AuthController
php artisan make:controller Api/UserController
```

### 7. Create Form Requests (Validation)
```bash
php artisan make:request StoreCustomOrderRequest
php artisan make:request StoreContactRequest
php artisan make:request StoreCartItemRequest
php artisan make:request UpdateCartItemRequest
php artisan make:request StoreOrderRequest
php artisan make:request RegisterRequest
php artisan make:request LoginRequest
php artisan make:request UpdateProfileRequest
php artisan make:request ChangePasswordRequest
```

### 8. API Routes
Create `routes/api.php`:
```php
Route::prefix('api')->group(function () {
    // Public Routes
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/categories', [ProductController::class, 'categories']);
    
    // Authentication
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // Custom Orders (public)
    Route::post('/custom-orders', [CustomOrderController::class, 'store']);
    
    // Contact (public)
    Route::post('/contact', [ContactController::class, 'store']);
    
    // Guest Routes (work with session_id)
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
    
    // Protected Routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [UserController::class, 'show']);
        Route::put('/user/profile', [UserController::class, 'updateProfile']);
        Route::post('/password/change', [UserController::class, 'changePassword']);
        
        // Orders
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
    });
});
```

---

## Testing Requirements

### Test Cases to Implement:
1. ✅ Get all products
2. ✅ Get product by ID
3. ✅ Filter products by category
4. ✅ Search products
5. ✅ Add item to cart
6. ✅ Update cart item quantity
7. ✅ Remove item from cart
8. ✅ Get cart items
9. ✅ Add item to wishlist
10. ✅ Remove item from wishlist
11. ✅ Get wishlist items
12. ✅ Submit custom order (with validation)
13. ✅ Submit contact form (with validation)
14. ✅ Handle invalid product ID (404)
15. ✅ Handle validation errors (400)

---

## Frontend Integration Notes

The React frontend currently uses:
- `localStorage` for cart/wishlist
- Static product data from `src/data/products.ts`

**After backend is ready:**
1. Replace localStorage calls with API calls
2. Use `fetch` or `axios` for HTTP requests
3. Handle session_id for guest users
4. Update product data fetching to use API
5. Add loading states and error handling

**Example Frontend API Call:**
```typescript
// Replace localStorage with API
const addToCart = async (productId: number, quantity: number) => {
  const response = await fetch('http://localhost:8000/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': getSessionId(), // For guests
    },
    body: JSON.stringify({ product_id: productId, quantity })
  });
  const data = await response.json();
  return data;
};
```

---

## Additional Features (Optional for Future)

1. **Product Reviews**
   - Add review endpoint
   - Get product reviews

2. **Order Management**
   - Create orders from cart
   - Order history
   - Order status tracking

3. **Admin Panel**
   - Manage products
   - View custom orders
   - View contact messages
   - Manage categories

4. **Image Upload**
   - Upload product images
   - Image storage (local/S3)

5. **Email Notifications**
   - Send email on custom order submission
   - Send email on contact form submission
   - Email verification on registration
   - Password reset emails

---

## Deliverables Checklist

- [ ] Database migrations created and run
- [ ] Models with relationships defined
- [ ] All API endpoints implemented
- [ ] Validation rules applied
- [ ] CORS configured
- [ ] Error handling implemented
- [ ] Database seeded with initial products
- [ ] API documentation (can use Laravel API documentation tools)
- [ ] Basic tests written
- [ ] Response format consistent across all endpoints

---

## Notes for AI Implementation

1. **Follow Laravel Best Practices:**
   - Use Eloquent relationships
   - Use Form Requests for validation
   - Use Resource classes for API responses (optional but recommended)
   - Follow PSR-12 coding standards

2. **Security:**
   - Sanitize all inputs
   - Use prepared statements (Laravel does this automatically)
   - Validate file uploads if adding image upload later
   - Rate limiting for API endpoints

3. **Performance:**
   - Use eager loading for relationships
   - Add indexes on foreign keys
   - Consider caching for frequently accessed data

4. **Code Organization:**
   - Keep controllers thin
   - Move business logic to services/repositories
   - Use traits for reusable code

---

**This specification should be sufficient for an AI to build the complete Laravel backend. All endpoints, data structures, and requirements are clearly defined.**

