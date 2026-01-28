import Razorpay from "razorpay";
import crypto from "crypto";
import { Consultation, User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import { errorHandler } from "../utils/errorHandler.utility.js";

const getCalBookingUrl = (consultation, user) => {
    const base = process.env.CALCOM_BOOKING_URL || "";
    if (!base) return null;

    const params = new URLSearchParams({
        name: consultation?.name || user?.fullName || "",
        email: user?.email || consultation?.contact || "",
        phone: consultation?.contact || "",
        notes: consultation?.context || "",
        metadata_orderId: consultation?.order_id || "",
    });

    return `${base}?${params.toString()}`;
};

// Lazy initialization to avoid crashes when env vars are missing
let razorpay = null;
const getRazorpayInstance = () => {
    if (!razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new errorHandler("Razorpay credentials not configured", 500);
        }
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
};

// 1. Create Order
export const createOrder = asyncHandler(async (req, res, next) => {
    const { amount, name, contact, context } = req.body;

    if (!amount) return next(new errorHandler("Amount is required", 400));

    const razorpayInstance = getRazorpayInstance();

    const options = {
        amount: Number(amount) * 100, // conversion to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const user = await User.findById(req.user._id).select("fullName email");

    await Consultation.create({
        user: req.user._id,
        name: name || user?.fullName,
        contact: contact || user?.email,
        context,
        order_id: order.id,
        amount,
        status: 'pending'
    });

    res.status(201).json({
        success: true,
        data: order
    });
});

// 2. Verify Payment (Manual Verification from Frontend)
export const verifyPayment = asyncHandler(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const consultation = await Consultation.findOneAndUpdate(
            { order_id: razorpay_order_id },
            {
                status: 'paid',
                payment_id: razorpay_payment_id
            },
            { new: true }
        ).populate('user', 'fullName email');

        const calBookingUrl = getCalBookingUrl(consultation, consultation?.user);

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            calBookingUrl
        });
    } else {
        return next(new errorHandler("Payment verification failed", 400));
    }
});

// 3. Webhook (For async events like abandoned payments or success)
export const razorpayWebhook = asyncHandler(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
        const { payload } = req.body;
        const orderId = payload.payment.entity.order_id;

        await Consultation.findOneAndUpdate(
            { order_id: orderId },
            {
                status: 'paid',
                payment_id: payload.payment.entity.id
            }
        );

        res.status(200).json({ status: 'ok' });
    } else {
        res.status(400).send("Invalid signature");
    }
});