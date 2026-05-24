# 🚗 Light Hub Customs - Full Stack E-Commerce Platform

Complete automotive LED lighting e-commerce platform with secure backend API, JWT authentication, and AWS DynamoDB integration.

## 🎯 Features

- ✅ **Secure Authentication** - JWT tokens, password hashing, role-based access
- ✅ **Product Management** - Full CRUD operations with admin controls
- ✅ **Shopping Cart & Wishlist** - Persistent across sessions
- ✅ **Order Management** - Complete order lifecycle tracking
- ✅ **Vehicle Fitment Guide** - Find the right bulbs for any vehicle
- ✅ **User Profiles** - Address management, order history
- ✅ **Admin Dashboard** - Product & order management
- ✅ **Responsive Design** - Works on all devices
- ✅ **Production Ready** - Vercel deployment configured

## 🏗️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons
- Motion (Framer Motion)

**Backend:**
- Node.js + Express
- JWT Authentication
- bcryptjs for password hashing
- AWS SDK v3

**Database:**
- AWS DynamoDB

**Deployment:**
- Vercel (Frontend + Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS account with DynamoDB tables

### Installation

1. **Clone and navigate to project**
```bash
cd /home/fagitone/Downloads/light-hub-customs
```

2. **Start everything (automated)**
```bash
./start.sh
```

This will:
- Install all dependencies
- Start backend on port 3001
- Start frontend on port 3000

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
npm install
npm run dev
```

## 🔐 Authentication

The system uses JWT token authentication:

1. Register or login to get a token
2. Token is automatically stored and sent with requests
3. Token expires in 7 days (configurable)

**Default Admin Account:**
- Email: `dallaherick0@gmail.com`
- Create during first registration

## 📡 API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

**Base URL:** `http://localhost:3001/api`

**Key Endpoints:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/cart` - Get cart
- `GET /api/wishlist` - Get wishlist

## 🌐 Environment Variables

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend (backend/.env):**
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

## 🚢 Deployment

### Deploy to Vercel

**Quick Deploy:**
```bash
npm i -g vercel
vercel --prod
```

**Via GitHub:**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete guide.

**Cost:** Free tier available

## 🧪 Testing

**Test backend API:**
```bash
./test-backend.sh
```

**Manual testing:**
```bash
# Test products endpoint
curl http://localhost:3001/api/products

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","phone":"+254700000000","password":"test123"}'
```

## 📁 Project Structure

```
light-hub-customs/
├── backend/                    # Node.js backend
│   ├── config/                # AWS configuration
│   ├── controllers/           # API controllers
│   ├── middleware/            # Auth middleware
│   ├── routes/                # API routes
│   └── server.js              # Express server
├── src/                       # React frontend
│   ├── components/            # React components
│   ├── context/               # App context
│   ├── services/              # API services
│   ├── data/                  # Static data
│   └── types.ts               # TypeScript types
├── vercel.json                # Vercel config
├── start.sh                   # Startup script
└── test-backend.sh            # Test script
```

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ AWS credentials server-side only
- ✅ Role-based access control
- ✅ Protected API endpoints
- ✅ CORS protection
- ✅ Input validation

## 📚 Documentation

- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Setup completion guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick reference
- [backend/README.md](backend/README.md) - Backend API docs

## 🐛 Troubleshooting

**Backend won't start:**
```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

**Frontend can't connect:**
1. Ensure backend is running
2. Check VITE_API_BASE_URL in .env
3. Clear browser cache

**Authentication errors:**
1. Check JWT_SECRET in backend/.env
2. Clear localStorage in browser
3. Try registering a new user

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review backend logs
3. Test with test-backend.sh script

## 📝 License

Private project - All rights reserved

## 🎉 Credits

Built with ❤️ for Light Hub Customs
