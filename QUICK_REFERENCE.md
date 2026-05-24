# Quick Reference - Light Hub Customs

## 🚀 Start Application
```bash
./start.sh
```

## 🧪 Test Backend
```bash
./test-backend.sh
```

## 📡 URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## 🔑 Default Admin
- Email: dallaherick0@gmail.com
- Password: (set during registration)

## 📦 Commands

### Development
```bash
# Start both servers
./start.sh

# Start backend only
cd backend && npm run dev

# Start frontend only
npm run dev
```

### Build
```bash
# Build frontend
npm run build

# Install backend deps
cd backend && npm install
```

### Deploy
```bash
# Deploy to Vercel
vercel --prod
```

## 🔐 Authentication Flow

1. **Register**: POST `/api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "name": "User Name",
     "phone": "+254700000000",
     "password": "password123"
   }
   ```

2. **Login**: POST `/api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Use Token**: Add to headers
   ```
   Authorization: Bearer <token>
   ```

## 📁 Key Files

- `backend/server.js` - Main server
- `backend/controllers/index.js` - API logic
- `src/services/apiClient.ts` - Frontend API client
- `src/context/AppContext.tsx` - App state
- `.env` - Frontend config
- `backend/.env` - Backend config

## 🐛 Quick Fixes

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Clear everything
```bash
# Clear node_modules
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

### Reset user data
```bash
# Clear localStorage in browser console
localStorage.clear()
```

## 📊 Project Structure
```
light-hub-customs/
├── backend/           # Node.js API server
├── src/              # React frontend
├── dist/             # Built frontend
├── .env              # Frontend config
└── vercel.json       # Deployment config
```

## ✅ Checklist
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts on 3001
- [ ] Frontend starts on 3000
- [ ] Can register user
- [ ] Can login
- [ ] Products load
- [ ] Cart works
- [ ] Orders work
