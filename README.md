# Rodella Ecommerce

Rodella Ecommerce is a React-based composites storefront with customer-facing product flows, cart and checkout, user account management, and a protected admin dashboard for operations.

## Tech Stack

- React (Vite)
- React Router
- Firebase Authentication
- Firebase Firestore
- Razorpay Checkout
- Framer Motion
- React Helmet Async (SEO metadata)
- Formspree (contact form submission)

## Core Features

- Product browsing across major categories:
  - Composite Tubes
  - Composite Plates
  - Reinforcement
  - Core Material
  - Epoxy System
- Product configuration/calculation flows for tube and plate products
- Cart management with quantity updates and total calculation
- Auth-protected checkout flow
- Online payment with Razorpay
- Order creation and order history tracking
- User profile management (name, email, phone, address)
- Contact page with form submission + WhatsApp/email quick actions
- SEO support with metadata and structured data components

## Routes

### Public Routes

- `/`
- `/contact`
- `/Composite-tubes`
- `/composite-plates`
- `/reinforcement`
- `/core-material`
- `/epoxy-system`

### User Auth and Protected Routes

- `/login`
- `/signup`
- `/dashboard` (protected)
- `/cart` (protected)

### Admin Routes

- `/rodella-admin-access` (admin login)
- `/rodella-admin-dashboard` (admin only)

## Admin Panel Features

The admin dashboard includes:

- Dashboard metrics:
  - Total users
  - Total orders
  - Revenue
  - Active carts
  - Order status counts
- User management view:
  - User list
  - Role badges (`Admin` / `User`)
  - Profile and activity details
- Orders management:
  - Search and filtering
  - Order detail modal
  - Order status updates (`Pending`, `Processing`, `Completed`, `Cancelled`)
- Active carts visibility for users

## How Admin Access Works

Admin authorization is based on Firestore user document data:

- A user is considered admin only when:
  - `users/{uid}.isAdmin === true`
- Admin route protection checks this field before granting access.

## How To Make Any User Admin

Important: **Current admin dashboard UI does not include a "Make Admin" button yet.**

To promote a user to admin right now:

1. Open Firebase Console.
2. Go to Firestore Database.
3. Open the `users` collection.
4. Find the target user's document (document ID = Firebase Auth `uid`).
5. Set field:
   - `isAdmin: true` (Boolean)
6. Ask the user to log out and log in again.
7. User can then access:
   - `/rodella-admin-access`
   - `/rodella-admin-dashboard`

If you want, this project can be extended with an admin-only toggle action in the dashboard to promote/demote users directly from UI.

## Data Collections (Firestore)

- `users`:
  - Profile fields
  - `isAdmin` role flag
- `orders`:
  - Customer/order details
  - Status and payment metadata
- `carts`:
  - User cart items and pricing data

## Public/SEO Files

- `public/robots.txt`
- `public/sitemap.xml`

## Local Development

1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Build for production:
   - `npm run build`
4. Preview production build:
   - `npm run preview`

## Configuration Notes

Current project includes service configuration in source files (Firebase/Razorpay/Formspree). For production hardening, move secrets and environment-specific values into environment variables.

Suggested env keys:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_RAZORPAY_KEY_ID`
- `VITE_FORMSPREE_FORM_ID`
