import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import {
  createProduct,
  getStoreProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, authorize, enforceStoreOwnership } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true }); // needs :storeId from parent
const upload = multer({ storage });

router
  .route("/")
  .get(getStoreProducts)
  .post(
    protect,
    authorize("vendor"),
    enforceStoreOwnership,
    upload.array("images", 5),
    createProduct
  );

router
  .route("/:id")
  .put(protect, authorize("vendor"), enforceStoreOwnership, upload.array("images", 5), updateProduct)
  .delete(protect, authorize("vendor"), enforceStoreOwnership, deleteProduct);

export default router;
