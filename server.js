import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketIO } from "./socketHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import stylistRoutes from "./routes/stylistRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables from .env file
dotenv.config();

// --- Connect to Database ---
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }

  const app = express();
  const httpServer = createServer(app);

  // Setup Socket.IO
  setupSocketIO(httpServer);

  // --- Middleware ---

  // *** UPDATED CORS CONFIGURATION ***
  app.use(cors({
    // Make sure you set `CLIENT_URL` in your Render Environment variables.
    // The fallback is updated to your new frontend URL.
    origin: process.env.CLIENT_URL || "https://client-ol8mqahul-kim254kes-projects.vercel.app",
    credentials: true
  }));

  app.use(express.json());

  // Serve uploaded files from the 'uploads' directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // --- API Routes ---
  app.use("/api/auth", authRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/stylists", stylistRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/user", userRoutes);

  // Test route
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
};

// Start the server
startServer();