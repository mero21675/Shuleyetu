# Shuleyetu

Tanzanian school supply marketplace that connects parents, schools, and stationery vendors for textbooks, uniforms, and school materials.

This repository currently contains a web app (`shuleyetu-web`) plus a Supabase SQL migration defining the core marketplace schema.

---

## Tech stack

- **Frontend**: Next.js 14.2.35 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS with dark/light theme toggle
- **Backend / DB**: Supabase (PostgreSQL, SQL migrations, Row Level Security)
- **Auth & APIs**: Supabase client (`@supabase/supabase-js`), JWT-based authentication
- **Payments**: ClickPesa (sandbox integration with USSD push, webhook signature verification)
- **Testing**: Vitest for unit tests, Jest for integration tests
- **Security**: HTTP security headers, CSRF protection, secure token-based public order access

---

## Project structure

- `shuleyetu-web/`
  - Next.js app (App Router, `src/app`)
  - **Pages**: vendors, orders, vendor dashboard, admin panel, order tracking
  - **API routes**: admin management, ClickPesa payment integration, public order access
  - **Shared utilities**: `src/lib/` (auth helpers, API utils, logging, validation)
  - **Tests**: unit tests with Vitest for core business logic
- `supabase/migrations/`
  - Database schema, RLS policies, auth tables, and stored procedures
  - 7 migration files covering vendors, inventory, orders, auth, and admin features

---

## Features implemented

### Home & marketing

- **Landing page**: `/`
  - Modern hero section with animated badge and gradient backgrounds.
  - Stats bar showing vendors, products, regions, and support availability.
  - Feature cards for parents, vendors, and schools with icons.
  - How-it-works section with 3-step guide.
  - Call-to-action section for getting started.
- **Why Shuleyetu**: `/why-shuleyetu`
  - Simple marketing page describing the problem and how Shuleyetu helps.
  - Includes screenshot placeholders for the vendor dashboard, parent order flow, and ClickPesa payment.

### Vendors

- **List vendors**: `/vendors`
  - Reads from the Supabase `vendors` table.
  - Shows vendor name, description, and Tanzanian location fields (region/district/ward).
- **Vendor detail & inventory**: `/vendors/[vendorId]`
  - Loads a single vendor plus items from the `inventory` table, filtered by `vendor_id`.
  - Displays item name, category, price in TZS, and stock quantity.

### Orders

- **Create order**: `/orders/new`
  - Selects a vendor (from `vendors`).
  - Loads that vendor's inventory and lets you choose quantities per item.
  - Captures customer details: parent/guardian name, phone, optional student and school.
  - Writes to Supabase:
    - `orders` table for the order header
    - `order_items` table for each line item
  - Stores total amount in TZS on the order.

- **Orders list**: `/orders`
  - Landing page with options to track orders or access vendor dashboard.
  - Clear guidance for parents vs. vendors.

- **Track order**: `/orders/track`
  - Public order tracking by order ID and access token (no login required).
  - Supports pasting order links or entering credentials manually.
  - Shows order details, line items, payment status, and vendor information.
  - Input validation with real-time feedback and disabled buttons until valid.

- **Order detail**: `/orders/[orderId]`
  - Shows a single order, joined with vendor data and all of its `order_items`.
  - Displays each line item with quantity, item name, category, unit price, and line total.

- **ClickPesa payment**: `/orders/pay/[orderId]`
  - Initiates a mobile money USSD payment via a ClickPesa API route.
  - Requires order ID and public access token for security.
  - Lets you refresh payment status from ClickPesa and see it reflected on the order.
  - Webhook integration with signature verification for automatic status updates.

### Vendor dashboard

- **Vendor auth**: `/auth/login`
  - Email/password login and sign-up backed by Supabase Auth.
  - Maps logged-in users to vendors via a `vendor_users` linking table.
  - Note: Admins must link users to vendors using the admin panel.
- **Dashboard overview**: `/dashboard`
  - **Analytics cards**: Total sales (TZS), paid orders, pending orders, completed orders.
  - **Quick stats**: Inventory count, total orders with navigation links.
  - **Recent orders table**: Last 5 orders with customer, amount, status, payment, date.
  - **Quick links**: View public page, track orders, manage inventory, view all orders.
- **Inventory management**: `/dashboard/inventory`
  - Lists items for the logged-in vendor with category, price in TZS, and stock.
  - Supports creating new items (`/dashboard/inventory/new`) and editing existing ones (`/dashboard/inventory/[itemId]/edit`).
- **Vendor orders view**: `/dashboard/orders`
  - Shows orders for the logged-in vendor with filters (status, date range).
  - Allows updating the `status` of each order from a dropdown.

### Admin panel

- **Admin dashboard**: `/admin`
  - Protected by role-based access control (requires `admin` role in `user_roles` table).
  - **Vendor user management**: Link/unlink users to vendors, view all vendor-user associations.
  - **Admin management**: Grant/revoke admin privileges, view all admins.
  - **Vendor list**: View all registered vendors.
  - Uses JWT bearer token authentication for API calls.
  - Structured logging and consistent error handling across all admin APIs.

---

## Getting around the app

1. **Home** – visit `/` to read what Shuleyetu is and choose where to go next.
2. **Browse vendors** – go to `/vendors` to find a stationery vendor for your school or region, then open their detail page.
3. **Create an order** – use `/orders/new` to pick a vendor, choose textbooks/uniforms/stationery, and fill in student & school details.
4. **Track your order** – use `/orders/track` to check order status, payment status, and details without logging in (requires order link or ID + token).
5. **Pay via ClickPesa** – from an order, open `/orders/pay/[orderId]` to start a mobile money payment and refresh its status.
6. **Vendor dashboard** – log in at `/auth/login` and use `/dashboard`, `/dashboard/inventory`, and `/dashboard/orders` to manage items and track orders for a vendor.
7. **Admin panel** – admins can access `/admin` to manage vendor-user links and admin roles.

---

## Database schema (Supabase)

Defined in `supabase/migrations/20251204_init_shuleyetu_marketplace.sql`:

- **Enums**
  - `item_category`: `textbook | uniform | stationery | other`
  - `order_status`: `pending | awaiting_payment | paid | processing | shipped | completed | cancelled | failed`
  - `payment_status`: `unpaid | pending | paid | refunded | failed`

- **`vendors`**
  - Metadata for stationery shops / school supply vendors.
  - Tanzanian context fields: region, district, ward, street address, optional coordinates.

- **`inventory`**
  - Items sold by vendors (textbooks, uniforms, stationery).
  - References `vendors(id)` via `vendor_id`.
  - Stores `price_tzs`, `stock_quantity`, `category`, and optional metadata.

- **`orders`**
  - One row per checkout.
  - References `vendors(id)`.
  - Captures customer and school context plus `total_amount_tzs`.
  - Tracks `status` and `payment_status` for the order lifecycle.
  - Includes `public_access_token` (UUID) for secure public order tracking without authentication.
  - Includes fields for ClickPesa integration (provider name, provider reference, transaction id, raw payload).

- **`vendor_users`**
  - Links Supabase Auth users to vendors.
  - Allows multiple users per vendor and multiple vendors per user.
  - Used by vendor dashboard to determine which vendor's data to show.

- **`user_roles`**
  - Role-based access control table.
  - Currently supports `admin` role for admin panel access.
  - Protected by RLS policies requiring admin role to modify.

- **`order_items`**
  - Line items per order.
  - References `orders(id)` and `inventory(id)`.
  - Stores `quantity`, `unit_price_tzs`, and a generated `total_price_tzs`.

---

## Local development

1. **Install Node.js**
   - Use the latest LTS from <https://nodejs.org>.

2. **Install dependencies**

   ```bash
   cd shuleyetu-web
   npm install
   ```

3. **Environment variables**

   Copy `.env.local.example` in `shuleyetu-web` to `.env.local` and fill in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://<your-project-ref>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-public-key>"

   CLICKPESA_CLIENT_ID="<your-clickpesa-client-id>"
   CLICKPESA_API_KEY="<your-clickpesa-api-key>"
   CLICKPESA_ENV="sandbox" # or "production"
   ```

   Do **not** commit `.env.local` to version control.

4. **Apply Supabase migrations**

   In the Supabase Dashboard SQL Editor, run each migration file in order:
   
   1. `20251204_init_shuleyetu_marketplace.sql` - Core schema
   2. `20251205_auth_rls_open_ordering.sql` - Auth tables and RLS
   3. `20251221_create_vendor_users_and_user_roles_tables.sql` - Vendor users and roles
   4. `20251221_add_rls_policies.sql` - Additional RLS policies
   5. `20251230_add_orders_public_access_token.sql` - Public order tracking
   6. `20251230_rpc_get_user_id_by_email.sql` - Admin helper function
   7. `20251230_rpc_get_user_emails_by_ids.sql` - Admin helper function

5. **Run tests**

   ```bash
   cd shuleyetu-web
   npm run test
   ```

6. **Run the dev server**

   ```bash
   cd shuleyetu-web
   npm run dev
   ```

   Then open <http://localhost:3000> in your browser.

7. **Build for production**

   ```bash
   npm run build
   ```

### UI/UX improvements

- **Mobile navigation**: Hamburger menu with slide-out navigation for mobile devices.
- **Dark/light theme**: Toggle switch with localStorage persistence and smooth transitions.
- **Skeleton loaders**: Reusable loading components for better perceived performance.
- **PWA support**: Web app manifest, app icons, and meta tags for installable experience on mobile.
- **Multi-language**: English and Swahili translations with language switcher (🇬🇧/🇹🇿).
- **Image uploads**: Component for uploading product images and vendor logos to Supabase Storage.
- **Responsive footer**: Site-wide footer with copyright and quick links.

---

## How Shuleyetu can grow (full potential)

This repository is the foundation for a much richer Tanzanian school supply ecosystem. Some natural next steps:

- **Vendor onboarding portal**
  - Let vendors self-register, manage their profiles, and update inventory via a secure dashboard.
  - Role-based access (admins, vendors, school reps).

- **School-specific catalogs**
  - Link inventory items to specific schools, classes, and terms.
  - Parents select a school and class to see an auto-generated shopping list.

- **Enhanced ClickPesa integration** ✅ Implemented
  - ✅ Payment request and status refresh via Next.js API routes
  - ✅ Webhook endpoint with HMAC SHA256 signature verification
  - ✅ Store provider references and transaction IDs on the `orders` table
  - ✅ Production-ready with environment-based configuration

- **Order tracking and notifications** ✅ Implemented
  - ✅ Public order tracking page with secure token-based access
  - ✅ Vendors can update `order_status` via dashboard
  - ✅ Database migrations applied with `public_access_token` column
  - Future: SMS / WhatsApp notifications to parents

- **Reporting & analytics** ✅ Partially Implemented
  - ✅ Vendor dashboard with total sales, order counts, and status breakdown
  - ✅ Recent orders table with customer, amount, status, and date
  - Future: Detailed charts, popular items, peak buying periods
  - Future: Insights into textbook and uniform demand per region or school

- **Mobile-first and offline-friendly experience** ✅ Partially Implemented
  - ✅ Mobile navigation with hamburger menu
  - ✅ PWA support with manifest and app icons
  - ✅ Responsive design throughout the app
  - Future: Service worker for offline caching
  - Future: React Native or Flutter app backed by the same Supabase API

- **Integrations with schools**
  - Allow schools to publish official booklists and approved vendors.
  - Optional verification of vendors and items by school admins.

---

## Security

### Implemented security measures

- **HTTP Security Headers**: CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS (production)
- **Row Level Security (RLS)**: All database tables protected with granular policies
- **Role-based access control**: Admin panel protected by `user_roles` table
- **Public order access**: Secure token-based access using UUID `public_access_token`
- **ClickPesa webhook verification**: HMAC SHA256 signature validation in production
- **JWT authentication**: Bearer token auth for admin APIs
- **Input validation**: Comprehensive validation on all API routes and forms
- **Structured logging**: Security events and errors logged with context

### Best practices

- **Never commit secrets**: `.env.local` is gitignored. Use `.env.local.example` as a template.
- **Supabase keys**: Only the anon public key is exposed to the browser. Service role key is server-side only.
- **ClickPesa credentials**: Store in environment variables, never hardcode.
- **Rotate keys**: If keys are accidentally committed, rotate them immediately in Supabase/ClickPesa dashboards.

---

## Testing

The project includes unit tests for core business logic:

- **Order tracking utilities** (`src/lib/orderTracking.test.ts`)
- **HTTP authentication helpers** (`src/lib/httpAuth.test.ts`)
- **Public order validation** (`src/lib/publicOrderValidation.test.ts`)

Run tests with:
```bash
cd shuleyetu-web
npm run test
```

---

## Contribution ideas

- Add end-to-end tests with Playwright for critical user flows
- ~~Improve the UI/UX for parents on mobile devices~~ ✅ Done
- Add SMS/WhatsApp notifications for order updates (Africa's Talking API)
- ~~Implement vendor analytics dashboard (sales reports, popular items)~~ ✅ Done
- ~~Add multi-language support (Swahili + English)~~ ✅ Done
- Improve ClickPesa error handling and retry logic
- Add inventory low-stock alerts for vendors
- School-specific catalogs with booklists per class/term
- Vendor profile image uploads
- Product image galleries
