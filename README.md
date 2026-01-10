# Shuleyetu

Tanzanian school supply marketplace that connects parents, schools, and stationery vendors for textbooks, uniforms, and school materials.

This repository currently contains a web app (`shuleyetu-web`) plus a Supabase SQL migration defining the core marketplace schema.

---

## Tech stack

- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS, dark theme by default
- **Backend / DB**: Supabase (PostgreSQL, SQL migrations)
- **Auth & APIs**: Supabase client (`@supabase/supabase-js`)
- **Payments**: ClickPesa (sandbox integration implemented; production hardening and webhooks still to come)

---

## Project structure

- `shuleyetu-web/`
  - Next.js app (App Router, `src/app`)
  - Supabase client configuration (`src/lib/supabaseClient.ts`)
  - Pages for vendors, inventory, and orders
- `supabase/migrations/`
  - `20251204_init_shuleyetu_marketplace.sql`: database schema for vendors, inventory, orders, and order_items

---

## Features implemented

### Home & marketing

- **Landing page**: `/`
  - Explains what Shuleyetu is and who it is for (parents, vendors, schools).
  - Links to browse vendors, create a test order, and open the vendor dashboard.
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
  - Lists recent orders from the `orders` table.
  - Joins to `vendors` to show vendor name.
  - Shows timestamp, customer details, total amount, status, and payment status.

- **Order detail**: `/orders/[orderId]`
  - Shows a single order, joined with vendor data and all of its `order_items`.
  - Displays each line item with quantity, item name, category, unit price, and line total.

- **ClickPesa payment**: `/orders/pay/[orderId]`
  - Initiates a mobile money USSD payment via a ClickPesa API route.
  - Lets you refresh payment status from ClickPesa and see it reflected on the order.

### Vendor dashboard

- **Vendor auth**: `/auth/login`
  - Basic email/password login and sign-up backed by Supabase Auth.
  - Maps logged-in users to vendors via a `vendor_users` linking table.
- **Dashboard overview**: `/dashboard`
  - Shows counts of a vendor's inventory items and orders.
  - Links into detailed inventory and orders management pages.
- **Inventory management**: `/dashboard/inventory`
  - Lists items for the logged-in vendor with category, price in TZS, and stock.
  - Supports creating new items (`/dashboard/inventory/new`) and editing existing ones (`/dashboard/inventory/[itemId]/edit`).
- **Vendor orders view**: `/dashboard/orders`
  - Shows orders for the logged-in vendor with filters (status, date range).
  - Allows updating the `status` of each order from a dropdown.

---

## Getting around the app

1. **Home** – visit `/` to read what Shuleyetu is and choose where to go next.
2. **Browse vendors** – go to `/vendors` to find a stationery vendor for your school or region, then open their detail page.
3. **Create an order** – use `/orders/new` to pick a vendor, choose textbooks/uniforms/stationery, and fill in student & school details.
4. **Pay via ClickPesa** – from an order, open `/orders/pay/[orderId]` to start a mobile money payment and refresh its status.
5. **Vendor dashboard** – log in at `/auth/login` and use `/dashboard`, `/dashboard/inventory`, and `/dashboard/orders` to manage items and track orders for a vendor.

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
  - Includes fields reserved for ClickPesa integration (provider name, provider reference, transaction id, raw payload).

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

4. **Run the dev server**

   ```bash
   cd shuleyetu-web
   npm run dev
   ```

   Then open <http://localhost:3000> in your browser.

5. **Apply the Supabase migration**

   - Open `supabase/migrations/20251204_init_shuleyetu_marketplace.sql`.
   - In the Supabase dashboard, go to **SQL → New query** and paste the contents.
   - Run the query to create the enums and tables.

---

## How Shuleyetu can grow (full potential)

This repository is the foundation for a much richer Tanzanian school supply ecosystem. Some natural next steps:

- **Vendor onboarding portal**
  - Let vendors self-register, manage their profiles, and update inventory via a secure dashboard.
  - Role-based access (admins, vendors, school reps).

- **School-specific catalogs**
  - Link inventory items to specific schools, classes, and terms.
  - Parents select a school and class to see an auto-generated shopping list.

- **ClickPesa integration**
  - Basic payment request and status refresh flows are implemented via Next.js API routes.
  - Store provider references and transaction IDs on the `orders` table.
  - Future work: add webhooks and stronger error handling to keep `payment_status` in sync.

- **Order tracking and notifications**
  - Allow vendors to update `order_status` (processing, shipped, completed).
  - SMS / WhatsApp notifications to parents for payment confirmations and pickup instructions.

- **Reporting & analytics**
  - Dashboards for vendors and schools: popular items, total sales, peak buying periods.
  - Insights into textbook and uniform demand per region or school.

- **Mobile-first and offline-friendly experience**
  - Optimize UI for low-bandwidth and mobile devices.
  - Consider a future React Native or Flutter app backed by the same Supabase API.

- **Integrations with schools**
  - Allow schools to publish official booklists and approved vendors.
  - Optional verification of vendors and items by school admins.

---

## Security notes

- Treat all API keys (Supabase service keys, ClickPesa keys) as secrets.
- Only the **anon public** Supabase key should be exposed to the browser, and only with Row Level Security (RLS) and policies configured.
- Store ClickPesa credentials in environment variables or Supabase secrets for server-side / Edge Function usage.

---

## Contribution ideas

- Improve the UI/UX for parents on mobile devices.
- Extend RLS policies and access control for additional roles (vendors, admins, school reps).
- Improve ClickPesa integration with webhooks, better error handling, and reporting.
- Add automated tests for core flows (creating vendors, inventory, and orders).
