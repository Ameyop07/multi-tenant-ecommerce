import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    contactEmail: { type: String, required: true },
    // Stripe Connect account id — enables per-vendor payouts down the line.
    stripeAccountId: { type: String, default: null },
  },
  { timestamps: true }
);

storeSchema.index({ owner: 1 });

export default mongoose.model("Store", storeSchema);
