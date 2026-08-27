import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  tone = "neutral",
  className = "",
}) {
  const isError = tone === "error";

  return (
    <div className={`card flex flex-col items-center px-6 py-14 text-center ${className}`}>
      {Icon && (
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isError ? "bg-danger-50 text-danger-500" : "bg-brand-50 text-brand-500"
          }`}
        >
          <Icon size={26} aria-hidden="true" />
        </div>
      )}
      <h3 className="font-display text-lg font-700 text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink/60">{description}</p>}

      {actionLabel && actionTo && (
        <Button as={Link} to={actionTo} className="mt-6">
          {actionLabel}
        </Button>
      )}
      {actionLabel && !actionTo && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
