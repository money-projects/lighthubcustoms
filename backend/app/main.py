from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.routers import (
    auth, users, products, categories,
    cart, wishlist, orders, addresses,
    reviews, coupons, notifications, bulb_data, admin
)

app = FastAPI(title="Radiant Motors API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/api/auth",          tags=["Auth"])
app.include_router(users.router,         prefix="/api/users",         tags=["Users"])
app.include_router(products.router,      prefix="/api/products",      tags=["Products"])
app.include_router(categories.router,    prefix="/api/categories",    tags=["Categories"])
app.include_router(cart.router,          prefix="/api/cart",          tags=["Cart"])
app.include_router(wishlist.router,      prefix="/api/wishlist",      tags=["Wishlist"])
app.include_router(orders.router,        prefix="/api/orders",        tags=["Orders"])
app.include_router(addresses.router,     prefix="/api/addresses",     tags=["Addresses"])
app.include_router(reviews.router,       prefix="/api/reviews",       tags=["Reviews"])
app.include_router(coupons.router,       prefix="/api/coupons",       tags=["Coupons"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(bulb_data.router,     prefix="/api/bulb-data",     tags=["Bulb Data"])
app.include_router(admin.router,         prefix="/api/admin",         tags=["Admin"])

@app.get("/", response_class=HTMLResponse)
def root():
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Radiant Motors API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0a0a0a;
      color: #e5e5e5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      max-width: 480px;
      width: 100%;
      padding: 48px 40px;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      background: #111;
    }
    .dot {
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #22c55e;
      margin-right: 8px;
      vertical-align: middle;
    }
    .status {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 32px;
    }
    h1 {
      font-size: 22px;
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }
    p {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 36px;
      line-height: 1.6;
    }
    .links { display: flex; flex-direction: column; gap: 10px; }
    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-radius: 8px;
      border: 1px solid #1f1f1f;
      background: #0a0a0a;
      color: #e5e5e5;
      text-decoration: none;
      font-size: 14px;
      transition: border-color 0.15s, background 0.15s;
    }
    a:hover { border-color: #3f3f3f; background: #141414; }
    a span { color: #4b5563; font-size: 13px; }
    .version {
      margin-top: 36px;
      font-size: 12px;
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="status"><span class="dot"></span>Online</div>
    <h1>Radiant Motors API</h1>
    <p>Backend service for the Radiant Motors e-commerce platform.</p>
    <div class="links">
      <a href="/docs">
        Interactive Docs (Swagger)
        <span>→</span>
      </a>
      <a href="/redoc">
        Reference Docs (ReDoc)
        <span>→</span>
      </a>
      <a href="/api/products">
        Products Endpoint
        <span>→</span>
      </a>
    </div>
    <div class="version">v1.0.0</div>
  </div>
</body>
</html>"""
