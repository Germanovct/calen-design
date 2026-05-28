"""
seed_products.py — Calen Design
Inserta 10 productos de ejemplo con sus variantes.
Usa las vistas del schema "public" (que apuntan a "calen")
con SUPABASE_SECRET_KEY para bypassear RLS.
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_SECRET_KEY:
    print("❌ ERROR: Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en el .env")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

# ──────────────────────────────────────────────
# 1. OBTENER IDs DE CATEGORÍAS (via vista public.categories)
# ──────────────────────────────────────────────
print("🔍 Obteniendo categorías...")
cats_resp = supabase.table("categories").select("id, slug").execute()
categories = {row["slug"]: row["id"] for row in cats_resp.data}

required = ["remeras", "buzos", "vestidos", "lenceria", "abrigos"]
for slug in required:
    if slug not in categories:
        print(f"❌ Categoría '{slug}' no encontrada. Ejecutá primero el schema SQL.")
        sys.exit(1)

print(f"✅ Categorías: {list(categories.keys())}")

# ──────────────────────────────────────────────
# 2. DEFINICIÓN DE PRODUCTOS Y VARIANTES
# ──────────────────────────────────────────────
products_data = [
    # ── REMERAS ──
    {
        "name": "Remera Básica Negra",
        "description": "Remera básica de algodón en color negro. Esencial en todo guardarropa.",
        "category_slug": "remeras",
        "price": 18000.00,
        "variants": [{"size": s, "color": "Negro", "stock": 10} for s in ["S", "M", "L", "XL"]],
    },
    {
        "name": "Remera Oversize Blanca",
        "description": "Remera oversize de algodón en color blanco. Corte amplio y cómodo.",
        "category_slug": "remeras",
        "price": 22000.00,
        "variants": [{"size": s, "color": "Blanco", "stock": 10} for s in ["S", "M", "L", "XL"]],
    },
    # ── BUZOS ──
    {
        "name": "Buzo Canguro Negro",
        "description": "Buzo canguro con bolsillo frontal. Calidad premium, color negro.",
        "category_slug": "buzos",
        "price": 35000.00,
        "variants": [{"size": s, "color": "Negro", "stock": 10} for s in ["S", "M", "L", "XL"]],
    },
    {
        "name": "Buzo Cropped Gris",
        "description": "Buzo cropped en tono gris. Ideal para looks casuales y deportivos.",
        "category_slug": "buzos",
        "price": 32000.00,
        "variants": [{"size": s, "color": "Gris", "stock": 10} for s in ["XS", "S", "M", "L"]],
    },
    # ── VESTIDOS ──
    {
        "name": "Vestido Mini Negro",
        "description": "Vestido mini elegante en color negro. Perfecto para salidas nocturnas.",
        "category_slug": "vestidos",
        "price": 28000.00,
        "variants": [{"size": s, "color": "Negro", "stock": 10} for s in ["XS", "S", "M", "L"]],
    },
    {
        "name": "Vestido Largo Nude",
        "description": "Vestido largo fluido en tono nude. Silueta romántica y versátil.",
        "category_slug": "vestidos",
        "price": 45000.00,
        "variants": [{"size": s, "color": "Nude", "stock": 10} for s in ["XS", "S", "M", "L"]],
    },
    # ── LENCERÍA ──
    {
        "name": "Set Lencería Negro",
        "description": "Set de lencería en encaje negro. Diseño delicado y sofisticado.",
        "category_slug": "lenceria",
        "price": 15000.00,
        "variants": [{"size": s, "color": "Negro", "stock": 10} for s in ["XS", "S", "M", "L"]],
    },
    {
        "name": "Set Lencería Blanco",
        "description": "Set de lencería en encaje blanco. Diseño romántico y femenino.",
        "category_slug": "lenceria",
        "price": 15000.00,
        "variants": [{"size": s, "color": "Blanco", "stock": 10} for s in ["XS", "S", "M", "L"]],
    },
    # ── ABRIGOS ──
    {
        "name": "Trench Camel",
        "description": "Trench coat clásico en tono camel. Corte recto y atemporal.",
        "category_slug": "abrigos",
        "price": 65000.00,
        "variants": [{"size": s, "color": "Camel", "stock": 10} for s in ["S", "M", "L"]],
    },
    {
        "name": "Campera Negra",
        "description": "Campera versátil en color negro. Ideal para el día a día.",
        "category_slug": "abrigos",
        "price": 58000.00,
        "variants": [{"size": s, "color": "Negro", "stock": 10} for s in ["S", "M", "L", "XL"]],
    },
]

# ──────────────────────────────────────────────
# 3. INSERTAR PRODUCTOS Y VARIANTES
# ──────────────────────────────────────────────
total_products = 0
total_variants = 0
errors = []

print("\n📦 Insertando productos y variantes...\n")

for p in products_data:
    try:
        product_payload = {
            "name": p["name"],
            "description": p["description"],
            "category_id": categories[p["category_slug"]],
            "price": p["price"],
            "images": [],
            "active": True,
        }
        prod_resp = supabase.table("products").insert(product_payload).execute()

        if not prod_resp.data:
            errors.append(f"No se insertó: {p['name']}")
            continue

        product_id = prod_resp.data[0]["id"]
        total_products += 1

        variants_payload = [
            {"product_id": product_id, "size": v["size"], "color": v["color"], "stock": v["stock"]}
            for v in p["variants"]
        ]
        var_resp = supabase.table("variants").insert(variants_payload).execute()
        inserted_variants = len(var_resp.data) if var_resp.data else 0
        total_variants += inserted_variants

        print(f"  ✅ {p['name']} — ${p['price']:,.0f} — {inserted_variants} variantes")

    except Exception as e:
        errors.append(f"Error en '{p['name']}': {e}")
        print(f"  ❌ Error en '{p['name']}': {e}")

# ──────────────────────────────────────────────
# 4. REPORTE FINAL
# ──────────────────────────────────────────────
print("\n" + "═" * 52)
print(f"  📊 RESUMEN DE INSERCIÓN")
print("═" * 52)
print(f"  ✅ Productos insertados : {total_products} / {len(products_data)}")
print(f"  ✅ Variantes insertadas : {total_variants}")

if errors:
    print(f"\n  ⚠️  Errores ({len(errors)}):")
    for e in errors:
        print(f"    ❌ {e}")
else:
    print(f"\n  🎉 Sin errores. ¡Base de datos lista para el frontend!")
print("═" * 52)
