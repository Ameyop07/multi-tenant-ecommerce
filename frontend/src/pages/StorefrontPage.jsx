import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PackageSearch, Search, SlidersHorizontal, Store as StoreIcon, TriangleAlert, X } from "lucide-react";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import { ProductCardSkeleton } from "../components/ui/Skeleton.jsx";

const PER_PAGE = 12;

export default function StorefrontPage() {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [storeState, setStoreState] = useState("loading"); // loading | ready | missing | error

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filter state. `searchInput` is what the user types; `search` is the
  // debounced value actually sent to the server.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceDraft, setPriceDraft] = useState({ min: "", max: "" });
  const [price, setPrice] = useState({ min: "", max: "" });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  // Bumped to force a refetch — setting identical filter state wouldn't.
  const [reloadKey, setReloadKey] = useState(0);

  const storeId = store?._id;

  // ---- Load the store ----
  useEffect(() => {
    let active = true;
    setStoreState("loading");

    api
      .get(`/stores/${slug}`)
      .then((res) => {
        if (!active) return;
        setStore(res.data);
        setStoreState("ready");
      })
      .catch((err) => {
        if (!active) return;
        setStoreState(err.response?.status === 404 ? "missing" : "error");
      });

    return () => {
      active = false;
    };
  }, [slug]);

  // ---- Debounce the search box ----
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ---- Collect the category list once, unfiltered ----
  useEffect(() => {
    if (!storeId) return;
    let active = true;

    api
      .get(`/stores/${storeId}/products`, { params: { limit: 100 } })
      .then((res) => {
        if (!active) return;
        const unique = [...new Set((res.data.products || []).map((p) => p.category).filter(Boolean))];
        setCategories(unique.sort());
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [storeId]);

  // ---- Load the (filtered, paginated) product list ----
  useEffect(() => {
    if (!storeId) return;
    let active = true;

    setProductsLoading(true);
    setProductsError(null);

    api
      .get(`/stores/${storeId}/products`, {
        params: {
          page,
          limit: PER_PAGE,
          ...(search ? { search } : {}),
          ...(category ? { category } : {}),
          ...(price.min !== "" ? { minPrice: price.min } : {}),
          ...(price.max !== "" ? { maxPrice: price.max } : {}),
        },
      })
      .then((res) => {
        if (!active) return;
        setProducts(res.data.products || []);
        setMeta({ page: res.data.page || 1, pages: res.data.pages || 1, total: res.data.total || 0 });
      })
      .catch((err) => {
        if (!active) return;
        setProductsError(err.response?.data?.message || "Could not load products");
        setProducts([]);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storeId, page, search, category, price, reloadKey]);

  const filtersActive = Boolean(search || category || price.min !== "" || price.max !== "");

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setPriceDraft({ min: "", max: "" });
    setPrice({ min: "", max: "" });
    setPage(1);
  };

  const applyPrice = (e) => {
    e.preventDefault();
    setPrice(priceDraft);
    setPage(1);
  };

  const initial = useMemo(() => store?.name?.[0]?.toUpperCase() || "", [store]);

  // ---- Store-level loading / error states ----
  if (storeState === "loading") {
    return (
      <div>
        <div className="border-b border-brand-100 bg-white">
          <div className="container-page py-12">
            <div className="skeleton h-16 w-16 rounded-2xl" />
            <div className="skeleton mt-4 h-8 w-56" />
            <div className="skeleton mt-3 h-4 w-full max-w-md" />
          </div>
        </div>
        <div className="container-page py-10">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (storeState !== "ready") {
    const missing = storeState === "missing";
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={missing ? StoreIcon : TriangleAlert}
          tone={missing ? "neutral" : "error"}
          title={missing ? "Store not found" : "Couldn't load this store"}
          description={
            missing
              ? "This store doesn't exist, or it hasn't been approved yet. Approved stores appear in the directory."
              : "Something went wrong reaching the server. Please try again."
          }
          actionLabel={missing ? "Browse all stores" : "Try again"}
          {...(missing
            ? { actionTo: "/stores" }
            : { onAction: () => window.location.reload() })}
        />
      </div>
    );
  }

  return (
    <div>
      {/* ---- Store header ---- */}
      <header className="border-b border-brand-100 bg-white">
        {store.banner ? (
          <div className="h-36 w-full overflow-hidden sm:h-48">
            <img src={store.banner} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-24 w-full bg-gradient-to-br from-brand-400 to-brand-700 sm:h-28" />
        )}

        <div className="container-page pb-8">
          <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-brand-100 font-display text-2xl font-800 text-brand-700 shadow-card">
            {store.logo ? (
              <img src={store.logo} alt="" className="h-full w-full object-cover" />
            ) : (
              initial || <StoreIcon size={28} aria-hidden="true" />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-800 text-ink">{store.name}</h1>
            <Badge status={store.status} />
          </div>
          {store.description && (
            <p className="mt-2 max-w-2xl text-ink/65">{store.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/55">
            <Link to="/stores" className="link">
              All stores
            </Link>
            {store.contactEmail && (
              <a href={`mailto:${store.contactEmail}`} className="link">
                {store.contactEmail}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ---- Filters + products ---- */}
      <div className="container-page py-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <label htmlFor="product-search" className="sr-only">
              Search products in this store
            </label>
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              id="product-search"
              type="search"
              placeholder="Search products…"
              className="input pl-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={15} aria-hidden="true" />
            Price
          </Button>

          {filtersActive && (
            <Button variant="ghost" onClick={clearFilters}>
              <X size={15} aria-hidden="true" />
              Clear filters
            </Button>
          )}
        </div>

        {showFilters && (
          <form
            onSubmit={applyPrice}
            className="card mt-3 flex flex-wrap items-end gap-3 p-4 animate-fade-in"
          >
            <div>
              <label htmlFor="min-price" className="label">
                Min price
              </label>
              <input
                id="min-price"
                type="number"
                min={0}
                placeholder="0"
                className="input w-28"
                value={priceDraft.min}
                onChange={(e) => setPriceDraft({ ...priceDraft, min: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="max-price" className="label">
                Max price
              </label>
              <input
                id="max-price"
                type="number"
                min={0}
                placeholder="Any"
                className="input w-28"
                value={priceDraft.max}
                onChange={(e) => setPriceDraft({ ...priceDraft, max: e.target.value })}
              />
            </div>
            <Button type="submit">Apply</Button>
          </form>
        )}

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory("");
                setPage(1);
              }}
              aria-pressed={category === ""}
              className={`badge transition ${
                category === "" ? "badge-brand ring-1 ring-brand-300" : "badge-neutral hover:bg-brand-50"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c === category ? "" : c);
                  setPage(1);
                }}
                aria-pressed={c === category}
                className={`badge transition ${
                  c === category ? "badge-brand ring-1 ring-brand-300" : "badge-neutral hover:bg-brand-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-ink/55" aria-live="polite">
          {productsLoading
            ? "Loading products…"
            : filtersActive
              ? `${meta.total} ${meta.total === 1 ? "product matches" : "products match"} your filters`
              : `${meta.total} ${meta.total === 1 ? "product" : "products"}`}
        </p>

        <div className="mt-4">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : productsError ? (
            <EmptyState
              icon={TriangleAlert}
              tone="error"
              title="Couldn't load products"
              description={productsError}
              actionLabel="Try again"
              onAction={() => setReloadKey((k) => k + 1)}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title={filtersActive ? "No matching products" : "No products yet"}
              description={
                filtersActive
                  ? "Try widening your search or clearing the filters."
                  : "This vendor hasn't listed anything yet. Check back soon."
              }
              {...(filtersActive
                ? { actionLabel: "Clear filters", onAction: clearFilters }
                : { actionLabel: "Browse other stores", actionTo: "/stores" })}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination
                page={meta.page}
                pages={meta.pages}
                onChange={setPage}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
