# Backend API Specification for DaintyHand E-commerce Platform

## Project Overview
Build a Laravel 10+ REST API backend with MySQL database for the DaintyHand e-commerce frontend (React/TypeScript). The backend should handle products, cart, wishlist, custom orders, and contact form submissions.

---

## Technology Stack
- **Framework:** Laravel 10+ (or latest stable)
- **Database:** MySQL 8.0+
- **API:** RESTful JSON API
- **Authentication:** Laravel Sanctum (for future user authentication)
- **CORS:** Configured for React frontend
- **Validation:** Laravel Form Requests

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
- name (string, 255)
- email (string, 255, unique)
- email_verified_at (timestamp, nullable)
- password (string, 255)
- phone (string, 20, nullable)
- remember_token (string, 100, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### 6. **cart_items** table
```sql
- id (bigint, primary key, auto increment)
- user_id (bigint, foreign key -> users.id, nullable) -- For logged-in users
- session_id (string, 100, nullable) -- For guest users
- product_id (bigint, foreign key -> products.id, on delete cascade)
- quantity (integer, default 1, min 1)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY (user_id, product_id) or (session_id, product_id)
```

### 7. **wishlist_items** table
```sql
- id (bigint, primary key, auto increment)
- user_id (bigint, foreign key -> users.id, nullable)
- session_id (string, 100, nullable)
- product_id (bigint, foreign key -> products.id, on delete cascade)
- created_at (timestamp)
- updated_at (timestamp)
- UNIQUE KEY (user_id, product_id) or (session_id, product_id)
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

### 10. **categories** table (optional, for better category management)
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
**Authentication:** Optional (use session_id for guests)

**Headers:**
- `X-Session-ID` (optional): For guest users

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

### 2. Session Management for Guests
- Generate unique session_id for guest users
- Store in cookie or return in response for frontend to store
- Use session_id to track cart/wishlist for non-authenticated users

### 3. Price Formatting
- Store prices as decimal in database (e.g., 10000.00)
- Frontend will format as ₹10,000
- API returns price as string or decimal

### 4. Image Handling
- For now, store image URLs (frontend uses Unsplash)
- Later: Add file upload capability for product images

### 5. Validation
- Use Laravel Form Requests for validation
- Return validation errors in consistent format
- Validate all required fields

### 6. Error Handling
- Use try-catch blocks
- Return consistent error format
- Log errors for debugging
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)

### 7. Database Seeding
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
php artisan make:model CustomOrder
php artisan make:model ContactMessage
```

### 6. Create Controllers
```bash
php artisan make:controller Api/ProductController
php artisan make:controller Api/CartController
php artisan make:controller Api/WishlistController
php artisan make:controller Api/CustomOrderController
php artisan make:controller Api/ContactController
```

### 7. Create Form Requests (Validation)
```bash
php artisan make:request StoreCustomOrderRequest
php artisan make:request StoreContactRequest
php artisan make:request StoreCartItemRequest
php artisan make:request UpdateCartItemRequest
```

### 8. API Routes
Create `routes/api.php`:
```php
Route::prefix('api')->group(function () {
    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/categories', [ProductController::class, 'categories']);
    
    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    
    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);
    
    // Custom Orders
    Route::post('/custom-orders', [CustomOrderController::class, 'store']);
    
    // Contact
    Route::post('/contact', [ContactController::class, 'store']);
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

1. **User Authentication**
   - Register/Login endpoints
   - Password reset
   - Email verification

2. **Product Reviews**
   - Add review endpoint
   - Get product reviews

3. **Order Management**
   - Create orders from cart
   - Order history
   - Order status tracking

4. **Admin Panel**
   - Manage products
   - View custom orders
   - View contact messages
   - Manage categories

5. **Image Upload**
   - Upload product images
   - Image storage (local/S3)

6. **Email Notifications**
   - Send email on custom order submission
   - Send email on contact form submission

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

