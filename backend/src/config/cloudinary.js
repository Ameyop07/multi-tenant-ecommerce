import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tenant-aware storage: every uploaded image is namespaced under the
// vendor's storeId so assets never collide across tenants.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `multitenant-ecommerce/${req.params.storeId || "misc"}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  }),
});

export { cloudinary, storage };
