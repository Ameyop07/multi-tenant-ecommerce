import { Link } from "react-router-dom";
import { ArrowUpRight, Store as StoreIcon } from "lucide-react";

export default function StoreCard({ store }) {
  return (
    <Link to={`/store/${store.slug}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="h-24 bg-gradient-to-br from-brand-400 to-brand-600">
        {store.banner && (
          <img src={store.banner} alt="" loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Pulled up so the logo straddles the banner edge. */}
        <div className="-mt-11 mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-brand-100 font-display text-lg font-700 text-brand-700 shadow-soft">
          {store.logo ? (
            <img src={store.logo} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            store.name?.[0]?.toUpperCase() || <StoreIcon size={20} aria-hidden="true" />
          )}
        </div>

        <h3 className="font-display font-700 text-ink transition group-hover:text-brand-700">
          {store.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink/60">
          {store.description || "No description yet."}
        </p>

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
          Visit store
          <ArrowUpRight
            size={15}
            className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
