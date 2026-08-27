import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Store,
  Package,
  ShieldCheck,
} from "lucide-react";
import { logout } from "../redux/slices/authSlice.js";
import { selectCartCount } from "../redux/slices/cartSlice.js";

const ROLE_LABEL = {
  vendor: "Vendor",
  super_admin: "Super Admin",
  customer: "Customer",
};

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 transition ${
      isActive ? "text-brand-600" : "text-ink/70 hover:text-brand-600"
    }`;

  // Shared nav destinations, rendered in both the desktop bar and mobile sheet.
  const navLinks = (
    <>
      <NavLink to="/stores" className={linkClass}>
        <Store size={16} /> Browse Stores
      </NavLink>

      {user?.role === "customer" && (
        <NavLink to="/orders" className={linkClass}>
          <Package size={16} /> My Orders
        </NavLink>
      )}
      {user?.role === "vendor" && (
        <NavLink to="/vendor/dashboard" className={linkClass}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
      )}
      {user?.role === "super_admin" && (
        <NavLink to="/admin/dashboard" className={linkClass}>
          <ShieldCheck size={16} /> Admin Panel
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/85 backdrop-blur-md">
      <nav className="container-page flex items-center justify-between py-3.5">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-800 tracking-tight text-brand-900"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Store size={15} />
          </span>
          Marketplace
        </Link>

        {/* ---- Desktop ---- */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks}

          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative text-ink/70 transition hover:text-brand-600"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-600 text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-brand-100 pl-4">
              <div className="text-right leading-tight">
                <p className="text-sm font-600 text-ink">{user.name}</p>
                <p className="text-[11px] text-ink/50">{ROLE_LABEL[user.role] || user.role}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="rounded-lg p-2 text-ink/50 transition hover:bg-danger-50 hover:text-danger-700"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-ink/70 hover:text-brand-600">
                Log in
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary px-4 py-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* ---- Mobile trigger ---- */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative p-2 text-ink/70"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-600 text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-lg p-2 text-ink/70 transition hover:bg-brand-50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ---- Mobile sheet ---- */}
      {open && (
        <div className="animate-fade-in border-t border-brand-100 bg-white md:hidden">
          <div className="container-page flex flex-col gap-4 py-5 text-sm font-medium">
            {navLinks}

            {user ? (
              <>
                <div className="border-t border-brand-100 pt-4">
                  <p className="text-sm font-600 text-ink">{user.name}</p>
                  <p className="text-xs text-ink/50">{ROLE_LABEL[user.role] || user.role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-left text-danger-700"
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <div className="flex gap-3 border-t border-brand-100 pt-4">
                <Link to="/login" className="btn btn-md btn-outline flex-1">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-md btn-primary flex-1">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
