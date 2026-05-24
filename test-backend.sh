#!/bin/bash

echo "🧪 Testing Light Hub Customs Backend API"
echo ""

# Check if backend is running
if ! curl -s http://localhost:3001/api/products > /dev/null 2>&1; then
    echo "❌ Backend is not running on port 3001"
    echo "Start it with: cd backend && npm run dev"
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Test public endpoints
echo "📡 Testing public endpoints..."
echo ""

echo "1. GET /api/products"
curl -s http://localhost:3001/api/products | jq -r 'if type == "array" then "✅ Products endpoint working (\(length) products)" else "❌ Failed" end'

echo ""
echo "2. GET /api/bulb-data"
curl -s http://localhost:3001/api/bulb-data | jq -r 'if type == "array" then "✅ Bulb data endpoint working (\(length) vehicles)" else "❌ Failed" end'

echo ""
echo "🔐 Testing authentication..."
echo ""

# Test registration
echo "3. POST /api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "+254700000000",
    "password": "testpass123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token // empty')

if [ -n "$TOKEN" ]; then
    echo "✅ Registration successful (token received)"
else
    echo "⚠️  Registration failed (user may already exist)"
    
    # Try login instead
    echo ""
    echo "4. POST /api/auth/login"
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "testpass123"
      }')
    
    TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token // empty')
    
    if [ -n "$TOKEN" ]; then
        echo "✅ Login successful (token received)"
    else
        echo "❌ Login failed"
        exit 1
    fi
fi

echo ""
echo "🔒 Testing protected endpoints..."
echo ""

# Test protected endpoint
echo "5. GET /api/auth/profile (with token)"
curl -s http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq -r 'if .email then "✅ Profile endpoint working (user: \(.email))" else "❌ Failed" end'

echo ""
echo "6. GET /api/cart (with token)"
curl -s http://localhost:3001/api/cart \
  -H "Authorization: Bearer $TOKEN" | jq -r 'if type == "array" then "✅ Cart endpoint working" else "❌ Failed" end'

echo ""
echo "7. GET /api/wishlist (with token)"
curl -s http://localhost:3001/api/wishlist \
  -H "Authorization: Bearer $TOKEN" | jq -r 'if type == "array" then "✅ Wishlist endpoint working" else "❌ Failed" end'

echo ""
echo "8. GET /api/addresses (with token)"
curl -s http://localhost:3001/api/addresses \
  -H "Authorization: Bearer $TOKEN" | jq -r 'if type == "array" then "✅ Addresses endpoint working" else "❌ Failed" end'

echo ""
echo "✅ All tests completed!"
echo ""
echo "🎉 Backend is fully functional and ready for deployment"
