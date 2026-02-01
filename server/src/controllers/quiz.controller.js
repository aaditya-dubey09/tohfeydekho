import { getRecommendations } from '../services/matchingEngine.js';
import {QuizResult} from '../models/User.model.js';
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import jwt from "jsonwebtoken";

// Submit Quiz & Get Recommendations
export const submitQuiz = asyncHandler(async (req, res, next) => {
    const quizData = req.body;
    const userId = req.user._id; // From protect middleware
    console.log('Quiz submission received for user:', userId);
    console.log('Quiz data:', { quizData });

    // Get recommendations from your matching logic
    const { products, matchType, noPerfectMatch } = await getRecommendations(quizData);
    console.log('Recommendations found:', products.length);

    try {
        // Save result to DB with authenticated user
        const quizResult = await QuizResult.create({
            user: userId,
            ...quizData,
            recommended_products: products.map(r => r._id)
        });
        console.log('Quiz result saved:', quizResult._id);

        res.status(200).json({
            success: true,
            data: products,
            matchType,
            noPerfectMatch,
            quizResultId: quizResult._id
        });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        // Still return recommendations even if saving fails
        res.status(200).json({
            success: true,
            data: products,
            matchType,
            noPerfectMatch,
            warning: 'Recommendations loaded but could not save history'
        });
    }
});

// Get User Quiz History
export const getQuizHistory = asyncHandler(async (req, res, next) => {
    console.log('Quiz history requested for user:', req.user._id);
    
    // Here we use req.user._id because 'protect' middleware is applied
    const history = await QuizResult.find({ user: req.user._id })
        .populate('recommended_products')
        .sort({ createdAt: -1 });

    console.log('Quiz history found:', history.length);

    res.status(200).json({
        success: true,
        count: history.length,
        data: history
    });
});

// Clear User Quiz History
export const clearQuizHistory = asyncHandler(async (req, res, next) => {
    console.log('Clearing quiz history for user:', req.user._id);
    
    const result = await QuizResult.deleteMany({ user: req.user._id });
    
    console.log('Quiz history cleared:', result.deletedCount, 'entries deleted');

    res.status(200).json({
        success: true,
        message: `Cleared ${result.deletedCount} quiz history entries`,
        deletedCount: result.deletedCount
    });
});