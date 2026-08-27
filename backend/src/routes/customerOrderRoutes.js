import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);

export default router;
