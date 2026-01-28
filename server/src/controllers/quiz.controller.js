import { getRecommendations } from '../services/matchingEngine.js';
import {QuizResult} from '../models/User.model.js';
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import jwt from "jsonwebtoken";

// Submit Quiz & Get Recommendations
export const submitQuiz = asyncHandler(async (req, res, next) => {
    const quizData = req.body;

    // Get recommendations from your matching logic
    const recommendations = await getRecommendations(quizData);

    // Optional: Identify user if token exists (without using 'protect' middleware)
    let userId = null;
    const token = req.cookies?.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (error) {
            // Silently fail: user just won't have the quiz saved to their profile
            console.error("Quiz Guest Mode: Invalid Token");
        }
    }

    // Save result to DB
    await QuizResult.create({
        user: userId,
        ...quizData,
        recommended_products: recommendations.map(r => r._id)
    });

    res.status(200).json({
        success: true,
        data: recommendations
    });
});

// Get User Quiz History
export const getQuizHistory = asyncHandler(async (req, res, next) => {
    // Here we use req.user._id because 'protect' middleware is applied
    const history = await QuizResult.find({ user: req.user._id })
        .populate('recommended_products')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: history.length,
        data: history
    });
});