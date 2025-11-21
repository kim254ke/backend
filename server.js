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

// --- Connect to Database and Start Server ---
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

  // CORS Configuration
  const allowedOrigins = [
    "https://client-s58d.onrender.com", // Your Render frontend
    "http://localhost:3000",
    "http://localhost:5173", 
    process.env.CLIENT_URL,
  ].filter(Boolean); // Removes undefined/null entries

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

  // Health check route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'BeautyBook API is running! 💅✨',
      status: 'active',
      endpoints: {
        services: '/api/services',
        stylists: '/api/stylists',
        bookings: '/api/bookings',
        auth: '/api/auth',
        user: '/api/user'
      }
    });
  });

  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Route not found',
      path: req.path,
      method: req.method
    });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Allowed origins: ${allowedOrigins.join(', ')}`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();