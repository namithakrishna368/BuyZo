/**
 * One-time: mark all existing users as email-verified (dev helper).
 * Run: node scripts/verifyExistingUsers.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await User.updateMany(
    { isEmailVerified: false, role: 'user' },
    { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: 1, emailVerificationExpires: 1 } }
  );
  console.log(`Verified ${result.modifiedCount} user(s).`);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
