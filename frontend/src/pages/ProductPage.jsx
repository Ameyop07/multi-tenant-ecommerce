import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { addToCart } from "../redux/slices/cartSlice.js";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <div className="mx-auto max-w-6xl px-6 py-20 text-ink/50">Loading...</div>;

  const price = variant ? variant.price : product.basePrice;

  const handleAdd = () => {
    dispatch(
      addToCart({
        product: product._id,
        storeId: product.store._id,
        variantLabel: variant?.label || null,
        quantity: qty,
        price,
        image: product.images[0] || "",
      })
    );
    toast.success("Added to cart");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 grid gap-10 sm:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-2xl bg-brand-50">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-400">No image</div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-brand-500">{product.category}</p>
        <h1 className="mt-1 font-display text-2xl font-800 text-ink">{product.name}</h1>
        <p className="mt-2 text-sm text-ink/60">Sold by {product.store?.name}</p>
        <p className="mt-4 font-display text-3xl font-700 text-brand-600">${price?.toFixed(2)}</p>
        <p className="mt-4 text-ink/70">{product.description}</p>

        {product.variants?.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink">Options</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.sku}
                  onClick={() => setVariant(v)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${variant?.sku === v.sku ? "border-brand-500 bg-brand-50 text-brand-700" : "border-brand-100"}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 rounded-lg border border-brand-100 px-3 py-2"
          />
          <button onClick={handleAdd} className="rounded-full bg-brand-500 px-6 py-2.5 text-white hover:bg-brand-600">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
