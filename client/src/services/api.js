import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: process.env.BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Callers handle 401s to avoid full-page reload loops from repeated /auth/me checks
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data),
    deleteAccount: () => api.delete('/auth/me')
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    toggleWishlist: (id) => api.post(`/products/${id}/wishlist`),
    getWishlist: () => api.get('/products/wishlist/me')
};

// Cart API
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId) => api.post(`/cart/${productId}`),
    removeFromCart: (productId) => api.delete(`/cart/${productId}`),
    clearCart: () => api.delete('/cart')
};

// Quiz API
export const quizAPI = {
    submit: (data) => api.post('/quiz/submit', data),
    getHistory: () => api.get('/quiz/history')
};

// Payments API
export const paymentsAPI = {
    createOrder: (payload) => api.post('/payments/create-order', payload),
    verify: (payload) => api.post('/payments/verify', payload)
};

// Admin API
export const adminAPI = {
    // Product Management
    createProduct: (data, config) => api.post('/admin/products', data, config),
    updateProduct: (id, data, config) => api.put(`/admin/products/${id}`, data, config),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    deleteProductImage: (id, publicId) => api.delete(`/admin/products/${id}/image/${publicId}`),

    // Analytics & Data
    getAnalytics: () => api.get('/admin/analytics'),
    getAllConsultations: () => api.get('/admin/consultations')
};

export default api;
