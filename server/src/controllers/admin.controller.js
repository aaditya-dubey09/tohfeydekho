import Product from '../models/Product.model.js';
import { Consultation, QuizResult } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.utility.js';
import { errorHandler } from '../utils/errorHandler.utility.js';
import cloudinary from '../config/cloudinary.config.js';

// --- Product CRUD ---

// 1. Create Product
export const createProduct = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        category,
        budget_range,
        retailer_prices,
        relation_tags,
        occasion_tags,
        emotion_tags,
        personality_tags,
        custom_tags,
        expert_rating
    } = req.body;

    // Parse JSON fields
    let parsedRetailerPrices = retailer_prices;
    if (typeof retailer_prices === 'string') {
        try {
            parsedRetailerPrices = JSON.parse(retailer_prices);
        } catch (error) {
            return next(new errorHandler("Invalid retailer_prices format", 400));
        }
    }

    // Parse tag arrays
    const parseTagArray = (tags) => {
        if (!tags) return [];
        if (typeof tags === 'string') {
            try {
                return JSON.parse(tags);
            } catch {
                return [];
            }
        }
        return Array.isArray(tags) ? tags : [];
    }

    const parsedRelationTags = parseTagArray(relation_tags);
    const parsedOccasionTags = parseTagArray(occasion_tags);
    const parsedEmotionTags = parseTagArray(emotion_tags);
    const parsedPersonalityTags = parseTagArray(personality_tags);
    const parsedCustomTags = parseTagArray(custom_tags);

    // Validate at least one retailer
    if (!parsedRetailerPrices || parsedRetailerPrices.length === 0) {
        return next(new errorHandler("At least one retailer price is required", 400));
    }

    // Multer will have stored files in req.files
    const images = req.files ? req.files.map(file => ({
        url: file.path,             // Cloudinary URL
        public_id: file.filename    // Cloudinary Public ID
    })) : [];

    try {
        const product = await Product.create({
            name,
            description,
            category,
            budget_range,
            retailer_prices: parsedRetailerPrices,
            relation_tags: parsedRelationTags,
            occasion_tags: parsedOccasionTags,
            emotion_tags: parsedEmotionTags,
            personality_tags: parsedPersonalityTags,
            custom_tags: parsedCustomTags,
            expert_rating: parseFloat(expert_rating) || 0,
            images
        });

        // Send Success Response and STOP here
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        // Cleanup Cloudinary if DB failed
        if (images.length > 0) {
            const deletePromises = images.map(img => cloudinary.uploader.destroy(img.public_id));
            await Promise.all(deletePromises);
        }
        return next(error);
    }
});

// 2. Update Product
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
        name,
        description,
        category,
        budget_range,
        retailer_prices,
        relation_tags,
        occasion_tags,
        emotion_tags,
        personality_tags,
        custom_tags,
        expert_rating
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    // Parse retailer_prices if it's a string
    let parsedRetailerPrices = retailer_prices;
    if (typeof retailer_prices === 'string') {
        try {
            parsedRetailerPrices = JSON.parse(retailer_prices);
        } catch (error) {
            return next(new errorHandler("Invalid retailer_prices format", 400));
        }
    }

    // Parse tag arrays
    const parseTagArray = (tags) => {
        if (!tags) return undefined;
        if (typeof tags === 'string') {
            try {
                return JSON.parse(tags);
            } catch {
                return undefined;
            }
        }
        return Array.isArray(tags) ? tags : undefined;
    };

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (budget_range) product.budget_range = budget_range;
    if (parsedRetailerPrices) product.retailer_prices = parsedRetailerPrices;
    if (expert_rating !== undefined) product.expert_rating = parseFloat(expert_rating) || 0;

    // Update tags if provided
    const parsedRelationTags = parseTagArray(relation_tags);
    const parsedOccasionTags = parseTagArray(occasion_tags);
    const parsedEmotionTags = parseTagArray(emotion_tags);
    const parsedPersonalityTags = parseTagArray(personality_tags);
    const parsedCustomTags = parseTagArray(custom_tags);

    if (parsedRelationTags !== undefined) product.relation_tags = parsedRelationTags;
    if (parsedOccasionTags !== undefined) product.occasion_tags = parsedOccasionTags;
    if (parsedEmotionTags !== undefined) product.emotion_tags = parsedEmotionTags;
    if (parsedPersonalityTags !== undefined) product.personality_tags = parsedPersonalityTags;
    if (parsedCustomTags !== undefined) product.custom_tags = parsedCustomTags;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const newImages = await Promise.all(uploadPromises);
        product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
    });
});

// 3. Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new errorHandler("Product not found", 404));

    // Delete all images associated with this product from Cloudinary
    const deletePromises = product.images.map(img =>
        cloudinary.uploader.destroy(img.public_id)
    );
    await Promise.all(deletePromises);

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// 4. Delete Specific Image from a Product
export const deleteProductImage = asyncHandler(async (req, res, next) => {
    const { id, public_id } = req.params; // public_id must be passed in URL or body

    const product = await Product.findById(id);
    if (!product) return next(new errorHandler("Product not found", 404));

    // 1. Remove from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // 2. Remove from Database array
    product.images = product.images.filter(img => img.public_id !== public_id);
    await product.save();

    res.status(200)
        .json({
            success: true,
            message: "Image removed",
            data: product
        });
});

// --- Analytics & Consultations ---

export const getAnalytics = asyncHandler(async (req, res, next) => {
    const [totalProducts, totalQuizzes, totalConsultations, productStats] = await Promise.all([
        Product.countDocuments(),
        QuizResult.countDocuments(),
        Consultation.countDocuments({ status: 'paid' }),
        Product.find().select('name views wishlist_count cart_count').sort({ views: -1 }).limit(10)
    ]);

    res.status(200).json({
        success: true,
        data: {
            summary: {
                totalProducts,
                totalQuizzes,
                totalConsultations
            },
            productStats
        }
    });
});

export const getAllConsultations = asyncHandler(async (req, res, next) => {
    const consultations = await Consultation.find()
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: consultations.length,
        data: consultations
    });
});

// Add custom tag to a specific product
export const addCustomTag = asyncHandler(async (req, res, next) => {
    const { productId, tag, tagType } = req.body; // tagType: 'relation', 'occasion', 'emotion', 'personality'

    if (!tagType || !['relation_tags', 'occasion_tags', 'emotion_tags', 'personality_tags'].includes(tagType + '_tags')) {
        return next(new errorHandler("Invalid tag type", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    const normalizedTag = tag.toLowerCase().trim();
    const fieldName = tagType + '_tags';
    
    if (!product[fieldName].includes(normalizedTag)) {
        product[fieldName].push(normalizedTag);
        await product.save();
    }

    res.json({ 
        success: true,
        message: 'Tag added successfully', 
        data: product 
    });
});

// Get all tags by type
export const getAllTags = asyncHandler(async (req, res) => {
    const { tagType } = req.query; // relation, occasion, emotion, personality

    let allTags = {};

    if (!tagType || tagType === 'relation') {
        allTags.relation_tags = await Product.distinct('relation_tags');
    }
    if (!tagType || tagType === 'occasion') {
        allTags.occasion_tags = await Product.distinct('occasion_tags');
    }
    if (!tagType || tagType === 'emotion') {
        allTags.emotion_tags = await Product.distinct('emotion_tags');
    }
    if (!tagType || tagType === 'personality') {
        allTags.personality_tags = await Product.distinct('personality_tags');
    }

    res.json({ 
        success: true,
        data: allTags 
    });
});