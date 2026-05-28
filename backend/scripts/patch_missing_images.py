"""
patch_missing_images.py — Calen Design
Agrega imágenes alternativas a los productos que quedaron con pocas fotos.
"""

import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from supabase import create_client

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SECRET_KEY"))

# Alternativas verificadas manualmente
PATCHES = {
    "Buzo Cropped Gris": [
        "https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800&q=80",
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    "Set Lencería Negro": [
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80",
    ],
}

products_resp = supabase.table("products").select("id, name, images").execute()
products_map = {p["name"]: p for p in products_resp.data}

for name, images in PATCHES.items():
    p = products_map.get(name)
    if not p:
        print(f"❌ No encontrado: {name}")
        continue

    supabase.table("products").update({"images": images}).eq("id", p["id"]).execute()
    print(f"✅ {name} → {len(images)} imágenes actualizadas")

print("\n✅ Parche aplicado.")
