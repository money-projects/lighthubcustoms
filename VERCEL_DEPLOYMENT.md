# 🚀 Vercel Deployment Guide

## Quick Deploy

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
vercel --prod
```

That's it! Vercel will:
- Deploy frontend and backend together
- Configure routes automatically
- Set up environment variables
- Provide a production URL

## Environment Variables

Add these in Vercel Dashboard (Settings → Environment Variables):

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

## Manual Deployment

### Via GitHub

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Deploy to Vercel"
git push
```

2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy

### Via CLI

```bash
# Login
vercel login

# Deploy
vercel --prod
```

## Configuration

The `vercel.json` file handles:
- Backend API routes (`/api/*`)
- Frontend static files
- Environment variables

## Testing

**Local:**
```bash
vercel dev
```

**Production:**
Visit your Vercel URL after deployment

## Cost

- **Hobby (Free):** Unlimited deployments, 100GB bandwidth
- **Pro ($20/month):** More bandwidth, team features

## Troubleshooting

**Backend errors:**
- Check Vercel logs
- Verify environment variables
- Ensure AWS credentials are valid

**Frontend errors:**
- Check browser console
- Verify API routes work: `https://your-app.vercel.app/api/products`

## Custom Domain

1. Go to Vercel Dashboard
2. Settings → Domains
3. Add your domain
4. Update DNS records

---

**Status:** Ready for Vercel deployment
