import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/products.route.js';
import quizRoutes from './routes/quiz.route.js';
import paymentRoutes from './routes/payments.route.js';
import adminRoutes from './routes/admin.route.js';
import cartRoutes from './routes/cart.route.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tohfey')
  .then(() => console.log('Connected to MongoDB'))

// Health check endpoint
app.get('/api/healthcheck', (req, res) => {
  res.status(200)
    .json({
      status: 'OK',
      timestamp: new Date()
    });
})

app.get('/api/test-ga', async (req, res) => {
  console.log("Testing GA Connection...");
  console.log("Property ID:", process.env.GA4_PROPERTY_ID);
  console.log("Email:", process.env.GA4_CLIENT_EMAIL);
  
  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: 'yesterday', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });
    res.json({ success: true, data: response });
  } catch (err) {
    console.error("DIAGNOSTIC ERROR:", err.message);
    res.status(500).json({ error: err.message, details: err.code });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
