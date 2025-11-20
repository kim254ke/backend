import express from "express";
import {
  getBookings,
  getUserBookings,
  createBooking,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getBookings);
router.get("/user/:userId", protect, getUserBookings);
router.post("/", protect, createBooking);
router.patch("/:id", protect, updateBooking);
router.delete("/:id", protect, cancelBooking);

export default router;
