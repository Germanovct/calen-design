"""
update_product_images.py — Calen Design
Actualiza el campo images[] de cada producto con fotos reales de Unsplash.
Verifica HTTP 200 antes de guardar cada URL.
"""

import os
import sys
import httpx
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

# ──────────────────────────────────────────────────────────────────
# CATÁLOGO DE IMÁGENES POR PRODUCTO
# Curadas manualmente — fotos reales de moda femenina en Unsplash
# ──────────────────────────────────────────────────────────────────
PRODUCT_IMAGES = {
    "Remera Básica Negra": [
        "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
        "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80",
        "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
    ],
    "Remera Oversize Blanca": [
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80",
        "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80",
    ],
    "Buzo Canguro Negro": [
        "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    ],
    "Buzo Cropped Gris": [
        "https://images.unsplash.com/photo-1485462537746-965f33f4ee75?w=800&q=80",
        "https://images.unsplash.com/photo-1548454782-15b189d129ab?w=800&q=80",
        "https://images.unsplash.com/photo-1609710228159-0fa9bd7e0827?w=800&q=80",
    ],
    "Vestido Mini Negro": [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    ],
    "Vestido Largo Nude": [
        "https://images.unsplash.com/photo-1585487000160-6a51e5a6ecd4?w=800&q=80",
        "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=800&q=80",
        "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=800&q=80",
    ],
    "Set Lencería Negro": [
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
        "https://images.unsplash.com/photo-1559181567-c3190fd5d5f9?w=800&q=80",
        "https://images.unsplash.com/photo-1571513722275-4ad2f29f5cc3?w=800&q=80",
    ],
    "Set Lencería Blanco": [
        "https://images.unsplash.com/photo-1616765045609-b35c21bb2023?w=800&q=80",
        "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=800&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    ],
    "Trench Camel": [
        "https://images.unsplash.com/photo-1548624313-0396a50e1b65?w=800&q=80",
        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
    ],
    "Campera Negra": [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
}


def check_url(client: httpx.Client, url: str) -> bool:
    """Verifica que la URL devuelva HTTP 200 (o 3xx que redirija a imagen)."""
    try:
        r = client.head(url, timeout=8, follow_redirects=True)
        return r.status_code == 200
    except Exception:
        return False


def verify_images(name: str, urls: list, http: httpx.Client) -> list:
    """Retorna solo las URLs que responden correctamente."""
    valid = []
    for url in urls:
        ok = check_url(http, url)
        status = "✅" if ok else "❌"
        print(f"    {status} {url.split('photo-')[1][:20]}...")
        if ok:
            valid.append(url)
    return valid


# ──────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────
print("🔍 Obteniendo productos de la base de datos...")
products_resp = supabase.table("products").select("id, name").execute()
products_map = {p["name"]: p["id"] for p in products_resp.data}

print(f"✅ {len(products_map)} productos encontrados\n")

updated = 0
skipped = 0

with httpx.Client(headers={"Accept": "image/*,*/*"}) as http:
    for product_name, image_urls in PRODUCT_IMAGES.items():
        product_id = products_map.get(product_name)
        if not product_id:
            print(f"⚠️  '{product_name}' no encontrado en la BD — saltando")
            skipped += 1
            continue

        print(f"📷 Verificando imágenes para: {product_name}")
        valid_urls = verify_images(product_name, image_urls, http)

        if not valid_urls:
            print(f"   ⚠️  Ninguna imagen válida — producto sin actualizar\n")
            skipped += 1
            continue

        # Actualizar en BD
        supabase.table("products").update(
            {"images": valid_urls}
        ).eq("id", product_id).execute()

        print(f"   → Guardadas {len(valid_urls)} imágenes en BD ✅\n")
        updated += 1

# ──────────────────────────────────────────────────────────────────
# REPORTE
# ──────────────────────────────────────────────────────────────────
print("═" * 55)
print("  📊 RESUMEN")
print("═" * 55)
print(f"  ✅ Productos actualizados : {updated}")
print(f"  ⚠️  Productos saltados     : {skipped}")
print("═" * 55)

if updated > 0:
    print("\n🎉 ¡Imágenes cargadas! El frontend ya puede mostrarlas.")
