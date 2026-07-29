"""
Seed categories table from distinct category values in the products table.
Run: python backend/scripts/seed_categories.py
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime
from app.database import supabase

# Fetch distinct categories from products
products = supabase.table("products").select("category").execute().data
distinct = sorted({p["category"] for p in products if p.get("category")})

if not distinct:
    print("No categories found in products table.")
    sys.exit(0)

# Fetch existing categories to avoid duplicates
existing = {c["name"] for c in supabase.table("categories").select("name").execute().data}

to_insert = [
    {
        "category_id": f"CAT-{int(datetime.utcnow().timestamp()*1000)+i}",
        "name": name,
        "description": "",
        "image_url": "",
    }
    for i, name in enumerate(distinct)
    if name not in existing
]

if not to_insert:
    print("All categories already exist.")
    sys.exit(0)

supabase.table("categories").insert(to_insert).execute()
print(f"Seeded {len(to_insert)} categories: {[c['name'] for c in to_insert]}")
