import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc    Create a product under the vendor's store
// @route   POST /api/stores/:storeId/products
// @access  Private/Vendor (own store only — enforced by middleware)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, basePrice, stock, variants } = req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];

  const product = await Product.create({
    store: req.params.storeId,
    name,
    description,
    category,
    basePrice,
    stock,
    variants: variants ? JSON.parse(variants) : [],
    images,
  });

  res.status(201).json(product);
});

// @desc    List products for a store (public, paginated, filterable)
// @route   GET /api/stores/:storeId/products
// @access  Public
export const getStoreProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, minPrice, maxPrice } = req.query;

  const filter = { store: req.params.storeId, isActive: true };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  if (minPrice || maxPrice) {
    filter.basePrice = {};
    if (minPrice) filter.basePrice.$gte = Number(minPrice);
    if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort("-createdAt");

  const total = await Product.countDocuments(filter);

  res.json({ products, page: Number(page), pages: Math.ceil(total / limit), total });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("store", "name slug");
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc    Update product (own store only)
// @route   PUT /api/stores/:storeId/products/:id
// @access  Private/Vendor
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, store: req.params.storeId });
  if (!product) {
    res.status(404);
    throw new Error("Product not found in this store");
  }

  const updatable = ["name", "description", "category", "basePrice", "stock", "isActive"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });
  if (req.body.variants) product.variants = JSON.parse(req.body.variants);
  if (req.files?.length) product.images.push(...req.files.map((f) => f.path));

  await product.save();
  res.json(product);
});

// @desc    Delete product (own store only)
// @route   DELETE /api/stores/:storeId/products/:id
// @access  Private/Vendor
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, store: req.params.storeId });
  if (!product) {
    res.status(404);
    throw new Error("Product not found in this store");
  }
  res.json({ message: "Product removed" });
});
