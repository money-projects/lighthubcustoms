# STEP 7 — Seeding, Testing & Deployment

---

## 7.1 Seed Products from results.csv

### `scripts/seed_products.py`
```python
import csv, json, os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY"))

CSV_PATH = os.path.join(os.path.dirname(__file__), "../../results.csv")

def parse_images(raw):
    if not raw or not raw.strip():
        return []
    try:
        return [i.get("S", "") for i in json.loads(raw) if "S" in i]
    except:
        return []

def seed():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = [{
            "product_id":     r["productId"],
            "name":           r["name"],
            "category":       r["category"],
            "section":        r["section"],
            "price":          int(r["price"]) if r["price"] else 0,
            "description":    r["description"],
            "specifications": r["specifications"],
            "image_url":      r["imageUrl"],
            "images":         parse_images(r.get("images", "")),
            "discount":       r.get("discount", ""),
            "stock":          0,
            "is_active":      True,
        } for r in csv.DictReader(f)]

    for i in range(0, len(rows), 50):
        supabase.table("products").upsert(rows[i:i+50]).execute()
    print(f"Seeded {len(rows)} products")

if __name__ == "__main__":
    seed()
```

```bash
cd backend
python scripts/seed_products.py
```

---

## 7.2 Manual API Testing (curl)

```bash
BASE=http://localhost:8000/api

# Register
curl -X POST $BASE/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","phone":"0700000000","password":"pass123"}'

# Login — copy token from response
curl -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

TOKEN=your_token_here

# Get products
curl $BASE/products

# Get cart
curl $BASE/cart -H "Authorization: Bearer $TOKEN"

# Add to cart
curl -X POST $BASE/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PROD-123","quantity":2}'

# Create order
curl -X POST $BASE/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"productId":"PROD-123","name":"H11 Bulb","price":4500,"quantity":1,"image":""}],
    "subtotal":4500,"shipping":200,"total":4700,
    "payment_method":"mpesa","delivery_method":"standard",
    "shipping_info":{"fullName":"John","email":"j@j.com","phone":"0700000000","address":"Ngong Rd","city":"Nairobi","county":"Nairobi","postalCode":"00100"}
  }'

# Validate coupon
curl -X POST $BASE/coupons/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","order_total":5000}'

# Admin stats
curl $BASE/admin/stats -H "Authorization: Bearer $TOKEN"
```

---

## 7.3 Swagger UI

All endpoints are auto-documented. Visit:
```
http://localhost:8000/docs
```
Use the **Authorize** button → paste Bearer token to test protected routes.

---

## 7.4 Deploy to Render

1. Push to GitHub
2. Render → New Web Service → connect repo
3. Set:
   - Root directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`
5. Deploy

---

## 7.5 Production Checklist

- [ ] Set `allow_origins` to your frontend URL only
- [ ] Use `openssl rand -hex 32` for `JWT_SECRET`
- [ ] Enable RLS on all Supabase tables
- [ ] Run seed script after first deploy
- [ ] Verify `/docs` is accessible and all 80 endpoints appear
- [ ] Test auth flow end to end
- [ ] Test admin endpoints with admin account

---

## Build Order Summary

| Step | File | What it builds |
|---|---|---|
| 1 | STEP_01 | Project setup, venv, config, database, dependencies, main.py |
| 2 | STEP_02 | All Supabase SQL tables |
| 3 | STEP_03 | Full endpoint reference (80 endpoints) |
| 4 | STEP_04 | Auth, Users, Products, Categories |
| 5 | STEP_05 | Cart, Wishlist, Orders, Addresses |
| 6 | STEP_06 | Reviews, Coupons, Notifications, Bulb Data, Admin Stats |
| 7 | STEP_07 | Seeding, testing, deployment |
