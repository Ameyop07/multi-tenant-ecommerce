import express from "express";
import {
  createStore,
  getStores,
  getStoreBySlug,
  getMyStore,
  updateStore,
  getAllStoresAdmin,
  updateStoreStatus,
} from "../controllers/storeController.js";
import { protect, authorize, enforceStoreOwnership } from "../middleware/auth.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import { getStoreAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

// Nested resource routers (tenant-scoped)
router.use("/:storeId/products", productRoutes);
router.use("/:storeId/orders", orderRoutes);

router.get("/admin/all", protect, authorize("super_admin"), getAllStoresAdmin);
router.patch("/admin/:storeId/status", protect, authorize("super_admin"), updateStoreStatus);

router.get("/", getStores);
// Must be declared before "/:slug", otherwise the slug handler swallows "mine".
router.get("/mine", protect, authorize("vendor", "super_admin"), getMyStore);
router.get("/:slug", getStoreBySlug);
router.post("/", protect, authorize("vendor"), createStore);
router.put("/:storeId", protect, authorize("vendor", "super_admin"), enforceStoreOwnership, updateStore);
router.get("/:storeId/analytics", protect, authorize("vendor", "super_admin"), enforceStoreOwnership, getStoreAnalytics);

export default router;
