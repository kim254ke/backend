import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

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

// Upload avatar
router.put("/avatar/:userId", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Construct the avatar URL
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

    // Here you would update the user in your database
    // Example: await User.findByIdAndUpdate(req.params.userId, { avatar: avatarUrl });

    res.json({ 
      message: "Avatar uploaded successfully",
      avatar: avatarUrl 
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    // Here you would update the user in your database
    // Example: 
    // const user = await User.findByIdAndUpdate(
    //   req.params.userId,
    //   { name, phone, location },
    //   { new: true }
    // );

    // For now, return the updated data
    res.json({
      _id: req.params.userId,
      name,
      phone,
      location,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;