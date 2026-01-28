import Product from '../models/Product.model.js';
import { User } from '../models/User.model.js';
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import { errorHandler } from "../utils/errorHandler.utility.js";

// Get all products with filters
export const getAllProducts = asyncHandler(async (req, res, next) => {
    const { relation, occasion, budget, emotion, personality, search, minPrice, maxPrice } = req.query;

    const query = { is_visible: true };

    const splitCsv = (value) =>
        typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : undefined;

    const relationArr = splitCsv(relation);
    const occasionArr = splitCsv(occasion);
    const budgetArr = splitCsv(budget);
    const emotionArr = splitCsv(emotion);
    const personalityArr = splitCsv(personality);

    if (relationArr?.length) query.relation_tags = { $in: relationArr };
    if (occasionArr?.length) query.occasion_tags = { $in: occasionArr };
    if (budgetArr?.length) query.budget_range = { $in: budgetArr };
    if (emotionArr?.length) query.emotion_tags = { $in: emotionArr };
    if (personalityArr?.length) query.personality_tags = { $in: personalityArr };

    if (minPrice || maxPrice) {
        query.base_price = {};
        if (minPrice) query.base_price.$gte = Number(minPrice);
        if (maxPrice) query.base_price.$lte = Number(maxPrice);
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const products = await Product.find(query);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// Get single product & Increment views
export const getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
        success: true,
        data: product
    });
});

// Toggle Wishlist
export const toggleWishlist = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const userId = req.user._id;

    const [user, product] = await Promise.all([
        User.findById(userId),
        Product.findById(productId)
    ]);

    if (!product) return next(new errorHandler("Product not found", 404));
    if (!user) return next(new errorHandler("User not found", 404));

    const isAlreadyInWishlist = user.wishlist.includes(productId);

    if (isAlreadyInWishlist) {
        // Remove from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
        product.wishlist_count = Math.max(0, product.wishlist_count - 1);
    } else {
        // Add to wishlist
        user.wishlist.push(productId);
        product.wishlist_count += 1;
    }

    // Save both concurrently
    await Promise.all([user.save(), product.save()]);

    res.status(200).json({
        success: true,
        message: isAlreadyInWishlist ? "Removed from wishlist" : "Added to wishlist",
        data: user.wishlist
    });
});

// Get user's wishlist
export const getWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user.wishlist
    });
});