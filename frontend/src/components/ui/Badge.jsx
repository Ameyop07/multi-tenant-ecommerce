// Maps the domain status strings used across orders/stores/payments onto
// the badge colour classes defined in index.css.
const STATUS_TONE = {
  // store status
  approved: "success",
  pending: "warning",
  suspended: "danger",
  // order fulfilment
  processing: "info",
  shipped: "brand",
  delivered: "success",
  cancelled: "danger",
  // payment
  paid: "success",
  failed: "danger",
  refunded: "neutral",
};

export default function Badge({ children, tone, status, className = "" }) {
  const resolved = tone || STATUS_TONE[String(status ?? children).toLowerCase()] || "neutral";

  return <span className={`badge badge-${resolved} ${className}`}>{children ?? status}</span>;
}
