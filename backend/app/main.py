from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/")
def root():
    return {"message": "Radiant Motors API running"}
