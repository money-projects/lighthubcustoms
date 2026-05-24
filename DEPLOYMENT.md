# Light Hub Customs - Full Stack Application

Complete e-commerce platform for automotive LED lighting with secure backend API.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + JWT Authentication
- **Database**: AWS DynamoDB
- **Deployment**: Vercel

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
./start.sh
```

This will:
- Install all dependencies (frontend + backend)
- Start backend server on port 3001
- Start frontend dev server on port 3000

### Option 2: Manual Setup

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
npm install
```

3. **Start Backend Server**
```bash
cd backend
npm run dev
```

4. **Start Frontend (in new terminal)**
```bash
npm run dev
```

## 🔐 Authentication

The system now uses **secure JWT token authentication**:

- All API requests require authentication
- Passwords are hashed with bcrypt
- AWS credentials are server-side only (not exposed to frontend)
- Token expires in 7 days (configurable)

### Default Admin Account

For testing, create an admin account:
- Email: `dallaherick0@gmail.com`
- Password: (set during registration)

## 📡 API Endpoints

All endpoints are prefixed with `/api`:

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/bulb-data` - Get vehicle bulb data

### Authentication Required
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/cart` - Get cart
- `POST /api/cart` - Save cart
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Save wishlist
- `GET /api/addresses` - Get addresses
- `POST /api/addresses` - Save address

### Admin Only
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders/all` - Get all orders
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Backend (backend/.env)
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
PRODUCTS_TABLE=LH-Products
ORDERS_TABLE=LH-Orders
USERS_TABLE=LH-Users
BULB_DATA_TABLE=LH-BulbData
CART_TABLE=LH-Cart
WISHLIST_TABLE=LH-Wishlist
ADDRESSES_TABLE=LH-Addresses
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PORT=3001
```

## 📦 Deployment to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Build Frontend**
```bash
npm run build
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set Environment Variables in Vercel Dashboard**
- Add all backend environment variables
- Update `VITE_API_BASE_URL` to your Vercel backend URL

## 🔒 Security Features

✅ JWT token-based authentication  
✅ Password hashing with bcrypt  
✅ AWS credentials server-side only  
✅ Role-based access control (User/Admin)  
✅ CORS protection  
✅ Input validation  
✅ Secure HTTP headers  

## 🛠️ Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
light-hub-customs/
├── backend/
│   ├── config/
│   │   └── aws.js          # AWS DynamoDB configuration
│   ├── controllers/
│   │   └── index.js        # All API controllers
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── routes/
│   │   └── index.js        # API routes
│   ├── server.js           # Express server
│   ├── package.json
│   └── .env
├── src/
│   ├── components/         # React components
│   ├── context/            # React context (AppContext)
│   ├── services/
│   │   ├── apiClient.ts    # Backend API client
│   │   ├── dynamodb.ts     # DynamoDB service (now uses backend)
│   │   └── api.ts          # Service layer
│   ├── data/               # Static data
│   └── types.ts            # TypeScript types
├── vercel.json             # Vercel deployment config
├── start.sh                # Startup script
└── package.json
```

## 🎯 Features

- ✅ Product catalog with categories
- ✅ Vehicle fitment guide (bulb finder)
- ✅ Shopping cart & wishlist
- ✅ User authentication & profiles
- ✅ Order management
- ✅ Admin dashboard
- ✅ Address management
- ✅ Secure checkout
- ✅ Order tracking

## 📝 Notes

- Frontend runs on port 3000
- Backend runs on port 3001
- All data is stored in AWS DynamoDB
- No demo data - clean production-ready system
- Frontend automatically connects to backend API

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 3001 is available
- Verify AWS credentials in backend/.env
- Run `cd backend && npm install`

**Frontend can't connect to backend:**
- Ensure backend is running on port 3001
- Check VITE_API_BASE_URL in .env
- Clear browser cache and localStorage

**Authentication errors:**
- Check JWT_SECRET is set in backend/.env
- Verify token is being sent in Authorization header
- Check token hasn't expired

## 📞 Support

For issues or questions, check the backend/README.md for detailed API documentation.
