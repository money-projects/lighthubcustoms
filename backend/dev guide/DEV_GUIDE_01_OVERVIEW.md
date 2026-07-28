# Radiant Motors — Backend Dev Guide
## Part 1 of 5: System Overview & Architecture

---

## 1. Project Summary

Radiant Motors is an automotive LED lighting e-commerce platform targeting the Kenyan market.
This guide documents the full backend development using **Python + FastAPI** backed by **Supabase (PostgreSQL)**.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.11+ |
| Framework | FastAPI |
| Auth | JWT (python-jose) + bcrypt |
| Database | Supabase (PostgreSQL) |
| ORM / Client | supabase-py |
| File Storage | Supabase Storage (or AWS S3) |
| Deployment | Render / EC2 / Railway |
| Environment | python-dotenv |
| Validation | Pydantic v2 |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                    │
│              (Vite + TypeScript + Tailwind)         │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST
┌──────────────────────▼──────────────────────────────┐
│               FastAPI Backend (Python)              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  /auth   │  │/products │  │ /orders /cart etc │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         JWT Auth Middleware (Bearer)         │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ supabase-py
┌──────────────────────▼──────────────────────────────┐
│                    Supabase                         │
│              (PostgreSQL + REST API)                │
│                                                     │
│  users      products    orders                      │
│  cart       wishlist    addresses                   │
│  bulb_data                                          │
└─────────────────────────────────────────────────────┘
```

---

## 4. Supabase Table Schemas

### users
| Column | Type | Notes |
|---|---|---|
| email | text | Primary Key |
| name | text | |
| phone | text | |
| password | text | bcrypt hashed |
| role | text | `user` or `admin` |
| verified | boolean | default true |
| created_at | timestamptz | default now() |

### products
| Column | Type | Notes |
|---|---|---|
| product_id | text | Primary Key |
| name | text | |
| category | text | |
| section | text | best-seller / new-arrival / carousel / deal / accessory |
| price | numeric | KES |
| description | text | |
| specifications | text | |
| image_url | text | S3 / Supabase Storage URL |
| images | jsonb | array of image URLs |
| discount | text | |

### orders
| Column | Type | Notes |
|---|---|---|
| order_id | text | Primary Key |
| user_id | text | FK → users.email, indexed |
| items | jsonb | array of order items |
| subtotal | numeric | |
| shipping | numeric | |
| total | numeric | |
| status | text | pending / processing / shipped / delivered / cancelled |
| payment_method | text | mpesa / card / cod |
| delivery_method | text | standard / express / pickup |
| shipping_info | jsonb | |
| order_notes | text | |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### cart
| Column | Type | Notes |
|---|---|---|
| user_id | text | Primary Key, FK → users.email |
| items | jsonb | array of cart items |
| updated_at | timestamptz | |

### wishlist
| Column | Type | Notes |
|---|---|---|
| user_id | text | Primary Key, FK → users.email |
| items | jsonb | array of product_ids |
| updated_at | timestamptz | |

### addresses
| Column | Type | Notes |
|---|---|---|
| address_id | text | Primary Key |
| user_id | text | FK → users.email, indexed |
| full_name | text | |
| phone | text | |
| address | text | |
| apartment | text | nullable |
| city | text | |
| county | text | |
| postal_code | text | |
| is_default | boolean | |
| created_at | timestamptz | default now() |

### bulb_data
| Column | Type | Notes |
|---|---|---|
| vehicle_key | text | Primary Key (`Make#Model`) |
| make | text | |
| model | text | |
| headlight_low | text | |
| headlight_high | text | |
| fog_light | text | |
| turn_signal_front | text | |
| turn_signal_rear | text | |
| parking_light | text | |
| tail_light | text | |
| brake_light | text | |
| reverse_light | text | |
| license_plate | text | |

---

## 5. API Endpoint Map

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/profile` | User | Get current user profile |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/{id}` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders` | User | Get own orders |
| GET | `/api/orders/all` | Admin | Get all orders |
| GET | `/api/orders/{id}` | User | Get single order |
| POST | `/api/orders` | User | Create order |
| PUT | `/api/orders/{id}` | Admin | Update order status |
| DELETE | `/api/orders/{id}` | Admin | Delete order |

### Cart & Wishlist
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Save cart |
| GET | `/api/wishlist` | User | Get wishlist |
| POST | `/api/wishlist` | User | Save wishlist |

### Addresses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/addresses` | User | Get addresses |
| POST | `/api/addresses` | User | Save address |
| DELETE | `/api/addresses/{id}` | User | Delete address |

### Bulb Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/bulb-data` | Public | Get all vehicle bulb data |
| GET | `/api/bulb-data/{make}/{model}` | Public | Get bulb data by vehicle |

---

## 6. Product Data Source

The `results.csv` file in the project root contains **143 products** exported from the previous DynamoDB store.
This file is used in Part 3 to seed the `products` table in Supabase.

Fields: `productId`, `category`, `description`, `discount`, `images`, `imageUrl`, `name`, `price`, `section`, `specifications`

---

## Next → [Part 2: Project Setup & Environment](./DEV_GUIDE_02_SETUP.md)
