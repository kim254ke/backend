import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import User from "../models/User.js"; // Adjust path to your User model

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads", "avatars");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Upload avatar - IMPORTANT: This route MUST be /user/avatar/:userId to match frontend
router.put("/user/avatar/:userId", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.params.userId;

    // Delete old avatar file if exists
    const user = await User.findById(userId);
    if (user && user.avatar && !user.avatar.startsWith('http')) {
      const oldAvatarPath = path.join(__dirname, "..", user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Store relative path in database (not full URL)
    // This makes it environment-agnostic
    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      message: "Avatar uploaded successfully",
      avatar: avatarPath,
      user: updatedUser
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ 
      message: "Failed to upload avatar",
      error: error.message 
    });
  }
});

// Update user profile - IMPORTANT: This route MUST be /user/profile/:userId to match frontend
router.put("/user/profile/:userId", async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const userId = req.params.userId;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name: name.trim(), 
        phone: phone?.trim() || "", 
        location: location?.trim() || "" 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      message: "Failed to update profile",
      error: error.message 
    });
  }
});

// Get user profile
router.get("/user/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      message: "Failed to fetch profile",
      error: error.message 
    });
  }
});

export default router;