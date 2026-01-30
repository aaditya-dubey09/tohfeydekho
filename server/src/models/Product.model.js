import mongoose from 'mongoose';

const retailerPriceSchema = new mongoose.Schema({
  retailer_id: {
    type: String,
    required: true
  }, // e.g., 'amazon', 'flipkart'
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  link: {
    type: String,
    required: true
  },
  is_exact: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'fashion', 'home_decor', 'books', 'toys', 'beauty', 'sports', 'others', 'jewelry', 'gadgets', 'accessories', 'stationery', 'kitchen', 'outdoor', 'health', 'automotive', 'music', 'art_crafts', 'gaming', 'pet_supplies', 'travel', 'baby_products', 'food_beverage', 'fitness', 'office_supplies', 'gardening', 'footwear', 'watches', 'furniture', 'appliances', 'clothing' ],
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  budget_range: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  // Recommendation Engine Metadata
  relation_tags: [{ type: String }],    // e.g., 'friend', 'partner'
  occasion_tags: [{ type: String }],    // e.g., 'birthday', 'anniversary'
  emotion_tags: [{ type: String }],     // e.g., 'romantic', 'funny'
  personality_tags: [{ type: String }], // e.g., 'techie', 'artist'
  custom_tags: [{ type: String }],      // user-defined custom tags

  retailer_prices: {
    type: [retailerPriceSchema],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'At least one retailer price is required'
    }
  },

  expert_rating: { type: Number, min: 0, max: 5, default: 0 },
  is_visible: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  wishlist_count: { type: Number, default: 0 },
  cart_count: { type: Number, default: 0 }
}, { timestamps: true });

// Index for better search performance
productSchema.index({ category: 1, budget_range: 1 });

productSchema.index({ relation_tags: 1 });
productSchema.index({ occasion_tags: 1 });
productSchema.index({ personality_tags: 1 });

export default mongoose.model('Product', productSchema);