# Multi-Tenant E-Commerce Platform (SaaS)

A full-stack MERN application that lets independent vendors register, set up
isolated digital storefronts, manage inventory, and sell to customers within
a single shared platform — with role-based access separating **Super Admins**,
**Vendors**, and **Customers**.

## Why this architecture

Instead of one flat product catalog, every `Product` and `Order` document is
scoped to a `store` (tenant) at the schema level, and every write route is
guarded by an `enforceStoreOwnership` middleware that checks the requesting
vendor actually owns the store in the URL. A vendor's JWT can never be used
to read or write another vendor's inventory or orders — that boundary is
enforced server-side, not just hidden in the UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Redux Toolkit, Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose (tenant-scoped schemas + compound indexes) |
| Payments | Stripe (PaymentIntents + webhook-confirmed order finalization) |
| Media | Cloudinary (per-store folder namespacing) |
| Email | Nodemailer (order confirmation emails) |
| Security | JWT, bcrypt.js, Helmet, express-mongo-sanitize, rate limiting |
| Analytics | Recharts (revenue, order volume, top products, platform leaderboard) |

## Project Structure

```
multi-tenant-ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/        # DB + Cloudinary setup
│   │   ├── controllers/   # auth, store, product, order, payment, analytics
│   │   ├── middleware/    # JWT auth, RBAC, tenant-ownership guard, error handler
│   │   ├── models/        # User, Store, Product, Order (Mongoose schemas)
│   │   ├── routes/        # REST endpoints, nested under /stores/:storeId
│   │   └── utils/         # token signing, email templates
│   └── server.js
└── frontend/
    └── src/
        ├── api/            # axios instance with JWT interceptor
        ├── redux/          # auth slice, cart slice (RTK)
        ├── components/     # Navbar, ProductCard, ProtectedRoute
        └── pages/
            ├── vendor/     # onboarding, product/order management, analytics
            └── admin/      # store approvals, platform-wide analytics
```

## Core Features

**Authentication & RBAC**
JWT-based auth with three roles. Vendors are linked to exactly one `Store`;
route middleware (`protect`, `authorize`, `enforceStoreOwnership`) checks
role and tenant ownership on every protected request.

**Vendor workflow**
Register → submit store for approval → Super Admin approves/suspends →
vendor manages products (with Cloudinary image upload) and fulfills orders
through a status pipeline (processing → shipped → delivered).

**Customer workflow**
Browse approved stores → view products/variants → cart (persisted in
localStorage, synced through Redux) → checkout with Stripe Elements →
webhook confirms payment server-side → confirmation email sent →
order visible in "My Orders".

**Payments**
Prices are recalculated server-side from the database at both PaymentIntent
creation and order creation — the client only ever sends product IDs and
quantities, never trusted prices. Order status is only marked `paid` once
Stripe's webhook confirms the charge, not on the client's redirect.

**Analytics**
Vendor dashboard: revenue-over-time line chart, top-5 products bar chart,
lifetime totals — computed with MongoDB aggregation pipelines scoped to the
vendor's store. Admin dashboard: cross-tenant revenue leaderboard.

## Getting Started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secret, Stripe/Cloudinary/SMTP keys
npm run dev             # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # add your Stripe publishable key
npm run dev             # http://localhost:5173
```

### 3. Stripe webhook (local testing)
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Suggested Demo Flow (for review/evaluation)

1. Register as a **vendor** → submit a store.
2. Register a second account as a **customer** (or manually flip a user's
   `role` to `super_admin` in MongoDB for the first account you want as admin).
3. Log in as super admin → approve the vendor's store.
4. Log in as vendor → add 2–3 products with images.
5. Log in as customer → browse the store, add to cart, check out with a
   [Stripe test card](https://docs.stripe.com/testing) (`4242 4242 4242 4242`).
6. Back in the vendor dashboard → see the order, update its status, and view
   the revenue chart update in Analytics.

## What's Intentionally Out of Scope (MVP boundaries)

- Multi-store checkout in a single cart (current flow assumes one store per
  checkout — a common real-world simplification most MVPs ship with first).
- Stripe Connect payouts to vendors (schema has a `stripeAccountId` field
  ready for this as a next iteration).
- Refund workflows (payment status supports `refunded` but no UI trigger yet).

These are natural "Phase 2" additions and are called out deliberately rather
than hidden — happy to build any of them out further.
