import { Loader2 } from "lucide-react";

export default function Spinner({ size = 20, className = "", label = "Loading" }) {
  return (
    <Loader2
      size={size}
      role="status"
      aria-label={label}
      className={`animate-spin text-brand-500 ${className}`}
    />
  );
}
