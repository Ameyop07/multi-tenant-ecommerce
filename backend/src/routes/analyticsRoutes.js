import express from "express";
import { getPlatformAnalytics } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("super_admin"), getPlatformAnalytics);

export default router;
