#!/bin/bash

echo "🔍 Light Hub Customs - System Verification"
echo "=========================================="
echo ""

# Check if demo files are removed
echo "✓ Checking for demo/simulation files..."
if [ ! -f "src/services/dynamodb.ts" ] && [ ! -f "src/config/aws-config.ts" ]; then
    echo "  ✅ Demo files removed successfully"
else
    echo "  ❌ Demo files still exist"
    exit 1
fi

# Check frontend .env
echo ""
echo "✓ Checking frontend environment..."
if grep -q "VITE_AWS_ACCESS_KEY_ID" .env 2>/dev/null; then
    echo "  ❌ AWS credentials still in frontend .env"
    exit 1
else
    echo "  ✅ No AWS credentials in frontend .env"
fi

# Check backend .env
echo ""
echo "✓ Checking backend environment..."
if [ -f "backend/.env" ]; then
    if grep -q "AWS_ACCESS_KEY_ID" backend/.env; then
        echo "  ✅ Backend has AWS credentials (correct)"
    else
        echo "  ⚠️  Backend missing AWS credentials"
    fi
else
    echo "  ❌ Backend .env not found"
    exit 1
fi

# Check for dynamodb imports
echo ""
echo "✓ Checking for old DynamoDB imports..."
if grep -r "from.*dynamodb" src/ 2>/dev/null | grep -v node_modules; then
    echo "  ❌ Found DynamoDB imports in frontend"
    exit 1
else
    echo "  ✅ No DynamoDB imports in frontend"
fi

# Check for apiClient usage
echo ""
echo "✓ Checking for backend API usage..."
if grep -r "apiClient" src/context/AppContext.tsx src/services/api.ts 2>/dev/null | grep -q "apiClient"; then
    echo "  ✅ Using backend API (apiClient)"
else
    echo "  ❌ Not using backend API"
    exit 1
fi

# Check deployment files
echo ""
echo "✓ Checking deployment configuration..."
if [ -f "render.yaml" ] && [ -f "RENDER_DEPLOYMENT.md" ]; then
    echo "  ✅ Render deployment files present"
else
    echo "  ❌ Missing deployment files"
    exit 1
fi

# Check backend structure
echo ""
echo "✓ Checking backend structure..."
if [ -f "backend/server.js" ] && [ -d "backend/controllers" ] && [ -d "backend/routes" ]; then
    echo "  ✅ Backend structure correct"
else
    echo "  ❌ Backend structure incomplete"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ All checks passed!"
echo ""
echo "📋 Next Steps:"
echo "1. Test locally: ./start.sh"
echo "2. Push to GitHub"
echo "3. Deploy to Render (see RENDER_DEPLOYMENT.md)"
echo ""
