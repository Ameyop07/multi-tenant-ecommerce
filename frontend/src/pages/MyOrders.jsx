import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-2xl font-700 text-ink">My Orders</h1>
      {orders.length === 0 && <p className="mt-6 text-ink/50">No orders yet.</p>}
      <div className="mt-6 space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="rounded-2xl border border-brand-100 p-5">
            <div className="flex justify-between text-sm text-ink/60">
              <span>Order #{o._id.slice(-6)}</span>
              <span className="capitalize">{o.orderStatus}</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-ink/80">
              {o.items.map((item, i) => (
                <li key={i}>{item.quantity}x {item.name}</li>
              ))}
            </ul>
            <p className="mt-2 font-medium text-ink">Total: ${o.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
