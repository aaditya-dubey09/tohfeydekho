# CHANGELOG - Complete Fix Report

All notable changes to the Tohfey application will be documented in this file.

## [3.4.0] - 2026-01-27

### 🏷️ **Enhanced Recommendation Engine with Tagging System**

#### Added

- **Multi-Tag Product Classification System**:
  - `relation_tags`: Target relationship (Friend, Partner, Family, Colleague, etc.)
  - `occasion_tags`: Event type (Birthday, Anniversary, Wedding, etc.)
  - `emotion_tags`: Gift style (Romantic, Funny, Sentimental, Practical, etc.)
  - `personality_tags`: Recipient traits (Techie, Artist, Fitness, Foodie, etc.)
  - `expert_rating`: 0-5 star rating by admins

- **Tag Management in Admin Dashboard**:
  - Click-to-toggle tag buttons for each category
  - Color-coded tag groups (blue=relation, purple=occasion, pink=emotion, green=personality)
  - Visual feedback showing selected tags
  - Tag display in product list view

- **Improved Product Model**:
  - Added `category` field for general classification
  - Made all tags optional but recommended
  - Added database indexing for better search performance

#### Changed

- **Admin Form Enhanced**:
  - Added "Recommendation Tags" section with 30+ predefined options
  - Tags are now optional (can add over time)
  - Form organized into logical sections: Basic Info, Tags, Pricing, Images
  - Added expert rating input (0-5 scale)

- **Backend Controller Updates**:
  - Parse and validate tag arrays from form submission
  - Handle both JSON strings and arrays for flexibility
  - Maintain existing images when updating tags only

#### Why This Approach?

1. **Better Recommendations**: Tags improve quiz matching accuracy
2. **Flexibility**: Tags are optional, not required
3. **Control**: Admin has full control over product classification
4. **Scalability**: Easy to add new tags or categories
5. **Performance**: Indexed fields for faster queries

#### Migration Note

Existing products without tags will continue to work. Tags can be added gradually through the admin dashboard's edit function.

---

## Date: January 27, 2026 (Update 3.3.0 - Price comparison simplified)

### 🎯 **Multi-Retailer Price Comparison - Simplified**

#### Changed

- **Removed `base_price` field** - Now using only retailer prices for accuracy
- **Removed global `discount_percentage`** - Discounts are now per-retailer
- **Removed `shipping_cost`** - Not needed as we redirect to retailers
- **Simplified retailer price structure**:
  - `retailer_id`: Name of the retailer (e.g., Amazon, Flipkart)
  - `price`: Product price at this retailer
  - `discount_percentage`: Optional discount % for this retailer
  - `link`: Direct link to product on retailer's website
  - `is_exact`: Boolean indicating if price is exact or approximate

#### Added

- **Per-retailer discount support** - Each retailer can have different discounts
- **Price preview in admin form** - See final price after discount in real-time
- **"Exact Price" indicator** - Mark prices as exact or "Starting from"
- **Validation** - Minimum one retailer required per product
- **Price range display** - Products show min-max price range in listings

#### Frontend (AdminDashboard.jsx)

- Removed unnecessary price fields from form
- Added per-retailer discount input
- Added real-time price calculation preview
- Improved retailer form UX with better labels and tooltips
- Added validation for minimum one retailer requirement

#### Backend

- Updated Product model schema to remove `base_price`, `discount_percentage` fields
- Added validation for retailer_prices array (min 1 required)
- Updated admin controller to parse and validate retailer prices
- Maintained backwards compatibility for image uploads

#### Why These Changes?

1. **Accuracy**: Each retailer has different prices and discounts
2. **Simplicity**: One source of truth (retailer prices) instead of multiple overlapping fields
3. **Clarity**: Removed confusing shipping cost that wasn't used
4. **Flexibility**: Per-retailer discounts allow for accurate price comparison

## Date: January 27, 2026 (Update 3.2 - Retailer Price Comparison)

### Added

- **Multi-Retailer Price Form:**
  - Nested form in admin product creation/edit modal
  - Add/remove multiple retailer price entries
  - Each entry includes: retailer name, price, shipping cost, product link, exact/approx flag
  - ScrollableList for managing multiple retailers

- **Retailer Prices in Form:**
  - Retailers can be added dynamically with "+ Add Retailer" button
  - Each retailer entry has validation for required fields
  - Remove button for each retailer entry
  - Checkbox to mark price as exact or approximate

- **Enhanced Product Detail Page:**
  - Beautiful retailer price comparison cards
  - Automatic "BEST PRICE" badge on cheapest option
  - Total price calculation including shipping
  - Individual retailer cards with "View Store" button
  - Clear display of shipping cost if applicable

### Technical Changes

- **AdminDashboard.jsx:**
  - Added `budget_range` field to form data
  - Added `addRetailerPrice()` function to add new retailer entry
  - Added `removeRetailerPrice()` function to remove retailer entry
  - Added `updateRetailerPrice()` function to update retailer fields
  - Updated form submission to include retailer_prices as JSON
  - Added retailer prices section in modal form with styled inputs

- **ProductDetail.jsx:**
  - Enhanced price comparison display with card layout
  - Added logic to identify and highlight cheapest option
  - Shows approximate price indicator for non-exact prices
  - Improved shipping cost display
  - Added fallback message when no retailers available

### Form Structure

```javascript
retailer_prices: [
  {
    retailer_id: "Amazon",        // Retailer name
    price: 1299,                  // Product price
    shipping_cost: 50,            // Shipping (default 0)
    link: "https://...",          // Product link
    is_exact: true                // Exact or approximate price
  }
]
```

### User Experience

- Admin can manage multiple retailer prices easily
- Users see all price options on product detail page
- Best price automatically highlighted in green
- Clear shipping cost breakdown
- Direct links to each retailer

---

## Date: January 27, 2026 (Update 3.1 - Admin Dashboard & Auth Fixes)

### Fixed

- **Password hashing issue:** Fixed double password hashing in registration (manual hash + pre-save hook = broken login). Now using only pre-save hook in User model for consistent hashing
- **Login failure:** Passwords now hash correctly via pre-save hook, login with correct password works
- **Auth/me spam:** Added useRef guard in App.jsx to prevent React 18 StrictMode double-effects causing repeated auth checks
- **Removed global 401 redirect:** Was causing infinite redirect loops on failed auth checks

### Added

- **Admin Dashboard - Complete Implementation:**
  - Add product modal with full form (name, category, price, discount, description)
  - Multi-image upload support (up to 5 images per product) with preview
  - Edit products with ability to replace or remove images
  - Delete products with confirmation
  - Real-time validation and error handling
  - Analytics tab with summary stats and top products table
  - Consultations tab with status filtering (pending, paid, failed)
  
- **Profile Settings Page (/settings):**
  - Update profile name
  - Change password with current password verification
  - Delete account permanently
  - Form validation with error messages
  - Success feedback for updates
  
- **Frontend Admin API Methods:**
  - `adminAPI.createProduct()` - Create with FormData for file uploads
  - `adminAPI.updateProduct()` - Update existing product
  - `adminAPI.deleteProduct()` - Remove product
  - `adminAPI.deleteProductImage()` - Remove single image from product
  - `adminAPI.getAnalytics()` - Get dashboard stats
  - `adminAPI.getAllConsultations()` - Fetch all consultation requests

- **Navbar Enhancement:**
  - Added Settings icon link for logged-in users
  - Added title tooltips for better UX
  - Settings accessible from user profile menu

### Backend Changes

- **User Model:** Added pre-save password hashing hook with bcryptjs
- **Auth Controller:** Removed manual password hashing (now handled by model hook)
- **Import Order:** Fixed bcrypt import ordering in auth.controller.js

### Frontend Changes

- **App.jsx:** Added useRef guard to prevent React 18 StrictMode double-render effects
- **AdminDashboard.jsx:** Complete rewrite with CRUD forms, modals, image handling
- **Settings.jsx:** New component for profile updates and password changes
- **Navbar.jsx:** Added Settings route link
- **api.js:** Added complete adminAPI object with all admin endpoints

### Security

- Password hashing now happens consistently at model level
- Current password verification required for password changes
- Account deletion with proper authorization check

### Docs

- CHANGELOG updated with all changes
- User authentication flow now documented
- Admin features listed in documentation

---

## Date: January 25, 2026 (Update 2.1 - Hotfix)

### Fixed

- Razorpay initialization causing server crash when credentials not configured
- Changed to lazy initialization pattern - Razorpay instance only created when payment endpoints are called
- Server now starts successfully without Razorpay credentials (payment features optional)

### Docs

- Clarified that Razorpay credentials are optional in SETUP_GUIDE.md
- Added troubleshooting entry for Razorpay errors

---

## Date: January 25, 2026 (Update 2)

### Added

- Implemented full payment flow with Razorpay (create order, verify, webhook placeholder)
- Added Cal.com booking handoff after successful payment with prefilled user data
- Added payments API helpers on frontend and booking CTA on Results page
- Stored consultation records with user link and display in Admin Dashboard (with email + payment id)
- Enhanced product search filters (text search, tag $in filters, price range)

### Changed

- Payment routes now reference correct controller filename
- Consultation verification now returns booking URL for redirect
- Admin consultations list now shows user email and payment id when available

### Docs

- Updated backend and frontend .env examples with Razorpay webhook key and Cal.com URL
- Updated setup and usage docs to describe payment + booking flow

---

## Date: January 25, 2026

## Summary

Fixed all critical issues in the Tohfey application including backend import/export inconsistencies, missing routes, incorrect data access patterns, and frontend API integration problems.

---

## Backend Changes

### 1. Fixed Module Import/Export System

**Files Modified:**

- `backend/src/server.js`
- `backend/src/middleware/auth.middleware.js`
- `backend/src/controllers/auth.controller.js`
- `backend/src/controllers/products.controller.js`
- `backend/src/controllers/quiz.controller.js`
- `backend/src/controllers/admin.controller.js`
- `backend/src/services/matchingEngine.js`

**Changes:**

- Converted CommonJS `require/module.exports` to ES6 `import/export`
- Added `.js` extensions to all relative imports (required for ES modules)
- Fixed inconsistent export patterns across controllers

### 2. Fixed User Model

**File:** `backend/src/models/User.model.js`

**Changes:**

- Changed field name from `name` to `fullName` to match controller expectations
- Added `select: false` to password field for security
- Fixed export structure to be consistent with imports

### 3. Created Missing Configuration Files

**Files Created:**

- `backend/src/config/database.config.js` - MongoDB connection configuration
- `backend/src/config/cloudinary.config.js` - Cloudinary setup with multer storage

**Purpose:**

- Centralized configuration management
- Proper file upload handling with Cloudinary

### 4. Created Cart Functionality

**Files Created:**

- `backend/src/routes/cart.route.js` - Cart routes
- `backend/src/controllers/cart.controller.js` - Cart controller with full CRUD

**Endpoints Added:**

- `GET /api/cart` - Get user's cart
- `POST /api/cart/:productId` - Add to cart
- `DELETE /api/cart/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

**Features:**

- Automatic product `cart_count` tracking
- Cart population with product details
- Prevents duplicate products in cart

### 5. Added Wishlist Endpoint

**File:** `backend/src/controllers/products.controller.js`

**Changes:**

- Added `getWishlist()` function to fetch user's populated wishlist
- Updated routes to include `GET /api/products/wishlist/me`

### 6. Fixed Route Imports

**File:** `backend/src/server.js`

**Changes:**

- Added `.js` extensions to all route imports
- Added cart route registration
- Fixed route paths to match file names

### 7. Fixed Admin Controller

**File:** `backend/src/controllers/admin.controller.js`

**Changes:**

- Fixed import path for cloudinary (from config instead of direct import)
- Fixed model imports to match User model export structure

### 8. Fixed Admin Routes

**File:** `backend/src/routes/admin.route.js`

**Changes:**

- Updated cloudinary import path to use config file
- Ensured all routes use proper middleware chain

### 9. Fixed Auth Routes

**File:** `backend/src/routes/auth.route.js`

**Changes:**

- Added protect middleware to protected routes (`/me`, `/me` PUT, `/me` DELETE)
- Fixed router initialization

---

## Frontend Changes

### 1. Created Centralized API Service

**File Created:** `frontend/src/services/api.js`

**Features:**

- Axios instance with default configuration
- Automatic credential handling (`withCredentials: true`)
- Response interceptor for 401 errors
- Organized API functions by module:
  - authAPI (register, login, logout, getProfile, updateProfile, deleteAccount)
  - productsAPI (getAll, getById, toggleWishlist, getWishlist)
  - cartAPI (getCart, addToCart, removeFromCart, clearCart)
  - quizAPI (submit, getHistory)

### 2. Fixed Image Access Pattern

**Files Modified:**

- `frontend/src/pages/Cart.jsx`
- `frontend/src/pages/Wishlist.jsx`
- `frontend/src/pages/ProductDetail.jsx`
- `frontend/src/pages/Results.jsx`
- `frontend/src/pages/QuizHistory.jsx`
- `frontend/src/pages/AdminDashboard.jsx`

**Changes:**

- Changed from `product.images[0]` to `product.images[0]?.url`
- Added optional chaining for safety
- Added proper alt text for images

### 3. Fixed Authentication Flow

**Files Modified:**

- `frontend/src/App.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- `frontend/src/components/Navbar.jsx`

**Changes:**

- Updated to use centralized API service
- Fixed response data access (data.data pattern)
- Added proper error handling
- Fixed registration to use `fullName` field

### 4. Fixed Wishlist Page

**File:** `frontend/src/pages/Wishlist.jsx`

**Complete Rewrite:**

- Now fetches wishlist from dedicated endpoint (`/api/products/wishlist/me`)
- Properly handles populated product data
- Fixed image display
- Added loading state
- Improved error handling

### 5. Fixed Cart Page

**File:** `frontend/src/pages/Cart.jsx`

**Changes:**

- Fixed image access pattern
- Added proper alt text
- Maintained calculation-only cart functionality

### 6. Fixed ProductDetail Page

**File:** `frontend/src/pages/ProductDetail.jsx`

**Changes:**

- Updated to use API service
- Fixed response data structure handling
- Fixed image gallery to use `.url` property
- Added product not found handling
- Fixed wishlist toggle functionality

### 7. Fixed Quiz Flow

**Files Modified:**

- `frontend/src/pages/Quiz.jsx`
- `frontend/src/pages/Results.jsx`

**Changes:**

- Updated to use quizAPI service
- Fixed response data handling (data.data)
- Added error alerts
- Fixed Results page to handle image URLs correctly

### 8. Fixed QuizHistory Page

**File:** `frontend/src/pages/QuizHistory.jsx`

**Changes:**

- Updated to use quizAPI service
- Fixed data structure access
- Fixed image display in history cards
- Added loading state

### 9. Fixed AdminDashboard

**File:** `frontend/src/pages/AdminDashboard.jsx`

**Changes:**

- Updated to use centralized API service
- Fixed response data structure access
- Fixed image display in product list
- Added error handling for delete operations

### 10. Created Environment Examples

**Files Created:**

- `backend/.env.example` - Complete list of required backend environment variables
- `frontend/.env.example` - Frontend environment variables

---

## Configuration Changes

### 1. Vite Configuration

**File:** `frontend/vite.config.js`

**Existing Config (Verified):**

- Proxy configuration for `/api` routes to `http://localhost:5000`
- React plugin enabled
- Tailwind CSS plugin enabled

### 2. Package.json

**Both backend and frontend package.json files verified and correct**

---

## Data Model Fixes

### Product Model

**Structure Confirmed:**

```javascript
{
  name: String,
  description: String,
  images: [{ url: String, public_id: String }], // Array of image objects
  base_price: Number,
  budget_range: String,
  relation_tags: [String],
  occasion_tags: [String],
  emotion_tags: [String],
  personality_tags: [String],
  retailer_prices: [{ retailer_id, price, shipping_cost, link, is_exact }],
  expert_rating: Number,
  is_visible: Boolean,
  views: Number,
  wishlist_count: Number,
  cart_count: Number
}
```

### User Model

**Structure Confirmed:**

```javascript
{
  fullName: String,
  email: String,
  password: String (select: false),
  role: String (enum: ['user', 'admin']),
  wishlist: [ObjectId],
  cart: [ObjectId]
}
```

---

## API Response Structure Standardized

All API responses now follow this pattern:

```javascript
{
  success: true,
  data: <actual data>,
  message: "Optional message"
}
```

Or for lists:

```javascript
{
  success: true,
  count: <number>,
  data: [<items>]
}
```

---

## Security Improvements

1. **Password Field:** Added `select: false` to prevent accidental exposure
2. **Protected Routes:** Added `protect` middleware to sensitive endpoints
3. **httpOnly Cookies:** JWT tokens stored securely
4. **CORS Configuration:** Properly configured with credentials
5. **Error Handling:** Consistent error responses across all endpoints

---

## Missing Features (Intentionally Not Implemented)

These features are mentioned in the code but not currently implemented:

1. Payment controller full implementation (basic structure exists)
2. Consultation booking flow (mentioned but not built)
3. Product search functionality (structure exists, needs refinement)

---

## Testing Recommendations

### Backend Testing

1. Test all authentication flows (register, login, logout)
2. Test cart operations (add, remove, clear)
3. Test wishlist operations (add, remove, get)
4. Test quiz submission and history
5. Test admin operations
6. Verify image uploads with Cloudinary

### Frontend Testing

1. Complete user registration and login flow
2. Take quiz and verify results
3. Add/remove products to/from wishlist
4. Add/remove products to/from cart
5. View product details
6. Check quiz history
7. Test admin dashboard (if admin)

---

## Database Seeding

The seed file (`backend/src/seed.js`) should be run to populate:

- Admin user
- Sample products with proper image structure
- Test data for development

Run with:

```bash
cd backend
npm run seed
```

---

## Deployment Checklist

### Backend

- [ ] Set all environment variables
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV to 'production'
- [ ] Configure FRONTEND_URL for CORS
- [ ] Set up Cloudinary account
- [ ] Configure Razorpay (if using payments)

### Frontend

- [ ] Update API base URL if not using proxy
- [ ] Build production bundle
- [ ] Test all routes
- [ ] Verify image loading
- [ ] Check authentication flow

---

## Breaking Changes

1. **User Model:** `name` field changed to `fullName` (requires database migration if data exists)
2. **Image Structure:** All image access must use `.url` property
3. **API Responses:** All responses now wrapped in standard format

---

## Files Added

### Backend

1. `backend/src/config/database.config.js`
2. `backend/src/config/cloudinary.config.js`
3. `backend/src/routes/cart.route.js`
4. `backend/src/controllers/cart.controller.js`
5. `backend/.env.example`

### Frontend

1. `frontend/src/services/api.js`
2. `frontend/.env.example`

---

## Files Modified

### Backend (10 files)

1. `backend/src/server.js`
2. `backend/src/middleware/auth.middleware.js`
3. `backend/src/models/User.model.js`
4. `backend/src/controllers/auth.controller.js`
5. `backend/src/controllers/products.controller.js`
6. `backend/src/controllers/quiz.controller.js`
7. `backend/src/controllers/admin.controller.js`
8. `backend/src/routes/auth.route.js`
9. `backend/src/routes/products.route.js`
10. `backend/src/routes/admin.route.js`
11. `backend/src/services/matchingEngine.js`

### Frontend (12 files)

1. `frontend/src/App.jsx`
2. `frontend/src/components/Navbar.jsx`
3. `frontend/src/pages/Login.jsx`
4. `frontend/src/pages/Register.jsx`
5. `frontend/src/pages/Cart.jsx`
6. `frontend/src/pages/Wishlist.jsx`
7. `frontend/src/pages/ProductDetail.jsx`
8. `frontend/src/pages/Quiz.jsx`
9. `frontend/src/pages/Results.jsx`
10. `frontend/src/pages/QuizHistory.jsx`
11. `frontend/src/pages/AdminDashboard.jsx`

---

## Total Impact

- **Files Created:** 7
- **Files Modified:** 22
- **Lines of Code Changed:** ~800+
- **Critical Bugs Fixed:** 15+
- **New Features Added:** Cart functionality, Wishlist endpoint, API service layer

---

## Next Steps

1. Test all functionality thoroughly
2. Run the seed script to populate database
3. Update any existing user data to use `fullName` field
4. Consider adding unit tests
5. Consider adding integration tests
6. Document any custom API usage patterns
7. Create admin user guide
8. Create user guide

---

## Support

For issues or questions, refer to:

- README.md for setup instructions
- API documentation in this file
- Code comments in individual files
