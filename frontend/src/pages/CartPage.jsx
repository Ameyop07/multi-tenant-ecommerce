import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice.js";

export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-ink/60">Your cart is empty.</p>
        <Link to="/stores" className="mt-4 inline-block text-brand-600 underline">Browse stores</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="font-display text-2xl font-700 text-ink">Your Cart</h1>

      <div className="mt-6 divide-y divide-brand-100">
        {items.map((item) => (
          <div key={item.product + (item.variantLabel || "")} className="flex items-center gap-4 py-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-brand-50">
              {item.image && <img src={item.image} className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{item.variantLabel || "Item"}</p>
              <p className="text-sm text-ink/60">${item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                dispatch(updateQuantity({ product: item.product, variantLabel: item.variantLabel, quantity: Number(e.target.value) }))
              }
              className="w-16 rounded-lg border border-brand-100 px-2 py-1.5 text-center"
            />
            <button
              onClick={() => dispatch(removeFromCart({ product: item.product, variantLabel: item.variantLabel }))}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-brand-100 pt-6">
        <p className="text-lg font-display font-700">Subtotal: ${subtotal.toFixed(2)}</p>
        <Link to="/checkout" className="rounded-full bg-brand-500 px-6 py-2.5 text-white hover:bg-brand-600">
          Checkout
        </Link>
      </div>
    </div>
  );
}
