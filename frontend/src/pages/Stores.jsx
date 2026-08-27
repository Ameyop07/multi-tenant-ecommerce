import { useEffect, useMemo, useState } from "react";
import { Search, Store as StoreIcon, TriangleAlert, X } from "lucide-react";
import api from "../api/axios.js";
import StoreCard from "../components/StoreCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { StoreCardSkeleton } from "../components/ui/Skeleton.jsx";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get("/stores")
      .then((res) => {
        if (active) setStores(res.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Could not load stores");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // The directory is small enough to filter client-side; no endpoint needed.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
    );
  }, [stores, query]);

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-800 text-ink">Browse stores</h1>
          <p className="mt-1.5 text-ink/60">
            {loading
              ? "Loading the vendor directory…"
              : `${stores.length} independent ${stores.length === 1 ? "vendor" : "vendors"} selling on the platform.`}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor="store-search" className="sr-only">
            Search stores
          </label>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
          />
          <input
            id="store-search"
            type="search"
            placeholder="Search stores…"
            className="input pl-10 pr-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink/40 transition hover:bg-surface-sunken hover:text-ink/70"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <StoreCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={TriangleAlert}
            tone="error"
            title="Couldn't load stores"
            description={error}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={StoreIcon}
            title={query ? "No stores match your search" : "No approved stores yet"}
            description={
              query
                ? `Nothing found for “${query}”. Try a different term.`
                : "Vendor stores appear here once an admin approves them. Check back soon."
            }
            {...(query
              ? { actionLabel: "Clear search", onAction: () => setQuery("") }
              : { actionLabel: "Become a vendor", actionTo: "/register" })}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
