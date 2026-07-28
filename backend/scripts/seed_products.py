import csv, json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

from supabase import create_client

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
        print(f"  seeded {min(i+50, len(rows))}/{len(rows)}")

    print(f"✅ Done — {len(rows)} products seeded")

if __name__ == "__main__":
    seed()
