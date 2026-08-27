import { Link } from "react-router-dom";
import { Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-lg font-800 text-brand-900"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Store size={15} />
            </span>
            Marketplace
          </Link>
          <p className="mt-3 max-w-sm text-sm text-ink/60">
            A multi-tenant SaaS platform where independent vendors run fully isolated
            storefronts — inventory, orders, and analytics included.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-700 text-ink">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link to="/stores" className="hover:text-brand-600">
                Browse stores
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-brand-600">
                Your cart
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-brand-600">
                Track orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-700 text-ink">Sell</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li>
              <Link to="/register" className="hover:text-brand-600">
                Become a vendor
              </Link>
            </li>
            <li>
              <Link to="/vendor/dashboard" className="hover:text-brand-600">
                Vendor dashboard
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand-600">
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Marketplace. Built as a multi-tenant MERN demo.</p>
          <p>Payments secured by Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
