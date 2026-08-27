import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
import StarRating from "./ui/StarRating.jsx";
import { formatMoney } from "../utils/format.js";

export default function ProductCard({ product }) {
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock > 0 && product.stock <= 5;

  return (
    <Link
      to={`/product/${product._id}`}
      className="card card-hover group block overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-sunken">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-brand-300">
            <ImageOff size={22} aria-hidden="true" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="badge badge-danger">Out of stock</span>
          </div>
        )}
        {lowStock && (
          <span className="badge badge-warning absolute left-3 top-3 shadow-soft">
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] font-500 uppercase tracking-wide text-brand-500">
          {product.category}
        </p>
        <h3 className="mt-1 line-clamp-1 font-500 text-ink group-hover:text-brand-700">
          {product.name}
        </h3>

        {product.ratingsCount > 0 && (
          <StarRating
            value={product.ratingsAverage}
            count={product.ratingsCount}
            className="mt-1.5"
          />
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <p className="font-display text-lg font-700 text-brand-600">
            {formatMoney(product.basePrice)}
          </p>
          {product.variants?.length > 0 && (
            <span className="text-xs text-ink/45">
              {product.variants.length} options
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
