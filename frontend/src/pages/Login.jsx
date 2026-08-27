import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";
import { login, clearAuthError } from "../redux/slices/authSlice.js";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import PasswordInput from "../components/ui/PasswordInput.jsx";

// Only rendered by the dev server — these are the accounts `npm run seed`
// creates, and they must never ship in a production bundle.
const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@example.com" },
  { label: "Vendor", email: "vendor1@example.com" },
  { label: "Customer", email: "customer@example.com" },
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const loading = status === "loading";

  // Clear any error left over from a previous visit to this screen.
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name?.split(" ")[0] || "there"}!`);
      // Send the user back where they were headed before being bounced here.
      navigate(location.state?.from || "/", { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your store or track your orders."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="link font-medium">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-danger-500/25 bg-danger-50 px-4 py-3 text-sm text-danger-700"
          >
            <TriangleAlert size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

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
            autoComplete="current-password"
            required
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      {import.meta.env.DEV && (
        <div className="mt-8 rounded-xl border border-dashed border-brand-200 bg-surface-muted p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
            Demo accounts · password123
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                size="sm"
                variant="outline"
                onClick={() => setForm({ email: account.email, password: "password123" })}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
