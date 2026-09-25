# EstateHub — Full-Stack Real Estate Marketplace

A modern, full-stack real-estate marketplace with buyer, seller, and admin roles, built as two
completely separate apps: `frontend/` (React + Vite) and `backend/` (Node.js + Express + MongoDB).

## Folder Structure

```
estatehub/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Enquiry.js
│   │   ├── Offer.js
│   │   ├── SiteVisit.js
│   │   ├── Wishlist.js
│   │   └── Report.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/           (uploaded property images land here)
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── buyer/
    │   │   ├── seller/
    │   │   └── admin/
    │   ├── layouts/
    │   ├── services/       (Axios API calls)
    │   ├── context/
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Getting Started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit .env (see variables below)
npm run dev
```

The API runs on `http://localhost:5000` by default. You need a running MongoDB instance
(local `mongod` or a free MongoDB Atlas cluster).

**Backend .env variables:**

| Variable | Description |
|---|---|
| `PORT` | Port the API server runs on (default `5000`) |
| `MONGO_URI` | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/estatehub` |
| `JWT_SECRET` | A long random string used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS, e.g. `http://localhost:5173` |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then edit .env if your API runs elsewhere
npm run dev
```

The app runs on `http://localhost:5173` by default.

**Frontend .env variables:**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

### 3. Creating your first admin

Registration only creates `buyer` or `seller` accounts. To get an admin account, register as a
buyer, then manually update that user's `role` field to `"admin"` directly in MongoDB (e.g. via
MongoDB Compass or the `mongosh` shell):

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Core Features

- **JWT authentication** with bcrypt-hashed passwords and role-based route protection
  (`buyer`, `seller`, `admin`).
- **Property listings** with multi-image upload (Multer), search & filters (keyword, city,
  buy/rent, property type, price range, bedrooms), and pagination.
- **Buyer tools:** wishlist, enquiries, offers (with seller accept/reject/counter), site-visit
  requests, and profile management.
- **Seller tools:** add/edit/delete listings, view & respond to enquiries/offers/site visits,
  mark properties as sold.
- **Admin tools:** dashboard statistics, approve/reject listings, manage users (block/delete),
  manage reports.

## Notes

- Uploaded images are stored in `backend/uploads/` and served statically at `/uploads/...`.
- All property data is demo/fictional — seed your own listings by registering as a seller and
  adding properties (they'll need admin approval to appear publicly).
- This project is intentionally kept simple and dependency-light so it's easy to extend further
  in Antigravity or any other IDE.
