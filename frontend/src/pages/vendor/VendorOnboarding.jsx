import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

export default function VendorOnboarding() {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", description: "", contactEmail: user?.email || "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/stores", form);
      toast.success("Store submitted for approval!");
      navigate("/vendor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create store");
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-2xl font-700 text-ink">Set up your store</h1>
      <p className="mt-1 text-sm text-ink/60">A super admin will review and approve your store before it goes live.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input required placeholder="Store name" className="w-full rounded-lg border border-brand-100 px-4 py-2.5"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea required placeholder="Short description" rows={3} className="w-full rounded-lg border border-brand-100 px-4 py-2.5"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required type="email" placeholder="Contact email" className="w-full rounded-lg border border-brand-100 px-4 py-2.5"
          value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        <button className="w-full rounded-full bg-brand-500 py-2.5 text-white hover:bg-brand-600">Submit for review</button>
      </form>
    </div>
  );
}
