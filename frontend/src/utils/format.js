// Shared display formatters so prices/dates look identical across the app.

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatMoney = (value) => currency.format(Number(value) || 0);

// Compact form for chart axes — $1.2k instead of $1,200.00
export const formatMoneyShort = (value) => {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n.toFixed(0)}`;
};

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

// "2026-08-22" -> "Aug 22" for chart x-axes
export const formatDayLabel = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Short, readable order reference derived from the Mongo ObjectId.
export const orderRef = (id) => `#${String(id).slice(-6).toUpperCase()}`;

export const SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 9.99;

// Mirrors the server-side calculation in orderController/paymentController so
// the totals shown at checkout match what actually gets charged.
export const calcShipping = (itemsTotal) =>
  itemsTotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
