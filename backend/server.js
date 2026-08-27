import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import connectDB from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { stripeWebhook } from "./src/controllers/paymentController.js";

import authRoutes from "./src/routes/authRoutes.js";
import storeRoutes from "./src/routes/storeRoutes.js";
import publicProductRoutes from "./src/routes/publicProductRoutes.js";
import customerOrderRoutes from "./src/routes/customerOrderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Stripe webhook needs the RAW body for signature verification, so it must
// be registered BEFORE express.json() and given its own body parser.
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Basic abuse protection on the whole API
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", publicProductRoutes);
app.use("/api/orders", customerOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
