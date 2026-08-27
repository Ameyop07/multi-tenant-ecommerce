import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios.js";

export default function VendorAnalytics({ storeId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/stores/${storeId}/analytics`).then((res) => setData(res.data));
  }, [storeId]);

  if (!data) return <p className="text-ink/50">Loading analytics...</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-100 p-5">
          <p className="text-sm text-ink/60">Total Revenue</p>
          <p className="mt-1 font-display text-2xl font-800 text-brand-600">${data.summary.totalRevenue?.toFixed(2) || "0.00"}</p>
        </div>
        <div className="rounded-2xl border border-brand-100 p-5">
          <p className="text-sm text-ink/60">Total Orders</p>
          <p className="mt-1 font-display text-2xl font-800 text-brand-600">{data.summary.totalOrders || 0}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-100 p-5">
        <h3 className="mb-4 font-display font-700 text-ink">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.revenueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcebe4" />
            <XAxis dataKey="_id" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#237a58" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-brand-100 p-5">
        <h3 className="mb-4 font-display font-700 text-ink">Top Products</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dcebe4" />
            <XAxis dataKey="_id" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3f9c78" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
