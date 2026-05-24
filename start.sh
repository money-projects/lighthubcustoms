#!/bin/bash

echo "🚀 Starting Light Hub Customs Full Stack Application"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Dependencies installed"
echo ""
echo "🔧 Starting backend server on port 3001..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "🔧 Starting frontend dev server on port 3000..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started!"
echo ""
echo "📡 Backend API: http://localhost:3001/api"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
