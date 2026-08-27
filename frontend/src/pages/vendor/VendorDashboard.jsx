import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import VendorProducts from "./VendorProducts.jsx";
import VendorOrders from "./VendorOrders.jsx";
import VendorAnalytics from "./VendorAnalytics.jsx";

export default function VendorDashboard() {
  const { user } = useSelector((state) => state.auth);

  if (!user?.store) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center text-ink/60">
        You haven't set up a store yet. Go to onboarding to create one.
      </div>
    );
  }

  const tabs = [
    { to: "products", label: "Products" },
    { to: "orders", label: "Orders" },
    { to: "analytics", label: "Analytics" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl font-700 text-ink">Vendor Dashboard</h1>
      <div className="mt-6 flex gap-2 border-b border-brand-100">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium ${isActive ? "border-b-2 border-brand-500 text-brand-600" : "text-ink/60"}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        <Routes>
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<VendorProducts storeId={user.store} />} />
          <Route path="orders" element={<VendorOrders storeId={user.store} />} />
          <Route path="analytics" element={<VendorAnalytics storeId={user.store} />} />
        </Routes>
      </div>
    </div>
  );
}
