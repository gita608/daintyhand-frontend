# Frontend Integration Guide - Connecting React to Laravel Backend

## Overview
This guide shows how to replace localStorage with API calls in the React frontend to connect to the Laravel backend.

---

## Setup

### 1. Install Axios (Recommended)
```bash
npm install axios
```

### 2. Create API Configuration File
Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token and session ID interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const sessionId = localStorage.getItem('session_id');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else if (sessionId) {
    config.headers['X-Session-ID'] = sessionId;
  }
  
  return config;
});

// Generate session ID for guest users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default api;
```

### 3. Add Environment Variable
Create `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

---

## API Service Functions

Create `src/services/api.ts`:

```typescript
import api from '@/lib/api';
import { getSessionId } from '@/lib/api';

// Products
export const getProducts = async (params?: {
  category?: string;
  search?: string;
  page?: number;
}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await api.post('/cart', {
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (id: string, quantity: number) => {
  const response = await api.put(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeFromCart = async (id: string) => {
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

// Wishlist
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: number) => {
  const response = await api.post('/wishlist', {
    product_id: productId,
  });
  return response.data;
};

export const removeFromWishlist = async (id: string) => {
  const response = await api.delete(`/wishlist/${id}`);
  return response.data;
};

// Custom Orders
export const submitCustomOrder = async (data: {
  name: string;
  email: string;
  phone: string;
  productType: string;
  quantity: string;
  budget: string;
  eventDate?: string;
  description: string;
  additionalNotes?: string;
}) => {
  const response = await api.post('/custom-orders', data);
  return response.data;
};

// Contact
export const submitContact = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Authentication
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}) => {
  const response = await api.post('/register', data);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post('/login', data);
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const updateProfile = async (data: {
  name: string;
  phone?: string;
}) => {
  const response = await api.put('/user/profile', data);
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const changePassword = async (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await api.post('/password/change', data);
  return response.data;
};

// Orders
export const createOrder = async (data: {
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_phone: string;
  payment_method: 'cod' | 'online' | 'card';
  notes?: string;
}) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const getOrders = async (params?: {
  status?: string;
  page?: number;
  per_page?: number;
}) => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id: number) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};
```

---

## Update Components

### 1. Update ProductDetail.tsx

**Replace:**
```typescript
// OLD: localStorage
const handleAddToCart = () => {
  const saved = localStorage.getItem('cart');
  // ...
};
```

**With:**
```typescript
import { addToCart as addToCartAPI } from '@/services/api';

const handleAddToCart = async () => {
  try {
    const response = await addToCartAPI(product.id, quantity);
    if (response.success) {
      toast({
        title: "Added to Cart",
        description: response.message || `${product.title} has been added to your cart`,
      });
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to add to cart",
      variant: "destructive",
    });
  }
};
```

### 2. Update Cart.tsx

**Replace:**
```typescript
// OLD
useEffect(() => {
  const saved = localStorage.getItem('cart');
  const items = saved ? JSON.parse(saved) : [];
  setCartItems(items);
}, []);
```

**With:**
```typescript
import { getCart, updateCartItem, removeFromCart } from '@/services/api';

useEffect(() => {
  fetchCart();
}, []);

const fetchCart = async () => {
  try {
    setLoading(true);
    const response = await getCart();
    if (response.success) {
      setCartItems(response.data);
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
  } finally {
    setLoading(false);
  }
};

const updateQuantity = async (id: string, newQuantity: number) => {
  if (newQuantity < 1) return;
  
  try {
    const response = await updateCartItem(id, newQuantity);
    if (response.success) {
      await fetchCart(); // Refresh cart
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to update quantity",
      variant: "destructive",
    });
  }
};

const removeFromCartHandler = async (id: string) => {
  try {
    const response = await removeFromCart(id);
    if (response.success) {
      await fetchCart(); // Refresh cart
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to remove item",
      variant: "destructive",
    });
  }
};
```

### 3. Update Wishlist.tsx

**Similar changes as Cart.tsx:**
```typescript
import { getWishlist, removeFromWishlist } from '@/services/api';

const fetchWishlist = async () => {
  try {
    setLoading(true);
    const response = await getWishlist();
    if (response.success) {
      setWishlistItems(response.data);
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  } finally {
    setLoading(false);
  }
};
```

### 4. Update AllProducts.tsx

**Replace product data fetching:**
```typescript
// OLD
import { products as allProducts, categories } from "@/data/products";

// NEW
import { getProducts, getCategories } from '@/services/api';
import { useState, useEffect } from 'react';

const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);

useEffect(() => {
  fetchProducts();
  fetchCategories();
}, []);

const fetchProducts = async () => {
  try {
    const response = await getProducts({
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      search: searchQuery || undefined,
    });
    if (response.success) {
      setProducts(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await getCategories();
    if (response.success) {
      setCategories(response.data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};
```

### 5. Update CustomOrder.tsx

**Replace form submission:**
```typescript
import { submitCustomOrder } from '@/services/api';

const onSubmit = async (data: FormValues) => {
  try {
    const response = await submitCustomOrder({
      name: data.name,
      email: data.email,
      phone: data.phone,
      productType: data.productType,
      quantity: data.quantity,
      budget: data.budget,
      eventDate: data.eventDate || undefined,
      description: data.description,
      additionalNotes: data.additionalNotes || undefined,
    });

    if (response.success) {
      toast({
        title: "Order Submitted Successfully!",
        description: response.message || "We've received your custom order request.",
      });
      form.reset();
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to submit order",
      variant: "destructive",
    });
  }
};
```

### 6. Update ContactPage.tsx

**Similar to CustomOrder:**
```typescript
import { submitContact } from '@/services/api';

const onSubmit = async (data: FormValues) => {
  try {
    const response = await submitContact(data);
    if (response.success) {
      toast({
        title: "Message Sent!",
        description: response.message || "Thank you for reaching out!",
      });
      form.reset();
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to send message",
      variant: "destructive",
    });
  }
};
```

---

## Error Handling

Create `src/lib/errorHandler.ts`:

```typescript
import { AxiosError } from 'axios';

export const handleApiError = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error
    const data = error.response.data as any;
    if (data.message) {
      return data.message;
    }
    if (data.errors) {
      // Validation errors
      const firstError = Object.values(data.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : String(firstError);
    }
    return 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'No response from server. Please check your connection.';
  } else {
    // Error setting up request
    return error.message || 'An unexpected error occurred';
  }
};
```

---

## Loading States

Add loading states to components:

```typescript
const [loading, setLoading] = useState(false);

// In component
{loading ? (
  <div className="text-center py-12">
    <p className="text-muted-foreground">Loading...</p>
  </div>
) : (
  // Your content
)}
```

---

## Migration Checklist

- [ ] Install axios
- [ ] Create API configuration file
- [ ] Create API service functions
- [ ] Update ProductDetail.tsx
- [ ] Update Cart.tsx
- [ ] Update Wishlist.tsx
- [ ] Update AllProducts.tsx
- [ ] Update CustomOrder.tsx
- [ ] Update ContactPage.tsx
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test all API integrations
- [ ] Remove localStorage code (or keep as fallback)
- [ ] Update environment variables

---

## Testing

After integration, test:
1. Products load from API
2. Add to cart works
3. Update cart quantity works
4. Remove from cart works
5. Add to wishlist works
6. Remove from wishlist works
7. Custom order submission works
8. Contact form submission works
9. Error handling works
10. Loading states display correctly

---

## Notes

- Keep localStorage as fallback during development
- Handle network errors gracefully
- Show user-friendly error messages
- Consider adding retry logic for failed requests
- Add request cancellation for better UX

