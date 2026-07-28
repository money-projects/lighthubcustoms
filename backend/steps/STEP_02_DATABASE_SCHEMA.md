# STEP 2 — Database Schema (Supabase SQL)

Run all SQL below in Supabase → SQL Editor

## 1. Users
```sql
create table users (
  email        text primary key,
  name         text not null,
  phone        text,
  password     text not null,
  role         text not null default 'user' check (role in ('user','admin')),
  verified     boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table users enable row level security;
```

## 2. Products
```sql
create table products (
  product_id      text primary key,
  name            text not null,
  category        text not null,
  section         text not null,
  price           numeric not null,
  description     text default '',
  specifications  text default '',
  image_url       text default '',
  images          jsonb default '[]',
  discount        text default '',
  stock           integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table products enable row level security;
```

## 3. Categories
```sql
create table categories (
  category_id  text primary key,
  name         text not null unique,
  description  text default '',
  image_url    text default '',
  created_at   timestamptz not null default now()
);
alter table categories enable row level security;
```

## 4. Orders
```sql
create table orders (
  order_id        text primary key,
  user_id         text not null references users(email),
  items           jsonb not null,
  subtotal        numeric not null,
  shipping        numeric not null,
  total           numeric not null,
  status          text not null default 'pending'
                    check (status in ('pending','processing','shipped','delivered','cancelled')),
  payment_method  text not null check (payment_method in ('mpesa','card','cod')),
  payment_status  text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  delivery_method text not null check (delivery_method in ('standard','express','pickup')),
  shipping_info   jsonb not null,
  order_notes     text default '',
  tracking_number text default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index orders_user_id_idx on orders(user_id);
alter table orders enable row level security;
```

## 5. Cart
```sql
create table cart (
  user_id     text primary key references users(email),
  items       jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);
alter table cart enable row level security;
```

## 6. Wishlist
```sql
create table wishlist (
  user_id     text primary key references users(email),
  items       jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);
alter table wishlist enable row level security;
```

## 7. Addresses
```sql
create table addresses (
  address_id   text primary key,
  user_id      text not null references users(email),
  full_name    text not null,
  phone        text not null,
  address      text not null,
  apartment    text default '',
  city         text not null,
  county       text not null,
  postal_code  text not null,
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);
create index addresses_user_id_idx on addresses(user_id);
alter table addresses enable row level security;
```

## 8. Reviews
```sql
create table reviews (
  review_id   text primary key,
  product_id  text not null references products(product_id),
  user_id     text not null references users(email),
  rating      integer not null check (rating between 1 and 5),
  title       text default '',
  body        text default '',
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index reviews_product_id_idx on reviews(product_id);
alter table reviews enable row level security;
```

## 9. Coupons
```sql
create table coupons (
  code            text primary key,
  discount_type   text not null check (discount_type in ('percent','fixed')),
  discount_value  numeric not null,
  min_order       numeric not null default 0,
  max_uses        integer not null default 100,
  used_count      integer not null default 0,
  expires_at      timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
alter table coupons enable row level security;
```

## 10. Notifications
```sql
create table notifications (
  notification_id  text primary key,
  user_id          text not null references users(email),
  title            text not null,
  message          text not null,
  type             text not null default 'info',
  is_read          boolean not null default false,
  created_at       timestamptz not null default now()
);
create index notifications_user_id_idx on notifications(user_id);
alter table notifications enable row level security;
```

## 11. Bulb Data
```sql
create table bulb_data (
  vehicle_key         text primary key,
  make                text not null,
  model               text not null,
  year_from           integer,
  year_to             integer,
  headlight_low       text default '',
  headlight_high      text default '',
  fog_light           text default '',
  turn_signal_front   text default '',
  turn_signal_rear    text default '',
  parking_light       text default '',
  tail_light          text default '',
  brake_light         text default '',
  reverse_light       text default '',
  license_plate       text default ''
);
alter table bulb_data enable row level security;
```
