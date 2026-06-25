# Alexandra Pintea Website Foundation

Initial Next.js foundation for a professional artist portfolio, archive, shop, Print Club, commissions, and admin dashboard.

This project is intentionally restrained visually. The priority is clean structure, security boundaries, database shape, payment flow, and handoff-ready code.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and Row Level Security
- Stripe Checkout, Billing, Customer Portal, and webhooks

## Local Setup

1. Install dependencies.

```bash
pnpm install
```

2. Copy environment variables.

```bash
cp .env.example .env.local
```

3. Add Supabase values.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=alexandra@example.com
```

4. Add Stripe values.

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRINT_CLUB_PRICE_ID=
```

5. Run the Supabase migration and seed.

Use `supabase/migrations/001_initial_schema.sql` first, then `supabase/seed.sql`.

6. Create Alexandra's Supabase Auth user, then mark the profile as admin.

```sql
update profiles
set is_admin = true, role = 'admin'
where email = 'alexandra@example.com';
```

7. Start the app.

```bash
pnpm dev
```

## Routes

- `/`
- `/portfolio`
- `/gallery`
- `/archive`
- `/artwork/[slug]`
- `/shop`
- `/shop/[slug]`
- `/print-club`
- `/account`
- `/account/print-club`
- `/commissions`
- `/about`
- `/cv`
- `/contact`
- `/faq`
- `/shipping-returns`
- `/privacy-policy`
- `/terms-and-conditions`
- `/admin`
- `/admin/artworks`
- `/admin/products`
- `/admin/print-club`
- `/admin/commissions`
- `/admin/newsletter`

## Stripe Notes

The project uses Stripe Checkout Sessions for one-time payments and subscriptions.

- One-time purchase endpoint: `/api/stripe/create-checkout-session`
- Subscription checkout: same endpoint with `productId: "print-club-subscription"`
- Customer portal endpoint: `/api/stripe/create-portal-session`
- Webhook endpoint: `/api/stripe/webhook`

Configure a Stripe webhook for:

- `checkout.session.completed`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Original artwork sales are finalized in the webhook. The database function `mark_original_product_sold` locks the product row, sets the original product stock to `0`, disables the original product, and marks the artwork as sold.

## Supabase Notes

The migration includes:

- Profiles and admin role support
- Artworks and image galleries
- Products and product images
- Orders and order items
- Print Club projects and monthly entries
- Subscriptions and subscriber access
- Digital file records for protected storage
- Commission enquiries
- Newsletter signups
- Site content and CV entries
- RLS policies and public views

Use a private Supabase Storage bucket for subscriber-only digital files and process PDFs. Store file paths in `digital_files`, then generate signed URLs server-side after checking active subscription status.

## Security Checklist Before Launch

- Review all legal wording with an appropriate professional.
- Confirm RLS policies in Supabase after migration.
- Keep `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` server-only.
- Add production Stripe webhook signing secret.
- Confirm admin profile uses `is_admin = true`.
- Test duplicate purchase handling for original works in Stripe test mode.
- Add real shipping rules and product-specific handling notes.
- Confirm customs and import duty wording appears on checkout, product pages, FAQ, shipping, and terms.

## Handoff Notes

The UI is ready for refinement without replacing the core logic. Main visual surfaces live in reusable components under `src/components`, while provider logic is in `src/lib`, route handlers are under `src/app/api`, server actions are under `src/app/actions`, and admin actions are under `src/app/admin/actions.ts`.
