import express from "express";
import {
  getServices,
  getServiceByCategory,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/category/:category", getServiceByCategory);
router.post("/", protect, admin, createService);
router.patch("/:id", protect, admin, updateService);
router.delete("/:id", protect, admin, deleteService);

export default router;
