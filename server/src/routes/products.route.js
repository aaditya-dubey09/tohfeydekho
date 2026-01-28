import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getAllProducts,
  getProductById,
  toggleWishlist,
  getWishlist
} from '../controllers/products.controller.js';

const router = express.Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected Routes
router.get('/wishlist/me', protect, getWishlist);
router.post('/:id/wishlist', protect, toggleWishlist);

export default router;