import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Verifies the JWT and attaches the authenticated user to req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error("Not authorized, user no longer active");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

// Role-based access control — usage: authorize("super_admin", "vendor")
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    throw new Error(`Role '${req.user?.role}' is not permitted to perform this action`);
  }
  next();
};

// Ensures a vendor can only act on their own store (tenant isolation guard)
export const enforceStoreOwnership = asyncHandler(async (req, res, next) => {
  if (req.user.role === "super_admin") return next();

  const storeId = req.params.storeId || req.body.store;
  if (!storeId || String(req.user.store) !== String(storeId)) {
    res.status(403);
    throw new Error("You do not have access to this store's resources");
  }
  next();
});
