import mongoose from 'mongoose';
import { User } from './models/User.model.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tohfey');

    // Converting comma-separated strings from .env into actual arrays
    const names = process.env.ADMIN_NAMES.split(',').map(s => s.trim());
    const emails = process.env.ADMIN_EMAILS.split(',').map(s => s.trim());
    const passwords = process.env.ADMIN_PASSWORDS.split(',').map(s => s.trim());

    const newAdmins = names.map((name, index) => ({
      fullName: name,
      email: emails[index],
      password: passwords[index], // This MUST match the index
      role: 'admin'
    }));

    const addAdmins = async (adminList) => {
      for (const adminData of adminList) {
        let user = await User.findOne({ email: adminData.email });

        if (user) {
          console.log(`Updating existing admin: ${adminData.email}`);
          user.fullName = adminData.fullName;
          user.password = adminData.password;
          await user.save(); // Middleware triggers here
        } else {
          console.log(`Creating new admin: ${adminData.email}`);
          await User.create(adminData); // Middleware triggers here
        }
      }
    };

    await addAdmins(newAdmins);
    console.log('Seed completed successfully');
    process.exit();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
