import { User } from '../models/User.model.js';
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import { errorHandler } from "../utils/errorHandler.utility.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
export const register = asyncHandler(async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return next(new errorHandler("Full name, email, and password are required.", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) return next(new errorHandler(`User already exists.`, 400));

    // Password will be automatically hashed by the pre-save hook in User model
    const user = await User.create({
        fullName,
        email,
        password
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        success: true,
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
    });
});

// Login user
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler("Please provide email and password", 400));
    }

    // Find user and explicitly select password as we have "select: false" in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new errorHandler('Invalid credentials', 401));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return next(new errorHandler('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
        success: true,
        _id: user._id,
        fullName: user.fullName,
        email: user.email
    });
});

// Get user profile
export const getProfile = asyncHandler(async (req, res, next) => {
    // req.user should be populated by 'protect' middleware
    const user = await User.findById(req.user?._id).select("-password");

    if (!user) {
        return next(new errorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

// Update user profile
export const updateProfile = asyncHandler(async (req, res, next) => {
    const { fullName, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id).select("+password");

    if (!user) return next(new errorHandler("User not found", 404));

    if (newPassword) {
        if (!currentPassword) {
            return next(new errorHandler("Current password is required", 400));
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return next(new errorHandler("Incorrect current password", 401));
        }
        // The pre('save') hook in model handles the hashing.
        user.password = newPassword;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    await user.save(); // Hook fires here and hashes 'newPassword'
    
    // Removing password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
    });
});

// Logout user
export const logout = asyncHandler(async (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), // Instantly expires the cookie
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// Delete user account
export const deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.user?._id);

    if (!user) {
        return next(new errorHandler("User not found", 404));
    }

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
        success: true,
        message: "Account permanently deleted",
    });
});
