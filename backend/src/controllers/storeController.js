import asyncHandler from "express-async-handler";
import Store from "../models/Store.js";
import User from "../models/User.js";

// Builds a URL-safe slug that's guaranteed not to collide with an existing
// store (the `slug` field is uniquely indexed). `excludeId` lets a store keep
// its own slug when it's being renamed.
const buildUniqueSlug = async (name, excludeId = null) => {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "store";

  let slug = base;
  let suffix = 2;
  while (true) {
    const clash = await Store.findOne({ slug }).select("_id").lean();
    if (!clash || (excludeId && String(clash._id) === String(excludeId))) return slug;
    slug = `${base}-${suffix++}`;
  }
};

// @desc    Vendor creates their store (pending approval)
// @route   POST /api/stores
// @access  Private/Vendor
export const createStore = asyncHandler(async (req, res) => {
  if (req.user.store) {
    res.status(400);
    throw new Error("You already have a store registered");
  }

  const { name, description, contactEmail } = req.body;
  const slug = await buildUniqueSlug(name);

  const store = await Store.create({
    name,
    slug,
    description,
    contactEmail,
    owner: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { store: store._id });

  res.status(201).json(store);
});

// @desc    List all approved stores (public storefront directory)
// @route   GET /api/stores
// @access  Public
export const getStores = asyncHandler(async (req, res) => {
  const stores = await Store.find({ status: "approved" }).select(
    "name slug logo banner description"
  );
  res.json(stores);
});

// @desc    Get a single store by slug
// @route   GET /api/stores/:slug
// @access  Public
export const getStoreBySlug = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug, status: "approved" });
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.json(store);
});

// @desc    Vendor reads their own store (any status — pending stores included,
//          which the public slug route deliberately hides)
// @route   GET /api/stores/mine
// @access  Private/Vendor
export const getMyStore = asyncHandler(async (req, res) => {
  if (!req.user.store) {
    res.status(404);
    throw new Error("You have not set up a store yet");
  }

  const store = await Store.findById(req.user.store);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.json(store);
});

// @desc    Vendor updates own store profile
// @route   PUT /api/stores/:storeId
// @access  Private/Vendor
export const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.storeId);
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }

  // Only assign fields the client actually sent — a blanket Object.assign would
  // overwrite existing values with `undefined` on a partial update.
  const updatable = ["name", "description", "logo", "banner", "contactEmail"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) store[field] = req.body[field];
  });

  // Keep the public URL in sync when the store is renamed.
  if (req.body.name !== undefined) {
    store.slug = await buildUniqueSlug(req.body.name, store._id);
  }

  await store.save();
  res.json(store);
});

// @desc    Super admin: list all stores (any status)
// @route   GET /api/stores/admin/all
// @access  Private/SuperAdmin
export const getAllStoresAdmin = asyncHandler(async (req, res) => {
  const stores = await Store.find().populate("owner", "name email");
  res.json(stores);
});

// @desc    Super admin: approve or suspend a store
// @route   PATCH /api/stores/admin/:storeId/status
// @access  Private/SuperAdmin
export const updateStoreStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "approved" | "suspended" | "pending"
  const store = await Store.findByIdAndUpdate(
    req.params.storeId,
    { status },
    { new: true }
  );
  if (!store) {
    res.status(404);
    throw new Error("Store not found");
  }
  res.json(store);
});
