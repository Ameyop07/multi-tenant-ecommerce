import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-intent", protect, authorize("customer"), createPaymentIntent);
// Note: the raw webhook route is mounted separately in server.js
// because Stripe requires the unparsed request body for signature verification.

export default router;
