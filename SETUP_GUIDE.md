# Tohfey - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### Step 2: Set Up Environment Variables

**Backend (.env file):**

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tohfey
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payment & Booking (Optional - only needed if testing consultation payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
CALCOM_BOOKING_URL=https://cal.com/your-handle/15min
```

**Note:** The app will run without Razorpay credentials. Payment features will only work once you configure them.

**Frontend (.env file - Optional):**

```bash
cd frontend
cp .env.example .env
```

**(Optional)** Add your Razorpay public key if you want to test payments:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Note:** Payment features require both backend and frontend Razorpay configuration.

### Step 3: Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

**Local MongoDB:**

```bash
mongod
```

### Step 4: Seed the Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This will create:

- Admin user (email: <admin@tohfey.com>, password: adminpassword123)
- Sample products

### Step 5: Start the Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** <http://localhost:5173>
- **Backend API:** <http://localhost:5000>

---

## 🔐 Getting Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Paste into your `.env` file

---

## 📋 What Works Now

### ✅ User Features

- [x] User Registration & Login
- [x] Profile Settings (Update Name & Password)
- [x] Quiz with Smart Product Matching
- [x] View Quiz Results
- [x] Product Detail Pages
- [x] Wishlist (Add/Remove/View)
- [x] Cart (Add/Remove/View/Clear)
- [x] Quiz History
- [x] Price Comparison

### ✅ Admin Features

- [x] Admin Dashboard with Sidebar Navigation
- [x] Product Management:
  - [x] Add products with multi-image upload (up to 5 images)
  - [x] Edit products with image replacement/deletion
  - [x] Delete products with confirmation
  - [x] Real-time form validation
  - [x] **NEW: Multi-retailer price management**
    - Add/remove multiple retailers per product
    - Set price, shipping cost, and product link for each retailer
    - Mark prices as exact or approximate
- [x] Analytics Tab (Total Products, Quizzes, Consultations, Top Products Table)
- [x] Consultations Tab (View all consultation requests with status)
- [x] Multiple Image Upload Support with Preview

### ✅ Technical Features

- [x] JWT Authentication (httpOnly cookies)
- [x] Protected Routes (both frontend and backend)
- [x] Image Upload to Cloudinary (CRUD operations)
- [x] Responsive Design (Mobile, Tablet, Desktop)
- [x] Error Handling (Frontend & Backend)
- [x] API Service Layer (Centralized API methods)
- [x] Password Hashing (pre-save hook in User model)
- [x] Form Validation (Frontend & Backend)

---

## 🎯 Testing the Application

### Test User Flow

1. **Register:** Go to /register and create an account
2. **Take Quiz:** Go to /quiz and answer questions
3. **View Results:** See matched products
4. **View Product:** Click on any product
5. **Add to Wishlist:** Click heart icon (must be logged in)
6. **Add to Cart:** Click cart icon
7. **View Cart:** Click cart in navbar
8. **View Wishlist:** Click heart in navbar
9. **View History:** Click user icon → Quiz History
10. **Book Expert Call:** On Results page click “Book Expert Chat”, complete Razorpay payment, and confirm redirect to your CALCOM_BOOKING_URL for scheduling

### Test Admin Flow

1. **Login as Admin:** email: <admin@tohfey.com>, password: adminpassword123
2. **Go to Admin Dashboard:** /admin
3. **View Analytics:**
   - See product statistics, quiz submissions, and consultation count
   - View top products table with views, wishlists, and cart counts
4. **Manage Products:**
   - Click "Add Product" to create new product
   - Fill form with name, category, price, discount, description
   - Upload up to 5 product images
   - Click Edit to modify existing products
   - Click Delete to remove products
5. **View Consultations:** Check all consultation requests with user email, payment status, and amount

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:** Make sure MongoDB is running:

```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod
```

### Issue: "Module not found" errors

**Solution:** Make sure you installed dependencies:

```bash
cd backend && npm install
cd frontend && npm install
```

### Issue: "Razorpay key_id is mandatory" error

**Solution:**
This error occurs when trying to use payment features without Razorpay credentials. You have two options:

1. **Skip payments for now:** The app will run fine without Razorpay. Payment features just won't work.
2. **Configure Razorpay:** Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your backend `.env` file.

### Issue: "401 Unauthorized" errors

**Solution:**

1. Make sure you're logged in
2. Check if JWT_SECRET is set in backend .env
3. Clear browser cookies and login again

### Issue: Images not displaying

**Solution:**

1. Verify Cloudinary credentials in .env
2. Make sure images have been uploaded with proper structure: `{ url, public_id }`
3. Check browser console for errors

### Issue: "Invalid credentials" on login

**Solution:**

1. Make sure you're using the correct email and password
2. Verify passwords are hashing correctly by checking the User model has pre-save hook
3. Try registering a new account and logging in
4. Check that bcryptjs is installed: `npm list bcryptjs`

### Issue: "Cannot find property 'url' of images"

**Solution:**
This occurs when images are accessed incorrectly. Make sure to:

1. Use `product.images[0]?.url` instead of `product.images[0]`
2. Check images are uploaded to Cloudinary with proper structure: `{ url, public_id }`
3. Verify Cloudinary credentials in backend .env

### Issue: "CORS error"

**Solution:**

1. Make sure FRONTEND_URL in backend .env matches your frontend URL
2. Restart backend server after changing .env

### Issue: Cart/Wishlist empty after refresh

**Solution:** This is normal! Cart in frontend uses Redux (local state only). Wishlist is saved to database and should persist.

### Issue: "/auth/me called hundreds of times on load"

**Solution:**
This was caused by React 18 StrictMode double-rendering effects. This is now fixed with a useRef guard in App.jsx. If you still see this:

1. Verify you have the latest version of App.jsx with the useRef guard
2. Clear browser cache and restart dev server
3. Check that StrictMode is in effect (helps catch bugs)

---

## 📁 Project Structure Explained

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Cloudinary)
│   ├── controllers/     # Route logic (business logic)
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (matching engine)
│   ├── utils/           # Helper functions
│   └── server.js        # Main server file

frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── redux/          # State management
│   ├── services/       # API calls
│   └── App.jsx         # Main app component
```

---

## 🔄 API Endpoints Quick Reference

### Public Routes

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/quiz/submit` - Submit quiz
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Protected Routes (Login Required)

- `GET /api/auth/me` - Get profile
- `POST /api/auth/logout` - Logout
- `GET /api/products/wishlist/me` - Get wishlist
- `POST /api/products/:id/wishlist` - Toggle wishlist
- `GET /api/cart` - Get cart
- `POST /api/cart/:productId` - Add to cart
- `DELETE /api/cart/:productId` - Remove from cart
- `GET /api/quiz/history` - Get quiz history

### Admin Routes (Admin Login Required)

- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/consultations` - Get consultations

---

## 💡 Pro Tips

1. **Use Admin Account:** The seeded admin account lets you test all features
2. **Check Network Tab:** Open browser DevTools → Network tab to debug API calls
3. **MongoDB Compass:** Use MongoDB Compass to view your database visually
4. **Postman:** Test API endpoints with Postman before implementing in frontend
5. **Environment Variables:** Never commit .env files to git

---

## 📊 Data Models

### Product Structure

```javascript
{
  name: "Product Name",
  description: "Description",
  images: [
    { url: "cloudinary_url", public_id: "cloudinary_id" }
  ],
  base_price: 1000,
  budget_range: "medium", // low, medium, high
  relation_tags: ["friend", "partner"],
  occasion_tags: ["birthday"],
  emotion_tags: ["thoughtful"],
  personality_tags: ["techie"],
  retailer_prices: [
    {
      retailer_id: "amazon",
      price: 999,
      shipping_cost: 0,
      link: "https://amazon.com/...",
      is_exact: true
    }
  ],
  expert_rating: 4.5,
  is_visible: true
}
```

### User Structure

```javascript
{
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "user", // or "admin"
  wishlist: [ObjectId],
  cart: [ObjectId]
}
```

---

## 🚦 Next Steps

1. **Customize:** Add your own products through admin dashboard
2. **Brand:** Update colors, fonts, and content
3. **Deploy:** Follow README.md for deployment instructions
4. **Extend:** Add new features like reviews, ratings, etc.

---

## 📞 Need Help?

1. Check [CHANGELOG.md](CHANGELOG.md) for all fixes and changes
2. Check [README.md](README.md) for detailed documentation
3. Review code comments in individual files
4. Check browser console and server logs for errors

---

## ✨ You're All Set

Your Tohfey application is now ready to use. Start by:

1. Creating a user account
2. Taking the quiz
3. Exploring products
4. Testing cart and wishlist
5. Checking admin features

Happy coding! 🎉
