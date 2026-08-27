import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const STATUS_OPTIONS = ["processing", "shipped", "delivered", "cancelled"];

export default function VendorOrders({ storeId }) {
  const [orders, setOrders] = useState([]);

  const load = () => api.get(`/stores/${storeId}/orders`).then((res) => setOrders(res.data));
  useEffect(() => { load(); }, [storeId]);

  const updateStatus = async (id, orderStatus) => {
    await api.patch(`/stores/${storeId}/orders/${id}/status`, { orderStatus });
    toast.success("Order updated");
    load();
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 && <p className="text-ink/50">No orders yet.</p>}
      {orders.map((order) => (
        <div key={order._id} className="rounded-2xl border border-brand-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-medium text-ink">Order #{order._id.slice(-6)}</p>
              <p className="text-sm text-ink/60">{order.customer?.name} • {order.customer?.email}</p>
            </div>
            <select
              value={order.orderStatus}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="rounded-lg border border-brand-100 px-3 py-1.5 text-sm"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-ink/70">
            {order.items.map((item, i) => (
              <li key={i}>{item.quantity}x {item.name} {item.variantLabel ? `(${item.variantLabel})` : ""} — ${item.price.toFixed(2)}</li>
            ))}
          </ul>
          <p className="mt-2 font-medium text-ink">Total: ${order.total.toFixed(2)} • Payment: {order.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}
