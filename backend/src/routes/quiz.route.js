import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { submitQuiz, getQuizHistory } from '../controllers/quiz.controller.js';

const router = express.Router();

// Public/Semi-public: User doesn't NEED to be logged in to take the quiz
router.post('/submit', submitQuiz);

// Protected: Only logged-in users can see their past history
router.get('/history', protect, getQuizHistory);

export default router;