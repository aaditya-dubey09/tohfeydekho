import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createOrder,
  verifyPayment,
  razorpayWebhook
} from '../controllers/payments.controller.js';

const router = express.Router();

// Order & Verification
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

// Webhook (No 'protect' middleware here as it comes from Razorpay)
router.post('/webhook', razorpayWebhook);

export default router;