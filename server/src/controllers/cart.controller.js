import Product from '../models/Product.model.js';
import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.utility.js';
import { errorHandler } from '../utils/errorHandler.utility.js';

// Get user's cart
export const getCart = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('cart');

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user.cart
    });
});

// Add product to cart
export const addToCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const [user, product] = await Promise.all([
        User.findById(userId),
        Product.findById(productId)
    ]);

    if (!product) {
        return next(new errorHandler('Product not found', 404));
    }

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    // Check if product already in cart
    if (user.cart.includes(productId)) {
        return res.status(200).json({
            success: true,
            message: 'Product already in cart',
            data: user.cart
        });
    }

    user.cart.push(productId);
    product.cart_count += 1;

    await Promise.all([user.save(), product.save()]);

    // Populate cart before sending
    await user.populate('cart');

    res.status(200).json({
        success: true,
        message: 'Product added to cart',
        data: user.cart
    });
});

// Remove product from cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user._id;

    const [user, product] = await Promise.all([
        User.findById(userId),
        Product.findById(productId)
    ]);

    if (!product) {
        return next(new errorHandler('Product not found', 404));
    }

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    user.cart = user.cart.filter(id => id.toString() !== productId.toString());
    product.cart_count = Math.max(0, product.cart_count - 1);

    await Promise.all([user.save(), product.save()]);

    // Populate cart before sending
    await user.populate('cart');

    res.status(200).json({
        success: true,
        message: 'Product removed from cart',
        data: user.cart
    });
});

// Clear entire cart
export const clearCart = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new errorHandler('User not found', 404));
    }

    // Decrease cart_count for all products in cart
    const cartProductIds = user.cart;
    await Product.updateMany(
        { _id: { $in: cartProductIds } },
        { $inc: { cart_count: -1 } }
    );

    user.cart = [];
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Cart cleared',
        data: []
    });
});
