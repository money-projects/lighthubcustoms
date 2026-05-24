# Light Hub Customs - Backend

Secure Node.js backend with JWT authentication and AWS DynamoDB integration.

## Features

- ✅ JWT token-based authentication
- ✅ Secure AWS credentials (server-side only)
- ✅ RESTful API endpoints
- ✅ Role-based access control (User/Admin)
- ✅ Password hashing with bcrypt
- ✅ CORS enabled for frontend

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `.env`

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (requires auth)

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)

### Orders
- GET `/api/orders` - Get user orders (requires auth)
- GET `/api/orders/all` - Get all orders (admin only)
- GET `/api/orders/:id` - Get order by ID (requires auth)
- POST `/api/orders` - Create order (requires auth)
- PUT `/api/orders/:id` - Update order status (admin only)
- DELETE `/api/orders/:id` - Delete order (admin only)

### Cart
- GET `/api/cart` - Get user cart (requires auth)
- POST `/api/cart` - Save cart (requires auth)

### Wishlist
- GET `/api/wishlist` - Get user wishlist (requires auth)
- POST `/api/wishlist` - Save wishlist (requires auth)

### Addresses
- GET `/api/addresses` - Get user addresses (requires auth)
- POST `/api/addresses` - Save address (requires auth)
- DELETE `/api/addresses/:id` - Delete address (requires auth)

### Bulb Data
- GET `/api/bulb-data` - Get all bulb data
- GET `/api/bulb-data/:make/:model` - Get bulb data by vehicle

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is returned on successful login/registration.

## Deployment

The backend is configured for Vercel deployment. The `vercel.json` file handles routing.

Deploy command:
```bash
vercel --prod
```
