# 🚀 Quick Deployment Reference

## Local Testing
```bash
./start.sh
# Visit: http://localhost:3000
```

## Deploy to Vercel

### Quick Deploy
```bash
npm i -g vercel
vercel --prod
```

### Via GitHub
1. Push to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy

## Environment Variables (Vercel Dashboard)

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
PRODUCTS_TABLE=LH-Products
ORDERS_TABLE=LH-Orders
USERS_TABLE=LH-Users
BULB_DATA_TABLE=LH-BulbData
CART_TABLE=LH-Cart
WISHLIST_TABLE=LH-Wishlist
ADDRESSES_TABLE=LH-Addresses
JWT_SECRET=<random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## Verification
```bash
./verify-cleanup.sh
```

## Documentation
- `DEPLOYMENT_READY.md` - Start here
- `VERCEL_DEPLOYMENT.md` - Detailed guide
- `CLEANUP_REPORT.md` - Technical details

## Cost
- Free: $0/month (100GB bandwidth)
- Pro: $20/month (more bandwidth)

## Support
Check Vercel logs if issues occur.
