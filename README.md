# Tohfey - AI-Powered Gift Recommendation Platform

A production-ready MERN stack application for personalized gift recommendations based on a smart matching engine.

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, Tailwind CSS v4, Framer Motion, Lucide React Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Security:** bcryptjs (password hashing), helmet, express-rate-limit, JWT (httpOnly cookies)
- **File Upload:** Cloudinary with multer
- **Payments:** Razorpay Integration (optional)
- **Consultation:** Cal.com Integration

## Core Features

### For Users

- ✨ **Smart Quiz Engine:** Answer questions to get personalized product recommendations
- 🎁 **Product Discovery:** Browse products with detailed information and reviews
- ❤️ **Wishlist:** Save favorite products for later
- 🛒 **Cart:** Add products to cart (calculation-only, no checkout)
- 💰 **Price Comparison:** Compare prices across different retailers
- 📚 **Quiz History:** View past quiz responses and recommendations
- ⚙️ **Profile Settings:** Update name and password

### For Admins

- 📊 **Analytics Dashboard:** View total products, quizzes, consultations
- 🏆 **Top Products Table:** See which products are most viewed/wishlisted/carted
- ➕ **Product Management:** Add, edit, delete products with multi-image upload
- � **Multi-Retailer Pricing:** Manage prices across multiple retailers with links and shipping costs
- 👥 **Consultation Requests:** View all consultation booking requests and payment status
- 🖼️ **Image Gallery:** Upload up to 5 images per product with deletion support

### Technical Features

- 🔐 **JWT Authentication:** Secure httpOnly cookie-based authentication
- 🔒 **Protected Routes:** Both frontend and backend route protection
- 📸 **Image Upload:** Cloudinary integration with CRUD operations
- 💲 **Multi-Retailer Pricing:** Dynamic retailer price management with shipping costs
- 📱 **Responsive Design:** Mobile, tablet, and desktop optimized
- ⚡ **Error Handling:** Comprehensive error handling frontend & backend
- 🎨 **Modern UI:** Clean, modern design with Tailwind CSS
- 🔍 **Search & Filters:** Filter products by category, price range, tags

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier available)
- Optional: Razorpay account for payment testing

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tohfey
JWT_SECRET=your_super_secret_key_change_this
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database (creates admin user and sample products):

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000>

## Default Admin Credentials

- **Email:** <admin@tohfey.com>
- **Password:** adminpassword123

Use these to access the admin dashboard at `/admin`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and Cloudinary config
│   ├── controllers/     # Business logic for routes
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Helper functions
│   └── server.js        # Express app entry point

frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components (Quiz, Results, etc.)
│   ├── redux/          # Redux store and slices
│   ├── services/       # API service layer
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main app component
```

## Key Features Explained

### Quiz Engine

- Sequential single-question interface
- Weighted scoring system
- Personalized product recommendations based on responses

### Product Management (Admin)

- Add products with up to 5 images
- Edit existing products and replace images
- Delete products (with confirmation)
- Automatic image management via Cloudinary

### Authentication

- Secure password hashing with bcryptjs
- Pre-save model hook for consistent password hashing
- Protected routes requiring authentication
- httpOnly cookies for JWT tokens

### API Endpoints

#### Public

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/quiz/submit` - Submit quiz answers

#### Protected (Login Required)

- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/logout` - User logout
- `POST /api/products/:id/wishlist` - Toggle wishlist
- `GET /api/products/wishlist/me` - Get user's wishlist
- `GET /api/quiz/history` - Get quiz history

#### Admin Only

- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `DELETE /api/admin/products/:id/image/:public_id` - Delete product image
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/consultations` - Get consultation requests

## Deployment

### Backend

Recommended hosts: Render, Railway, Heroku

1. Set all environment variables
2. Use MongoDB Atlas for database
3. Deploy Node.js application

### Frontend

Recommended hosts: Vercel, Netlify

1. Build: `npm run build`
2. Deploy the `dist` folder
3. Update API base URL if needed

## Troubleshooting

### Login issues

- Ensure bcryptjs is installed in backend
- Clear browser cookies and try again
- Check that passwords are hashing via pre-save hook

### Image upload fails

- Verify Cloudinary credentials
- Check max file size limits
- Ensure multer is properly configured

### Auth/me called repeatedly

- This is now fixed with React 18 StrictMode guard
- Use latest App.jsx with useRef guard
- Clear cache if issue persists

## Recent Updates (v3.1)

- ✅ Fixed password hashing double-encryption issue
- ✅ Completed admin dashboard with full CRUD operations
- ✅ Added profile settings page for users
- ✅ Fixed React 18 StrictMode double-effect auth spam
- ✅ Implemented multi-image product upload
- ✅ Added comprehensive admin analytics
- ✅ Updated all documentation

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md)

## Support & Documentation

- 📖 **Setup Guide:** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions
- 📝 **Changelog:** See [CHANGELOG.md](CHANGELOG.md) for all changes and fixes
- 🐛 **Issues:** Check SETUP_GUIDE.md troubleshooting section

## License

This project is open source and available under the MIT License.
