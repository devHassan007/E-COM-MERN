# E-Commerce Full Stack App (MERN)

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring product management, order processing, a real-time admin dashboard, live chat support, and a complete returns & refunds system.

## Features

### Admin Dashboard
- Live data pulled directly from MongoDB (no hardcoded values)
- Real-time product, order, and user counts
- Calculated revenue tracking
- Recent orders overview with customer details
- Top 5 selling products
- Manual refresh to reload stats on demand

### Returns & Refunds System

**Customer side**
- Request a return on delivered orders (within a 7-day window)
- Choose between refund or replacement
- Select from predefined return reasons
- Add comments (up to 500 characters)
- Upload up to 5 images to support the request
- Track return status on a dedicated "My Returns" page with a visual progress tracker

**Admin side**
- Manage all returns from `/admin/returns`
- Filter returns by status
- View full return details and uploaded images
- Approve or reject requests with comments
- Schedule pickups
- Confirm item receipt (automatically restores stock)
- Process refunds or create replacement orders
- Delete return requests

### Additional Highlights
- Gradient UI with glassmorphism styling
- Color-coded status badges and animated progress trackers
- Image upload with live preview
- Modal dialogs and toast notifications
- Fully responsive design
- Return eligibility checks with days-remaining indicator
- Authentication & authorization across customer/admin roles

## Return Status Flow

```
Customer Requests → Admin Approves → Pickup Scheduled →
Item Received → Refund / Replacement Processed
```

| Status | Meaning |
|---|---|
| `REQUESTED` | Awaiting admin review |
| `APPROVED` | Admin approved the request |
| `REJECTED` | Admin rejected the request |
| `PICKUP_SCHEDULED` | Pickup has been arranged |
| `ITEM_RECEIVED` | Item is back in the warehouse |
| `REFUNDED` | Money has been returned |
| `REPLACED` | A new replacement order was created |

## Return Eligibility Rules

- Order must be marked **Delivered**
- Request must be made within **7 days** of delivery
- Item must not already have an active return
- Images are required for damaged or wrong-item claims

## Routes

**Customer**
- `/orders` — View your orders
- `/order/:id` — Order details, with a "Request Return" option on eligible items
- `/returns` — Track the status of your return requests

**Admin**
- `/admin/dashboard` — Live stats with a refresh button
- `/admin/returns` — Manage all return requests

## Getting Started

### Backend

```bash
cd backend
npm install
npm start
```

Runs on **port 4000** and connects to MongoDB and Socket.IO on startup.

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on **port 3000** by default.

### Environment Variables

Create a `.env` file inside `frontend/` (and `backend/` as needed) for any keys used by the app, for example:

```
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

> Never commit `.env` files or hardcode API keys/secrets directly in source files — add `.env` to `.gitignore`.

## Testing the App

**Admin Dashboard**
1. Log in as an admin
2. Go to `/admin/dashboard`
3. Confirm product/order/user counts and revenue reflect real data
4. Click "Refresh" to reload stats

**Returns Flow (Customer)**
1. Log in as a customer
2. Place an order and mark it as delivered
3. Go to `/orders` → open the order
4. Click "Request Return" on an eligible item
5. Fill out the form (refund/replacement, reason, comment, images)
6. Submit, then track progress on `/returns`

**Returns Flow (Admin)**
1. Log in as an admin
2. Go to `/admin/returns`
3. Review and approve/reject the request
4. Schedule pickup → confirm item received → process refund or replacement

## Database Collections

- `orders`
- `users`
- `products`
- `returns` — return requests with full status tracking

## Tech Stack

- **Frontend**: React, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Real-time**: Socket.IO (live chat, admin updates)

## Roadmap

- [ ] Payment gateway integration for automated refunds
- [ ] Email notifications for order/return status changes
- [ ] Courier API integration for pickup scheduling
- [ ] Analytics on return reasons
- [ ] Return fraud detection
- [ ] PDF return label generation

## License

Add your license of choice here (e.g. MIT).
