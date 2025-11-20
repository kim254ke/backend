import express from "express";
import multer from "multer";
import fs from "fs";
import User from "../models/User.js";
import { updateUserProfile, getUserProfile } from "../controllers/profileController.js"



const router = express.Router();

// Multer setup for storing avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/avatars";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Update user avatar
router.put("/avatar/:userId", upload.single("avatar"), async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // ✅ Create the FULL URL that the frontend can access
    const avatarUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl }, // ✅ Store full URL in database
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Avatar saved:", avatarUrl); // Debug log

    res.json({ 
      avatar: avatarUrl,
      message: "Avatar updated successfully" 
    });
  } catch (err) {
    console.error("❌ Avatar upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//routes to update and get user profile
router.put("/profile/:id", updateUserProfile);
router.get("/profile/:id", getUserProfile);




export default router;