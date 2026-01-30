import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { submitQuiz, getQuizHistory, clearQuizHistory } from '../controllers/quiz.controller.js';

const router = express.Router();

// Protected: Users must be logged in to submit and see quiz history
router.post('/submit', protect, submitQuiz);

// Protected: Only logged-in users can see their past history
router.get('/history', protect, getQuizHistory);

// Protected: Clear user's quiz history
router.delete('/history', protect, clearQuizHistory);

export default router;