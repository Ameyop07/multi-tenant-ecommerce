import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const SIZES = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}) {
  const isButton = Tag === "button";

  return (
    <Tag
      {...(isButton ? { type: props.type || "button" } : {})}
      {...props}
      disabled={isButton ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={`btn ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
