import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Store from "../models/Store.js";

// @desc    Vendor analytics — revenue & order volume over time
// @route   GET /api/stores/:storeId/analytics
// @access  Private/Vendor
export const getStoreAnalytics = asyncHandler(async (req, res) => {
  const storeId = req.params.storeId;

  const revenueByDay = await Order.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId), paymentStatus: "paid" } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Order.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId), paymentStatus: "paid" } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        unitsSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  const totals = await Order.aggregate([
    { $match: { store: new mongoose.Types.ObjectId(storeId), paymentStatus: "paid" } },
    { $group: { _id: null, totalRevenue: { $sum: "$total" }, totalOrders: { $sum: 1 } } },
  ]);

  res.json({
    revenueByDay,
    topProducts,
    summary: totals[0] || { totalRevenue: 0, totalOrders: 0 },
  });
});

// @desc    Super admin — platform-wide analytics across all tenants
// @route   GET /api/admin/analytics
// @access  Private/SuperAdmin
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const revenueByStore = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: "$store", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  const storeIds = revenueByStore.map((r) => r._id);
  const stores = await Store.find({ _id: { $in: storeIds } }).select("name");
  const storeMap = Object.fromEntries(stores.map((s) => [s._id.toString(), s.name]));

  const leaderboard = revenueByStore.map((r) => ({
    store: storeMap[r._id.toString()] || "Unknown",
    revenue: r.revenue,
    orders: r.orders,
  }));

  const totalStores = await Store.countDocuments({ status: "approved" });
  const totalOrders = await Order.countDocuments({ paymentStatus: "paid" });

  res.json({ leaderboard, totalStores, totalOrders });
});
