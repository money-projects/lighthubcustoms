# Radiant Motors — Backend Dev Guide
## Part 5 of 5: Deployment & Production Guide

---

## 1. Pre-Deployment Checklist

- [ ] All tables created in Supabase SQL Editor (see Part 3)
- [ ] `products` table seeded from `results.csv` (see Part 3)
- [ ] `.env` configured with Supabase URL, service key, and JWT secret
- [ ] CORS `allow_origins` restricted to your frontend domain
- [ ] `ADMIN_EMAIL` set to the correct admin account

---

## 2. Option A — Deploy on Render (Recommended)

1. Push backend code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo, configure:
   - **Root directory:** `backend`
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add all `.env` variables under **Environment**
5. Deploy

---

## 3. Option B — Deploy on AWS EC2

### 3.1 Server Setup

```bash
sudo apt update && sudo apt install -y python3.11 python3.11-venv nginx

git clone https://github.com/your-org/radiant-motors-backend.git
cd radiant-motors-backend/backend

python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
nano .env   # fill in your values
```

### 3.2 Run with systemd

Create `/etc/systemd/system/radiantmotors.service`:

```ini
[Unit]
Description=Radiant Motors FastAPI Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/radiant-motors-backend/backend
ExecStart=/home/ubuntu/radiant-motors-backend/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable radiantmotors
sudo systemctl start radiantmotors
```

### 3.3 Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.radiantmotors.co.ke;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/radiantmotors /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 4. Option C — Deploy on Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Set environment variables in the Railway dashboard
3. Add a `Procfile` in `backend/`:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Deploy — Railway auto-detects Python and installs `requirements.txt`

---

## 5. Supabase Production Settings

### Row Level Security (RLS)

Since the backend uses the **service role key**, RLS is bypassed server-side (correct behaviour).
However, enable RLS on all tables to protect against direct client access:

```sql
alter table users      enable row level security;
alter table products   enable row level security;
alter table orders     enable row level security;
alter table cart       enable row level security;
alter table wishlist   enable row level security;
alter table addresses  enable row level security;
alter table bulb_data  enable row level security;
```

No policies needed — the service key bypasses them. This just blocks unauthenticated direct DB access.

### Connection Pooling

For production with multiple workers, use Supabase's **connection pooler** (PgBouncer):
- In Supabase dashboard → **Settings → Database → Connection Pooling**
- Use the pooler connection string instead of the direct connection

---

## 6. Production Security Hardening

| Item | Action |
|---|---|
| CORS | Set `allow_origins` to your exact frontend URL |
| JWT Secret | Use a 256-bit random string: `openssl rand -hex 32` |
| HTTPS | Use Render/Railway built-in TLS, or Nginx + Certbot on EC2 |
| Supabase Key | Use service role key only on backend, never expose to frontend |
| Rate Limiting | Add `slowapi` to FastAPI for endpoint rate limiting |
| Input Validation | Already handled by Pydantic — keep models strict |

---

## 7. Monitoring & Logs

```bash
# EC2 / systemd live logs
sudo journalctl -u radiantmotors -f

# Render / Railway
# View logs directly in the dashboard under "Logs" tab
```

Supabase also provides query logs and usage metrics in the dashboard under **Logs → API / Database**.

---

## 8. Quick Reference — All Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile            [auth]

GET    /api/products
GET    /api/products/{id}
POST   /api/products                [admin]
PUT    /api/products/{id}           [admin]
DELETE /api/products/{id}           [admin]

GET    /api/orders                  [auth]
GET    /api/orders/all              [admin]
GET    /api/orders/{id}             [auth]
POST   /api/orders                  [auth]
PUT    /api/orders/{id}             [admin]
DELETE /api/orders/{id}             [admin]

GET    /api/cart                    [auth]
POST   /api/cart                    [auth]

GET    /api/wishlist                [auth]
POST   /api/wishlist                [auth]

GET    /api/addresses               [auth]
POST   /api/addresses               [auth]
DELETE /api/addresses/{id}          [auth]

GET    /api/bulb-data
GET    /api/bulb-data/{make}/{model}
```

---

## 9. Dev Guide Index

| File | Contents |
|---|---|
| [DEV_GUIDE_01_OVERVIEW.md](./DEV_GUIDE_01_OVERVIEW.md) | System overview, architecture, Supabase schemas, API map |
| [DEV_GUIDE_02_SETUP.md](./DEV_GUIDE_02_SETUP.md) | Project structure, installation, environment, entry point |
| [DEV_GUIDE_03_MODELS.md](./DEV_GUIDE_03_MODELS.md) | SQL table creation, Pydantic models, product seeding script |
| [DEV_GUIDE_04_ROUTES.md](./DEV_GUIDE_04_ROUTES.md) | Auth, all routers, full route implementation |
| [DEV_GUIDE_05_DEPLOYMENT.md](./DEV_GUIDE_05_DEPLOYMENT.md) | Render, EC2, Railway deployment, Supabase RLS, security |
