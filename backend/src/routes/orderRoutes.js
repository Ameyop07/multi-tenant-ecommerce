import express from "express";
import {
  createOrder,
  getMyOrders,
  getStoreOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, authorize, enforceStoreOwnership } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

// Vendor: view/manage orders for their store
router.get("/", protect, authorize("vendor", "super_admin"), enforceStoreOwnership, getStoreOrders);
router.patch("/:id/status", protect, authorize("vendor", "super_admin"), enforceStoreOwnership, updateOrderStatus);

export default router;
