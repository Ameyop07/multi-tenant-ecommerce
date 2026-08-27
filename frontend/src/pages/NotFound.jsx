import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Compass size={30} aria-hidden="true" />
      </div>
      <p className="mt-6 font-display text-5xl font-800 text-brand-900">404</p>
      <h1 className="mt-2 font-display text-2xl font-700 text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink/60">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-md btn-primary">
          Back to home
        </Link>
        <Link to="/stores" className="btn btn-md btn-outline">
          Browse stores
        </Link>
      </div>
    </div>
  );
}
