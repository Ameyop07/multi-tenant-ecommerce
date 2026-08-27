import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { clearCart } from "../redux/slices/cartSlice.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm({ items, address, setAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;

  const isMockStripe = !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.includes("Mock");

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { data: intentData } = await api.post("/payments/create-intent", { items });

      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      // All items in a single checkout belong to one store in this MVP flow.
      await api.post("/orders", {
        store: items[0].storeId,
        items,
        shippingAddress: address,
        stripePaymentIntentId: result.paymentIntent.id,
      });

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    // Validate inputs
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.postalCode || !address.state || !address.country) {
      toast.error("Please fill out all address fields");
      return;
    }
    setLoading(true);
    try {
      const fakePaymentIntentId = "pi_mock_" + Math.random().toString(36).substring(2, 15);
      await api.post("/orders", {
        store: items[0].storeId,
        items,
        shippingAddress: address,
        stripePaymentIntentId: fakePaymentIntentId, // This marks the order as paid on creation!
      });
      dispatch(clearCart());
      toast.success("Mock Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Mock payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-5">
      {isMockStripe && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">🛠️ Developer Dev Mode Active</p>
          <p className="mt-1 text-xs">
            Using mock Stripe keys. Fill out the shipping form and click <strong>Simulate Mock Payment</strong> below to test order fulfillment without Stripe configuration.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Full name" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
        <input required placeholder="Phone" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
        <input required placeholder="Address line 1" className="col-span-2 rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
        <input required placeholder="City" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        <input required placeholder="Postal Code" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
        <input required placeholder="State" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
        <input required placeholder="Country" className="rounded-lg border border-brand-100 px-4 py-2.5"
          value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
      </div>

      {!isMockStripe && (
        <div className="rounded-lg border border-brand-100 p-4">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
      )}

      <div className="flex justify-between text-sm text-ink/70">
        <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-ink/70">
        <span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between font-display font-700 text-lg">
        <span>Total</span><span>${(subtotal + shipping).toFixed(2)}</span>
      </div>

      {isMockStripe ? (
        <button type="button" onClick={handleSimulatePayment} disabled={loading} className="w-full rounded-full bg-emerald-600 py-3 text-white hover:bg-emerald-700 disabled:opacity-60 font-semibold transition">
          {loading ? "Processing..." : "Simulate Mock Payment (Fast Checkout)"}
        </button>
      ) : (
        <button disabled={!stripe || loading} className="w-full rounded-full bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:opacity-60">
          {loading ? "Processing..." : "Pay & Place Order"}
        </button>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  const items = useSelector((state) => state.cart.items);
  const [address, setAddress] = useState({
    fullName: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "", phone: "",
  });

  if (items.length === 0) {
    return <div className="mx-auto max-w-xl px-6 py-20 text-center text-ink/60">Your cart is empty.</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display text-2xl font-700 text-ink">Checkout</h1>
      <div className="mt-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm items={items} address={address} setAddress={setAddress} />
        </Elements>
      </div>
    </div>
  );
}
