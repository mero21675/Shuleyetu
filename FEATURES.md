# Feature Guide

Comprehensive guide to all features in the Shuleyetu application.

---

## Customer Features

### 1. Browse Vendors

**Path**: `/vendors`

Browse all available school supply vendors in Tanzania.

#### Features
- Search vendors by name, location, or description
- Filter by region (Dar es Salaam, Arusha, Mbeya, etc.)
- View vendor details including location and description
- Click to view vendor's products

#### UI Components Used
- Search input with real-time filtering
- Region dropdown filter
- Vendor cards with skeleton loaders
- Empty state when no vendors found

---

### 2. View Vendor Products

**Path**: `/vendors/[vendorId]`

View all products available from a specific vendor.

#### Features
- Browse vendor's inventory
- Filter by category (textbook, uniform, stationery, other)
- View product details (name, price, stock quantity)
- Add items to cart (in order creation flow)

#### UI Components Used
- Vendor header with name and location
- Product list with category badges
- Stock availability indicators
- Skeleton loaders while loading

---

### 3. Create Order

**Path**: `/orders/new`

Multi-step order creation flow with validation.

#### Steps

**Step 1: Select Vendor**
- Browse and select a vendor
- Real-time vendor search
- Vendor cards with descriptions

**Step 2: Select Items**
- View vendor's inventory
- Adjust quantities with +/- buttons
- See item prices and stock levels
- Skeleton loaders while loading items

**Step 3: Customer Information**
- Customer name (required)
- Phone number (required, Tanzanian format)
- Student name (optional)
- School name (optional)
- Real-time validation with helpful error messages

**Step 4: Review & Submit**
- Review selected items and quantities
- Review customer information
- See order total
- Submit order

#### Features
- Progress indicator showing current step
- Validation on each step
- Back/Next navigation
- Toast notifications for errors and success
- Form field validation with real-time feedback

#### UI Components Used
- ProgressSteps component
- FormField components with validation
- CardSkeleton for loading items
- Toast notifications
- EmptyState for no items

---

### 4. Track Order

**Path**: `/orders/track`

Track order status without logging in.

#### Features
- Enter order ID and access token
- Or paste order link directly
- View order details
- See line items with prices
- Check payment status
- View vendor information
- Real-time validation of inputs

#### UI Components Used
- FormField components with validation
- Order details display
- Status badges
- Empty state for no orders

---

### 5. Pay for Order

**Path**: `/orders/pay/[orderId]`

Make payment via ClickPesa mobile money.

#### Features
- Initiate USSD payment
- Enter phone number
- Confirm payment details
- Refresh payment status
- See payment confirmation
- Automatic webhook updates

#### Security
- Requires order ID and access token
- Token-based authentication
- Secure webhook verification

---

## Vendor Features

### 1. Vendor Login

**Path**: `/auth/login`

Email/password authentication for vendors.

#### Features
- Sign up with email and password
- Log in with existing credentials
- Password reset (future)
- Session management
- Secure JWT tokens

#### UI Components Used
- FormField components with validation
- Toast notifications
- Loading states

---

### 2. Vendor Dashboard

**Path**: `/dashboard`

Overview of vendor business metrics and recent activity.

#### Sections

**Analytics Overview**
- Total sales (TZS) with trend indicator
- Paid orders count with trend
- Pending orders count with trend
- Completed orders count with trend

**Charts**
- Sales trend line chart (6-month overview)
- Order status pie chart (distribution)

**Quick Stats**
- Inventory count with link to manage
- Total orders with link to view all
- Quick action to add new items

**Recent Orders Table**
- Last 5 orders
- Customer name
- Order amount (TZS)
- Order status
- Payment status
- Order date

#### UI Components Used
- StatCard components with trend indicators
- LineChart for sales trends
- PieChart for order distribution
- Table with order data
- EmptyState when no orders
- Skeleton loaders while loading

---

### 3. Manage Inventory

**Path**: `/dashboard/inventory`

View and manage vendor's product inventory.

#### Features
- List all inventory items
- View item details (name, category, price, stock)
- Add new items
- Edit existing items
- Delete items (future)
- Search and filter items (future)

#### UI Components Used
- Item list with details
- Add item button
- Edit links
- EmptyState when no items
- Skeleton loaders

---

### 4. Add Inventory Item

**Path**: `/dashboard/inventory/new`

Create a new inventory item.

#### Form Fields
- Item name (required, 2-50 characters)
- Description (optional, max 500 characters)
- Category (required: textbook, uniform, stationery, other)
- Price in TZS (required, positive number)
- Stock quantity (required, positive number)
- Active status (checkbox)

#### Features
- Real-time form validation
- Helpful error messages
- Helper text for each field
- Submit and cancel buttons
- Success toast notification
- Redirect to inventory list on success

#### UI Components Used
- FormField components with validation
- Toast notifications
- Loading states

---

### 5. Edit Inventory Item

**Path**: `/dashboard/inventory/[itemId]/edit`

Edit an existing inventory item.

#### Features
- Load current item data
- Update any field
- Real-time validation
- Save changes
- Success notification
- Redirect to inventory list

#### UI Components Used
- FormField components
- Toast notifications
- Skeleton loaders

---

### 6. View Orders

**Path**: `/dashboard/orders`

View and manage orders for vendor's products.

#### Features
- List all orders for vendor
- Filter by order status (pending, awaiting_payment, paid, processing, completed, cancelled, failed)
- Filter by date range (from/to)
- Update order status
- View order details
- See customer information
- See order total and items

#### UI Components Used
- Filter form with date inputs
- Order list/table
- Status dropdown for updates
- EmptyState when no orders
- Skeleton loaders
- Toast notifications for status updates

---

## Admin Features

### 1. Admin Panel

**Path**: `/admin`

Administrative dashboard for managing vendors and users.

#### Sections

**Vendor User Management**
- Link users to vendors
- Unlink users from vendors
- View all vendor-user associations
- Search and filter associations

**Admin Management**
- Grant admin privileges to users
- Revoke admin privileges
- View all admins
- Search admins

**Vendor List**
- View all registered vendors
- Vendor details
- Search vendors

#### Features
- Role-based access control
- JWT bearer token authentication
- Structured logging
- Error handling
- Success notifications

#### UI Components Used
- Tables for data display
- Forms for actions
- Toast notifications
- Loading states

---

## UI/UX Features

### 1. Toast Notifications

Feedback system for user actions.

#### Types
- **Success**: Green, checkmark icon
- **Error**: Red, X icon
- **Warning**: Amber, warning icon
- **Info**: Blue, info icon

#### Features
- Auto-dismiss after 5 seconds (customizable)
- Manual dismiss button
- Smooth animations
- Positioned at bottom-right
- Multiple notifications stack

#### Usage
```tsx
const { addToast } = useToast();

addToast({
  type: 'success',
  title: 'Order created',
  message: 'Your order has been saved.',
});
```

---

### 2. Skeleton Loaders

Loading placeholders for better perceived performance.

#### Types
- Text skeleton (for paragraphs)
- Circular skeleton (for avatars)
- Card skeleton (for content blocks)
- Table row skeleton (for data tables)
- Vendor card skeleton (pre-configured)

#### Features
- Smooth gradient animation
- Responsive sizing
- Multiple variants
- CSS-based animations (performant)

---

### 3. Form Validation

Real-time validation with helpful feedback.

#### Features
- Instant feedback as user types
- Color-coded borders (error, success)
- Validation icons
- Error messages
- Helper text
- Pre-configured rules
- Custom validation support

#### Validation Types
- Required fields
- Email format
- Phone number format
- Tanzanian phone validation
- Min/max length
- Min/max values
- Pattern matching
- Custom validators

---

### 4. Empty States

Helpful guidance when no data is available.

#### Types
- No orders
- No inventory items
- No vendors
- No search results
- Welcome state
- No notifications

#### Features
- Contextual icons
- Clear descriptions
- Primary action button
- Secondary action link
- Responsive design

---

### 5. Progress Indicators

Visual feedback for multi-step processes.

#### Features
- Step circles with numbers
- Step titles and descriptions
- Connector lines
- Status indicators (pending, active, completed)
- Clickable steps for navigation

---

### 6. Analytics Charts

Data visualization for insights.

#### Chart Types
- **Line Chart**: Trends over time
- **Pie Chart**: Distribution/composition
- **Bar Chart**: Categorical comparison
- **Stat Cards**: Key metrics with trends

#### Features
- SVG-based rendering
- Responsive design
- Color-coded data
- Grid lines and labels
- Smooth animations
- Legend support (pie charts)

---

## Mobile Features

### 1. Responsive Design

All pages optimized for mobile devices.

#### Features
- Mobile-first approach
- Touch-friendly buttons and inputs
- Optimized layouts
- Readable text sizes
- Proper spacing

---

### 2. Mobile Navigation

Hamburger menu for mobile devices.

#### Features
- Slide-out navigation
- Quick access to main pages
- Responsive design
- Touch-friendly

---

### 3. PWA Support

Progressive Web App capabilities.

#### Features
- Installable on home screen
- App manifest
- App icons
- Meta tags
- Offline support (future)

---

## Security Features

### 1. Authentication

Secure user authentication.

#### Features
- Email/password login
- Supabase Auth integration
- JWT tokens
- Session management
- Secure password storage

---

### 2. Authorization

Role-based access control.

#### Roles
- **User**: Regular vendor or customer
- **Admin**: Administrative access

#### Features
- Row Level Security (RLS)
- Role-based policies
- Vendor-specific data access
- Admin-only endpoints

---

### 3. Public Order Access

Secure token-based order tracking.

#### Features
- UUID access tokens
- No authentication required
- Secure token validation
- Limited data exposure

---

### 4. Payment Security

Secure payment processing.

#### Features
- ClickPesa integration
- HMAC SHA256 signature verification
- Webhook validation
- Environment-based configuration
- Secure credential storage

---

## Data Features

### 1. Real-time Updates

Live data synchronization.

#### Features
- Supabase real-time subscriptions
- Automatic data refresh
- Order status updates
- Payment status updates

---

### 2. Data Validation

Comprehensive input validation.

#### Features
- Client-side validation
- Server-side validation
- Type checking
- Business logic validation
- Error messages

---

### 3. Data Persistence

Reliable data storage.

#### Features
- Supabase PostgreSQL
- Row Level Security
- Backup and recovery
- Data integrity
- Transaction support

---

## Future Features

### Planned Enhancements

- [ ] SMS/WhatsApp notifications
- [ ] Inventory low-stock alerts
- [ ] School-specific catalogs
- [ ] Vendor profile images
- [ ] Product image galleries
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Order history
- [ ] Vendor ratings and reviews
- [ ] Multi-language support (Swahili)
- [ ] Dark/light mode toggle
- [ ] Offline support
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics
- [ ] Bulk order management
- [ ] Vendor onboarding flow
- [ ] Email notifications
- [ ] Order export (PDF/CSV)
- [ ] Inventory forecasting
- [ ] Seasonal promotions

---

## Performance Features

### 1. Optimization

- Code splitting
- Image optimization
- CSS minification
- JavaScript minification
- Caching strategies

### 2. Monitoring

- Error tracking
- Performance monitoring
- User analytics
- Structured logging

---

## Accessibility Features

### 1. WCAG 2.1 Compliance

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast
- Focus indicators
- Screen reader support

### 2. Keyboard Navigation

- Tab through form fields
- Enter to submit
- Escape to close modals
- Arrow keys for navigation

---

## Testing Features

### 1. Unit Tests

- Order tracking utilities
- HTTP authentication
- Public order validation

### 2. Integration Tests

- Form submission
- Order creation flow
- Payment processing

### 3. E2E Tests (Planned)

- Critical user flows
- Cross-browser testing
- Mobile testing

---

## API Features

### 1. REST APIs

- Admin management endpoints
- ClickPesa payment endpoints
- Public order access endpoints

### 2. Real-time APIs

- Supabase real-time subscriptions
- WebSocket connections
- Live data updates

### 3. Webhooks

- ClickPesa payment webhooks
- Order status webhooks
- Error notifications

---

## Monitoring & Logging

### 1. Structured Logging

- Request logging
- Error logging
- Security event logging
- Performance logging

### 2. Error Handling

- Try-catch blocks
- Error boundaries
- User-friendly error messages
- Error recovery

### 3. Analytics

- User behavior tracking
- Feature usage
- Performance metrics
- Error rates

---

## Deployment Features

### 1. Production Ready

- Environment configuration
- Security headers
- CORS configuration
- Rate limiting (future)

### 2. CI/CD

- Automated testing
- Build automation
- Deployment automation
- Version control

### 3. Monitoring

- Uptime monitoring
- Error tracking
- Performance monitoring
- User analytics
