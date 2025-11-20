import express from "express";
import {
  getStylists,
  getStylistById,
  createStylist,
  updateStylist,
} from "../controllers/stylistController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStylists);
router.get("/:id", getStylistById);
router.post("/", protect, admin, createStylist);
router.patch("/:id", protect, admin, updateStylist);

export default router;
