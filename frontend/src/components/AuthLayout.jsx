import { Check, ShoppingBag } from "lucide-react";

const PERKS = [
  "Your own isolated storefront in minutes",
  "Inventory, orders and payouts in one place",
  "Revenue and top-product analytics built in",
  "Secure checkout powered by Stripe",
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-20">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-800 text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-ink/60">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-sm text-ink/60">{footer}</div>}
      </div>

      {/* Decorative brand panel — hidden on small screens where space is tight. */}
      <aside
        aria-hidden="true"
        className="hidden overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-white shadow-lift lg:block"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <ShoppingBag size={22} />
        </div>
        <p className="mt-6 font-display text-2xl font-700 leading-snug">
          One platform.
          <br />
          Every vendor gets their own storefront.
        </p>
        <ul className="mt-8 space-y-3.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-3 text-sm text-white/85">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                <Check size={12} strokeWidth={3} />
              </span>
              {perk}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
