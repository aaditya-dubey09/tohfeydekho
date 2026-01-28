import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAnalytics,
  getAllConsultations,
  deleteProductImage
} from '../controllers/admin.controller.js';
import { upload } from '../config/cloudinary.config.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(admin);

// Product Routes
// router.post('/products', upload.array('images', 5), createProduct);
// Temporary middleware to handle multer errors
router.post('/products', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      console.error("DETAILED CLOUDINARY ERROR:", JSON.stringify(err, null, 2));
      return res.status(500).json({ success: false, message: err.message, detail: err });
    }
    next();
  });
}, createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);

// Route to delete just one image from a product gallery
router.delete('/products/:id/image/:public_id', deleteProductImage);

// Analytics & Data Routes
router.get('/analytics', getAnalytics);
router.get('/consultations', getAllConsultations);

export default router;