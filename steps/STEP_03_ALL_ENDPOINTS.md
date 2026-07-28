# STEP 3 — All Endpoints Reference

Complete endpoint catalogue for the Radiant Motors backend.
Every endpoint listed here must be implemented.

---

## AUTH  `/api/auth`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public | Register new user |
| 2 | POST | `/api/auth/login` | Public | Login, returns JWT |
| 3 | GET | `/api/auth/profile` | User | Get own profile |
| 4 | PUT | `/api/auth/profile` | User | Update name/phone |
| 5 | PUT | `/api/auth/change-password` | User | Change password |
| 6 | POST | `/api/auth/logout` | User | Invalidate session (client-side token drop) |

---

## USERS  `/api/users`  (Admin only)

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 7 | GET | `/api/users` | Admin | List all users |
| 8 | GET | `/api/users/{email}` | Admin | Get single user |
| 9 | PUT | `/api/users/{email}/role` | Admin | Change user role |
| 10 | DELETE | `/api/users/{email}` | Admin | Delete user |

---

## PRODUCTS  `/api/products`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 11 | GET | `/api/products` | Public | List all active products |
| 12 | GET | `/api/products/{id}` | Public | Get single product |
| 13 | GET | `/api/products/category/{category}` | Public | Filter by category |
| 14 | GET | `/api/products/section/{section}` | Public | Filter by section (best-seller etc) |
| 15 | GET | `/api/products/search?q=` | Public | Search by name/description |
| 16 | POST | `/api/products` | Admin | Create product |
| 17 | PUT | `/api/products/{id}` | Admin | Update product |
| 18 | DELETE | `/api/products/{id}` | Admin | Delete product |
| 19 | PUT | `/api/products/{id}/stock` | Admin | Update stock quantity |
| 20 | PUT | `/api/products/{id}/toggle` | Admin | Activate / deactivate product |

---

## CATEGORIES  `/api/categories`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 21 | GET | `/api/categories` | Public | List all categories |
| 22 | GET | `/api/categories/{id}` | Public | Get single category |
| 23 | POST | `/api/categories` | Admin | Create category |
| 24 | PUT | `/api/categories/{id}` | Admin | Update category |
| 25 | DELETE | `/api/categories/{id}` | Admin | Delete category |

---

## CART  `/api/cart`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 26 | GET | `/api/cart` | User | Get cart items |
| 27 | POST | `/api/cart` | User | Save/replace full cart |
| 28 | POST | `/api/cart/add` | User | Add single item to cart |
| 29 | PUT | `/api/cart/item/{product_id}` | User | Update item quantity |
| 30 | DELETE | `/api/cart/item/{product_id}` | User | Remove single item |
| 31 | DELETE | `/api/cart` | User | Clear entire cart |

---

## WISHLIST  `/api/wishlist`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 32 | GET | `/api/wishlist` | User | Get wishlist |
| 33 | POST | `/api/wishlist` | User | Save/replace full wishlist |
| 34 | POST | `/api/wishlist/add/{product_id}` | User | Add product to wishlist |
| 35 | DELETE | `/api/wishlist/remove/{product_id}` | User | Remove from wishlist |
| 36 | DELETE | `/api/wishlist` | User | Clear wishlist |

---

## ORDERS  `/api/orders`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 37 | GET | `/api/orders` | User | Get own orders |
| 38 | GET | `/api/orders/{id}` | User | Get single order |
| 39 | POST | `/api/orders` | User | Create order |
| 40 | POST | `/api/orders/{id}/cancel` | User | Cancel own order |
| 41 | GET | `/api/orders/all` | Admin | Get all orders |
| 42 | PUT | `/api/orders/{id}/status` | Admin | Update order status |
| 43 | PUT | `/api/orders/{id}/payment` | Admin | Update payment status |
| 44 | PUT | `/api/orders/{id}/tracking` | Admin | Set tracking number |
| 45 | DELETE | `/api/orders/{id}` | Admin | Delete order |

---

## ADDRESSES  `/api/addresses`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 46 | GET | `/api/addresses` | User | Get all addresses |
| 47 | GET | `/api/addresses/{id}` | User | Get single address |
| 48 | POST | `/api/addresses` | User | Add new address |
| 49 | PUT | `/api/addresses/{id}` | User | Update address |
| 50 | DELETE | `/api/addresses/{id}` | User | Delete address |
| 51 | PUT | `/api/addresses/{id}/default` | User | Set as default address |

---

## REVIEWS  `/api/reviews`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 52 | GET | `/api/reviews/product/{product_id}` | Public | Get reviews for a product |
| 53 | POST | `/api/reviews` | User | Submit a review |
| 54 | PUT | `/api/reviews/{id}` | User | Edit own review |
| 55 | DELETE | `/api/reviews/{id}` | User | Delete own review |
| 56 | GET | `/api/reviews/all` | Admin | Get all reviews |
| 57 | PUT | `/api/reviews/{id}/verify` | Admin | Mark review as verified |
| 58 | DELETE | `/api/reviews/{id}/admin` | Admin | Admin delete review |

---

## COUPONS  `/api/coupons`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 59 | POST | `/api/coupons/validate` | User | Validate coupon code + get discount |
| 60 | GET | `/api/coupons` | Admin | List all coupons |
| 61 | POST | `/api/coupons` | Admin | Create coupon |
| 62 | PUT | `/api/coupons/{code}` | Admin | Update coupon |
| 63 | DELETE | `/api/coupons/{code}` | Admin | Delete coupon |
| 64 | PUT | `/api/coupons/{code}/toggle` | Admin | Activate / deactivate coupon |

---

## NOTIFICATIONS  `/api/notifications`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 65 | GET | `/api/notifications` | User | Get own notifications |
| 66 | PUT | `/api/notifications/{id}/read` | User | Mark single as read |
| 67 | PUT | `/api/notifications/read-all` | User | Mark all as read |
| 68 | DELETE | `/api/notifications/{id}` | User | Delete notification |
| 69 | POST | `/api/notifications/broadcast` | Admin | Send notification to all users |

---

## BULB DATA  `/api/bulb-data`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 70 | GET | `/api/bulb-data` | Public | Get all vehicle bulb data |
| 71 | GET | `/api/bulb-data/{make}/{model}` | Public | Get bulb data by vehicle |
| 72 | GET | `/api/bulb-data/makes` | Public | Get list of all makes |
| 73 | GET | `/api/bulb-data/models/{make}` | Public | Get models for a make |
| 74 | POST | `/api/bulb-data` | Admin | Add vehicle bulb data |
| 75 | PUT | `/api/bulb-data/{make}/{model}` | Admin | Update vehicle bulb data |
| 76 | DELETE | `/api/bulb-data/{make}/{model}` | Admin | Delete vehicle bulb data |

---

## ADMIN DASHBOARD  `/api/admin`

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| 77 | GET | `/api/admin/stats` | Admin | Total users, orders, revenue, products |
| 78 | GET | `/api/admin/stats/revenue` | Admin | Revenue by day/week/month |
| 79 | GET | `/api/admin/stats/top-products` | Admin | Best selling products |
| 80 | GET | `/api/admin/stats/recent-orders` | Admin | Latest 10 orders |

---

## TOTAL: 80 endpoints
