import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/multitenant_ecommerce?directConnection=true";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("Cleared existing collections.");

    // 1. Create Super Admin
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: "password123",
      role: "super_admin",
    });

    // 2. Create Customer User
    const customerUser = await User.create({
      name: "Jane Customer",
      email: "customer@example.com",
      password: "password123",
      role: "customer",
    });

    // 3. Create Vendor 1 & Store
    const vendor1User = await User.create({
      name: "Alex Athletics Owner",
      email: "vendor1@example.com",
      password: "password123",
      role: "vendor",
    });

    const store1 = await Store.create({
      name: "Apex Athletics",
      slug: "apex-athletics",
      description: "High-performance sports apparel, footwear, and activewear accessories for athletes.",
      logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      banner: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200",
      owner: vendor1User._id,
      status: "approved",
      contactEmail: "support@apexathletics.com",
    });

    vendor1User.store = store1._id;
    await vendor1User.save();

    // 4. Create Vendor 2 & Store
    const vendor2User = await User.create({
      name: "Sarah Tech Owner",
      email: "vendor2@example.com",
      password: "password123",
      role: "vendor",
    });

    const store2 = await Store.create({
      name: "Lumina Tech Store",
      slug: "lumina-tech",
      description: "Modern minimalist gadgets, smart office electronics, and desk setups.",
      logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      banner: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200",
      owner: vendor2User._id,
      status: "approved",
      contactEmail: "support@luminatech.com",
    });

    vendor2User.store = store2._id;
    await vendor2User.save();

    // 5. Create Products for Store 1 (Apex Athletics)
    const product1 = await Product.create({
      store: store1._id,
      name: "Ultra-Light Running Shoes",
      description: "Lightweight breathable marathon mesh running shoes with responsive foam cushioning.",
      category: "Footwear",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      ],
      basePrice: 129.99,
      stock: 45,
      ratingsAverage: 4.8,
      ratingsCount: 24,
      variants: [
        { label: "US 9 / Black", sku: "APX-SH-09B", price: 129.99, stock: 20 },
        { label: "US 10 / Black", sku: "APX-SH-10B", price: 129.99, stock: 25 },
      ],
    });

    const product2 = await Product.create({
      store: store1._id,
      name: "Thermal Performance Hoodie",
      description: "Moisture-wicking fleece hoodie built for morning outdoor training.",
      category: "Apparel",
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800"],
      basePrice: 68.00,
      stock: 30,
      ratingsAverage: 4.6,
      ratingsCount: 18,
    });

    // 6. Create Products for Store 2 (Lumina Tech)
    const product3 = await Product.create({
      store: store2._id,
      name: "Pro Wireless ANC Headphones",
      description: "Active noise-cancelling over-ear headphones with 40-hour battery life and high-res audio.",
      category: "Audio",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
      basePrice: 199.99,
      stock: 50,
      ratingsAverage: 4.9,
      ratingsCount: 52,
    });

    const product4 = await Product.create({
      store: store2._id,
      name: "Ergonomic RGB Mechanical Keyboard",
      description: "Compact wireless 75% mechanical keyboard with tactile switches and custom RGB lighting.",
      category: "Peripherals",
      images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"],
      basePrice: 119.50,
      stock: 20,
      ratingsAverage: 4.7,
      ratingsCount: 31,
    });

    // 7. Create Sample Orders
    await Order.create({
      store: store1._id,
      customer: customerUser._id,
      items: [
        {
          product: product1._id,
          name: product1.name,
          variantLabel: "US 10 / Black",
          quantity: 1,
          price: 129.99,
          image: product1.images[0],
        },
      ],
      shippingAddress: {
        fullName: "Jane Customer",
        line1: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        postalCode: "94105",
        country: "USA",
        phone: "555-0199",
      },
      itemsTotal: 129.99,
      shippingFee: 10.00,
      total: 139.99,
      paymentStatus: "paid",
      orderStatus: "shipped",
    });

    console.log("\n=========================================");
    console.log("Database successfully seeded!");
    console.log("=========================================");
    console.log("Accounts created:");
    console.log(" 1. Super Admin: admin@example.com / password123");
    console.log(" 2. Vendor 1:    vendor1@example.com / password123 (Apex Athletics)");
    console.log(" 3. Vendor 2:    vendor2@example.com / password123 (Lumina Tech)");
    console.log(" 4. Customer:    customer@example.com / password123");
    console.log("=========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
