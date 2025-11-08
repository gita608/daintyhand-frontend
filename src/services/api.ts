import api from '@/lib/api';
import { getSessionId } from '@/lib/api';

// Products
export const getProducts = async (params?: {
  category?: string;
  search?: string;
  per_page?: number;
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
  // Ensure session_id is set for guests (interceptor will add it to headers)
  getSessionId();
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  // Ensure session_id is set for guests
  getSessionId();
  const response = await api.post('/cart', {
    product_id: productId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (id: number, quantity: number) => {
  getSessionId();
  const response = await api.put(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeFromCart = async (id: number) => {
  getSessionId();
  const response = await api.delete(`/cart/${id}`);
  return response.data;
};

// Wishlist
export const getWishlist = async () => {
  getSessionId();
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (productId: number) => {
  getSessionId();
  const response = await api.post('/wishlist', {
    product_id: productId,
  });
  return response.data;
};

export const removeFromWishlist = async (id: number) => {
  getSessionId();
  const response = await api.delete(`/wishlist/${id}`);
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
  // Ensure session_id is set for cart merging (interceptor will add it)
  getSessionId();
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
  // Ensure session_id is set for cart merging (interceptor will add it)
  getSessionId();
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
  if (response.data.success) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
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

// Custom Orders
export const submitCustomOrder = async (data: {
  name: string;
  email: string;
  phone: string;
  product_type: string;
  quantity: string;
  budget: string;
  event_date?: string;
  description: string;
  additional_notes?: string;
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

