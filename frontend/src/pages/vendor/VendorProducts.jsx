import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function VendorProducts({ storeId }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "", basePrice: "", stock: "" });
  const [files, setFiles] = useState([]);

  const load = () => api.get(`/stores/${storeId}/products`).then((res) => setProducts(res.data.products));

  useEffect(() => { load(); }, [storeId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append("images", f));

      await api.post(`/stores/${storeId}/products`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product created");
      setShowForm(false);
      setForm({ name: "", description: "", category: "", basePrice: "", stock: "" });
      setFiles([]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    }
  };

  const remove = async (id) => {
    await api.delete(`/stores/${storeId}/products/${id}`);
    toast.success("Product removed");
    load();
  };

  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} className="rounded-full bg-brand-500 px-5 py-2 text-sm text-white hover:bg-brand-600">
        {showForm ? "Cancel" : "+ Add Product"}
      </button>

      {showForm && (
        <form onSubmit={submit} className="mt-4 grid gap-3 rounded-2xl border border-brand-100 p-5 sm:grid-cols-2">
          <input required placeholder="Product name" className="rounded-lg border border-brand-100 px-3 py-2"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required placeholder="Category" className="rounded-lg border border-brand-100 px-3 py-2"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input required type="number" placeholder="Base price" className="rounded-lg border border-brand-100 px-3 py-2"
            value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
          <input required type="number" placeholder="Stock" className="rounded-lg border border-brand-100 px-3 py-2"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <textarea placeholder="Description" className="col-span-2 rounded-lg border border-brand-100 px-3 py-2"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="file" multiple accept="image/*" className="col-span-2"
            onChange={(e) => setFiles(Array.from(e.target.files))} />
          <button className="col-span-2 rounded-lg bg-brand-500 py-2 text-white hover:bg-brand-600">Save Product</button>
        </form>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="rounded-2xl border border-brand-100 p-4">
            <div className="aspect-video overflow-hidden rounded-lg bg-brand-50">
              {p.images?.[0] && <img src={p.images[0]} className="h-full w-full object-cover" />}
            </div>
            <h4 className="mt-2 font-medium text-ink">{p.name}</h4>
            <p className="text-sm text-ink/60">${p.basePrice} • Stock: {p.stock}</p>
            <button onClick={() => remove(p._id)} className="mt-2 text-sm text-red-500 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
