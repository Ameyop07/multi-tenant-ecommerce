import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Customer creates an order after successful Stripe payment
// @route   POST /api/orders
// @access  Private/Customer
// NOTE: In production this is normally called internally after the Stripe
// webhook confirms payment (see paymentController). Exposed here as a
// direct route too, for orders that don't require online payment.
export const createOrder = asyncHandler(async (req, res) => {
  const { store, items, shippingAddress, stripePaymentIntentId } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  // Recompute totals server-side — never trust client-submitted prices.
  let itemsTotal = 0;
  const verifiedItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.store.toString() !== store) {
      res.status(400);
      throw new Error(`Invalid product in cart: ${item.product}`);
    }
    const price = item.variantLabel
      ? product.variants.find((v) => v.label === item.variantLabel)?.price ?? product.basePrice
      : product.basePrice;

    itemsTotal += price * item.quantity;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      variantLabel: item.variantLabel || null,
      quantity: item.quantity,
      price,
      image: product.images[0] || "",
    });
  }

  const shippingFee = itemsTotal > 100 ? 0 : 9.99;
  const total = itemsTotal + shippingFee;

  const order = await Order.create({
    store,
    customer: req.user._id,
    items: verifiedItems,
    shippingAddress,
    itemsTotal,
    shippingFee,
    total,
    stripePaymentIntentId: stripePaymentIntentId || null,
    paymentStatus: stripePaymentIntentId ? "paid" : "pending",
  });

  res.status(201).json(order);
});

// @desc    Get logged-in customer's own orders
// @route   GET /api/orders/my
// @access  Private/Customer
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort("-createdAt");
  res.json(orders);
});

// @desc    Vendor views orders placed in their store
// @route   GET /api/stores/:storeId/orders
// @access  Private/Vendor
export const getStoreOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { store: req.params.storeId };
  if (status) filter.orderStatus = status;

  const orders = await Order.find(filter).populate("customer", "name email").sort("-createdAt");
  res.json(orders);
});

// @desc    Vendor updates order fulfillment status
// @route   PATCH /api/stores/:storeId/orders/:id/status
// @access  Private/Vendor
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, store: req.params.storeId });
  if (!order) {
    res.status(404);
    throw new Error("Order not found in this store");
  }
  order.orderStatus = req.body.orderStatus;
  await order.save();
  res.json(order);
});
