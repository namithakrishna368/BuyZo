import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = process.env.ADMIN_EMAIL || 'admin@buyzo.com';
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        existing.isEmailVerified = true;
        await existing.save();
        console.log('Existing user promoted to admin.');
      } else {
        console.log('Admin already exists.');
      }
      process.exit(0);
    }

    await User.create({
      name: process.env.ADMIN_NAME || 'BuyZO Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      isEmailVerified: true,
      profileComplete: true,
    });

    console.log(`Admin created: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
