import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Hash password before saving (but only if it's modified/new)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relation: String,
  occasion: String,
  budget_segment: String,
  emotion: String,
  personality_traits: [String],
  optional_note: String,
  recommended_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const consultationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  contact: String,
  context: String,
  payment_id: String,
  order_id: String,
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  amount: Number
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const QuizResult = mongoose.model('QuizResult', quizResultSchema);
export const Consultation = mongoose.model('Consultation', consultationSchema);
