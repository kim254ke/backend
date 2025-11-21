// cleanupAvatars.js - Run this ONCE to fix your database
// Place this file in your backend root directory (same level as server.js)
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const cleanupAvatars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Find all users with localhost avatars
    const usersWithBadAvatars = await User.find({
      avatar: { $regex: 'localhost' }
    });

    console.log(`Found ${usersWithBadAvatars.length} users with localhost avatars`);

    // Update each user
    for (const user of usersWithBadAvatars) {
      // Extract just the filename from the bad URL
      const filename = user.avatar.split('/').pop();
      const newAvatarPath = `/uploads/avatars/${filename}`;
      
      await User.findByIdAndUpdate(user._id, {
        avatar: newAvatarPath
      });
      
      console.log(`✅ Updated ${user.email}: ${user.avatar} → ${newAvatarPath}`);
    }

    // Also clear any users with full http:// or https:// URLs
    const usersWithFullUrls = await User.find({
      avatar: { $regex: '^http' }
    });

    console.log(`Found ${usersWithFullUrls.length} users with full URL avatars`);

    for (const user of usersWithFullUrls) {
      const filename = user.avatar.split('/').pop();
      const newAvatarPath = `/uploads/avatars/${filename}`;
      
      await User.findByIdAndUpdate(user._id, {
        avatar: newAvatarPath
      });
      
      console.log(`✅ Updated ${user.email}: ${user.avatar} → ${newAvatarPath}`);
    }

    console.log('🎉 Cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
};

cleanupAvatars();