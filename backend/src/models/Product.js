import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "Size: M / Color: Black"
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Every product is scoped to a store (tenant). All queries in the
    // controller layer filter by this field to guarantee tenant isolation.
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    basePrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ store: 1, category: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
