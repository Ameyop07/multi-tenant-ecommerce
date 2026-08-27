import { Star } from "lucide-react";

export default function StarRating({ value = 0, count, size = 14, showValue = true, className = "" }) {
  const rounded = Math.round(value * 2) / 2; // nearest half star

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = rounded >= i;
          const half = !filled && rounded >= i - 0.5;

          return (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-brand-200" aria-hidden="true" />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: half ? "50%" : "100%" }}
                  aria-hidden="true"
                >
                  <Star size={size} className="fill-warning-500 text-warning-500" />
                </span>
              )}
            </span>
          );
        })}
      </div>

      {showValue && value > 0 && (
        <span className="text-xs text-ink/60">
          {value.toFixed(1)}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  );
}
