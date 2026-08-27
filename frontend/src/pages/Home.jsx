import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  PackagePlus,
  ShieldCheck,
  Store as StoreIcon,
  UserPlus,
} from "lucide-react";
import api from "../api/axios.js";
import StoreCard from "../components/StoreCard.jsx";
import Button from "../components/ui/Button.jsx";
import { StoreCardSkeleton } from "../components/ui/Skeleton.jsx";

const FEATURES = [
  {
    icon: StoreIcon,
    title: "Isolated storefronts",
    desc: "Every vendor's inventory and orders live in a fully separated tenant — no data ever leaks across stores.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    desc: "JWT auth, hashed passwords, and role-based access enforced on every single write route.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    desc: "Revenue trends, order volume, and best-selling products — visualised per store, out of the box.",
  },
];

const STEPS = [
  { icon: UserPlus, title: "Create an account", desc: "Sign up as a vendor in under a minute." },
  { icon: PackagePlus, title: "Add your products", desc: "Upload images, set prices, define variants." },
  { icon: BarChart3, title: "Start selling", desc: "Take payments and track performance live." },
];

export default function Home() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/stores")
      .then((res) => {
        if (active) setStores(res.data.slice(0, 3));
      })
      // A failed fetch just hides the section — it isn't worth an error banner
      // on the marketing page.
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden border-b border-brand-100 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl"
        />
        <div className="container-page relative py-20 text-center sm:py-28">
          <p className="badge badge-brand mb-5 normal-case tracking-wide">
            Multi-vendor SaaS marketplace
          </p>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-800 leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            One platform.
            <br />
            Every vendor gets their own storefront.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/65">
            Independent sellers launch a fully isolated store — inventory, orders, and
            analytics — without touching a line of infrastructure.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/stores" size="lg">
              Browse stores
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button as={Link} to="/register" size="lg" variant="outline">
              Become a vendor
            </Button>
          </div>
        </div>
      </section>

      {/* ---- Featured stores ---- */}
      {(loading || stores.length > 0) && (
        <section className="container-page py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-700 text-ink">Featured stores</h2>
              <p className="mt-1 text-ink/60">Independent vendors already selling here.</p>
            </div>
            <Link to="/stores" className="link text-sm">
              View all stores
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }, (_, i) => <StoreCardSkeleton key={i} />)
              : stores.map((store) => <StoreCard key={store._id} store={store} />)}
          </div>
        </section>
      )}

      {/* ---- Features ---- */}
      <section className="border-y border-brand-100 bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="max-w-2xl font-display text-2xl font-700 text-ink sm:text-3xl">
            Everything a marketplace needs, already wired up
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card card-hover p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display font-700 text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="container-page py-16 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-700 text-ink sm:text-3xl">How it works</h2>
          <p className="mx-auto mt-2 max-w-md text-ink/60">
            From sign-up to your first sale in three steps.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card ring-1 ring-brand-100">
                <Icon size={24} aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-xs font-700 uppercase tracking-widest text-brand-500">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-display font-700 text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink/60">{desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-12 text-center text-white shadow-lift sm:px-14">
          <h2 className="font-display text-2xl font-700 sm:text-3xl">Ready to open your store?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/75">
            Create a vendor account and submit your store for review — approval usually
            takes minutes.
          </p>
          <Button
            as={Link}
            to="/register"
            size="lg"
            className="mt-7 bg-white text-brand-700 shadow-soft hover:bg-brand-50"
          >
            Get started free
            <ArrowRight size={17} aria-hidden="true" />
          </Button>
        </div>
      </section>
    </div>
  );
}
