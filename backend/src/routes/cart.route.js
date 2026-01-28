import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// All cart routes are protected
router.get('/', protect, getCart);
router.post('/:productId', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

export default router;
