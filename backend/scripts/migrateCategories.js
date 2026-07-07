import 'dotenv/config';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import { SHOP_CATEGORIES } from '../constants/categories.js';

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`Categories already exist (${existingCount}). Skipping migration.`);
      process.exit(0);
    }

    const categoriesToInsert = SHOP_CATEGORIES.map(name => ({
      name,
      isActive: true,
    }));

    await Category.insertMany(categoriesToInsert);
    console.log(`Successfully migrated ${categoriesToInsert.length} categories.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

migrateCategories();
