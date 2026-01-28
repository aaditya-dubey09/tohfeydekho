import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { register, login, getProfile, logout, updateProfile, deleteUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.delete('/me', protect, deleteUser);

export default router;
