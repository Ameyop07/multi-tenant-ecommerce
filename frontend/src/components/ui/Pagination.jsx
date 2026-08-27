import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, onChange, className = "" }) {
  if (!pages || pages <= 1) return null;

  // Compact window of page numbers around the current page.
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="btn btn-sm btn-outline disabled:opacity-40"
      >
        <ChevronLeft size={14} />
      </button>

      {start > 1 && <span className="px-1 text-sm text-ink/40">…</span>}

      {numbers.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${
            n === page
              ? "bg-brand-500 text-white shadow-soft"
              : "border border-brand-100 bg-white text-ink/70 hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          {n}
        </button>
      ))}

      {end < pages && <span className="px-1 text-sm text-ink/40">…</span>}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className="btn btn-sm btn-outline disabled:opacity-40"
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
