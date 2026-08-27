import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios.js";

export default function AdminDashboard() {
  const [stores, setStores] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const loadStores = () => api.get("/stores/admin/all").then((res) => setStores(res.data));
  const loadAnalytics = () => api.get("/admin/analytics").then((res) => setAnalytics(res.data));

  useEffect(() => { loadStores(); loadAnalytics(); }, []);

  const setStatus = async (storeId, status) => {
    await api.patch(`/stores/admin/${storeId}/status`, { status });
    toast.success(`Store ${status}`);
    loadStores();
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-2xl font-700 text-ink">Super Admin Panel</h1>

      {analytics && (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-100 p-5">
            <p className="text-sm text-ink/60">Approved Stores</p>
            <p className="mt-1 font-display text-2xl font-800 text-brand-600">{analytics.totalStores}</p>
          </div>
          <div className="rounded-2xl border border-brand-100 p-5">
            <p className="text-sm text-ink/60">Platform Orders</p>
            <p className="mt-1 font-display text-2xl font-800 text-brand-600">{analytics.totalOrders}</p>
          </div>
        </div>
      )}

      {analytics?.leaderboard?.length > 0 && (
        <div className="mt-8 rounded-2xl border border-brand-100 p-5">
          <h3 className="mb-4 font-display font-700 text-ink">Top Stores by Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.leaderboard}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dcebe4" />
              <XAxis dataKey="store" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#237a58" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h2 className="mt-10 font-display text-xl font-700 text-ink">Store Approvals</h2>
      <div className="mt-4 space-y-3">
        {stores.map((store) => (
          <div key={store._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4">
            <div>
              <p className="font-medium text-ink">{store.name} <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600">{store.status}</span></p>
              <p className="text-sm text-ink/60">Owner: {store.owner?.name} ({store.owner?.email})</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStatus(store._id, "approved")} className="rounded-full bg-brand-500 px-4 py-1.5 text-sm text-white hover:bg-brand-600">Approve</button>
              <button onClick={() => setStatus(store._id, "suspended")} className="rounded-full border border-red-300 px-4 py-1.5 text-sm text-red-500 hover:bg-red-50">Suspend</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
