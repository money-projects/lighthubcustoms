# Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

## Required Variables

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-aws-access-key-here>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key-here>
PRODUCTS_TABLE=LH-Products
ORDERS_TABLE=LH-Orders
USERS_TABLE=LH-Users
BULB_DATA_TABLE=LH-BulbData
CART_TABLE=LH-Cart
WISHLIST_TABLE=LH-Wishlist
ADDRESSES_TABLE=LH-Addresses
JWT_SECRET=<generate-random-secret-here>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## How to Get Values

### AWS Credentials
1. Go to AWS Console → IAM
2. Create new user with DynamoDB access
3. Generate access keys
4. Copy `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

### JWT Secret
Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Important
- Never commit these values to GitHub
- Keep `.env` files in `.gitignore`
- Only add secrets in Vercel Dashboard
