import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingBag, Store as StoreIcon, TriangleAlert } from "lucide-react";
import { register, clearAuthError } from "../redux/slices/authSlice.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";

const ROLES = [
  {
    value: "customer",
    label: "I want to shop",
    desc: "Browse stores and place orders",
    icon: ShoppingBag,
  },
  {
    value: "vendor",
    label: "I want to sell",
    desc: "Open my own storefront",
    icon: StoreIcon,
  },
];

const MIN_PASSWORD = 6;

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const passwordTooShort = form.password.length > 0 && form.password.length < MIN_PASSWORD;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (form.password.length < MIN_PASSWORD) return;

    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success("Account created!");
      navigate(form.role === "vendor" ? "/vendor/onboarding" : "/", { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Shop from independent vendors, or open a storefront of your own."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="link font-medium">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-danger-500/25 bg-danger-50 px-4 py-3 text-sm text-danger-700"
          >
            <TriangleAlert size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <fieldset>
          <legend className="label">I'm signing up to…</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {ROLES.map(({ value, label, desc, icon: Icon }) => {
              const active = form.role === value;
              return (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    active
                      ? "border-brand-400 bg-brand-50 ring-4 ring-brand-500/10"
                      : "border-brand-100 bg-white hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={active}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="sr-only"
                  />
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className={active ? "text-brand-600" : "text-ink/40"}
                  />
                  <p
                    className={`mt-2 text-sm font-medium ${active ? "text-brand-800" : "text-ink"}`}
                  >
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/55">{desc}</p>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="name" className="label">
            Full name
          </label>
          <input
            id="name"
            autoComplete="name"
            required
            placeholder="Jane Doe"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            placeholder="At least 6 characters"
            aria-invalid={touched && passwordTooShort ? "true" : undefined}
            aria-describedby="password-hint"
            className={touched && passwordTooShort ? "input-error" : ""}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p id="password-hint" className={passwordTooShort ? "hint-error" : "hint"}>
            {passwordTooShort
              ? `Password must be at least ${MIN_PASSWORD} characters.`
              : `Use at least ${MIN_PASSWORD} characters.`}
          </p>
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>

        {form.role === "vendor" && (
          <p className="text-xs text-ink/55">
            After signing up you'll set up your store. A super admin reviews it before it
            goes live.
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
