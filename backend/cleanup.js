import Product from './src/models/Product.model.js';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cloudinary from './src/config/cloudinary.config.js'; // Adjust path

const cleanup = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    // 1. Get all public_ids from MongoDB
    const products = await Product.find().select('images');
    const validPublicIds = new Set(products.flatMap(p => p.images.map(img => img.public_id)));

    // 2. Get all images from your Cloudinary folder
    const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'tohfey-products/', // Your folder name
        max_results: 500
    });

    // 3. Find and Delete Orphans
    const orphans = resources
        .filter(res => !validPublicIds.has(res.public_id))
        .map(res => res.public_id);

    if (orphans.length > 0) {
        console.log(`Deleting ${orphans.length} orphaned images...`);
        await cloudinary.api.delete_resources(orphans);
    } else {
        console.log("No orphaned images found!");
    }

    process.exit();
};

cleanup();