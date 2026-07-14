import csv
import sys
import os
import re

# Configurar path para importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import supabase_admin as db
from app.core.config import settings

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[-\s]+', '-', text).strip('-')

async def main():
    if not db:
        print("[!] Error: Supabase Admin client not initialized. Check your SUPABASE_URL and SUPABASE_SECRET_KEY in .env.")
        sys.exit(1)

    csv_path = sys.argv[1] if len(sys.argv) > 1 else 'tiendanube_sample.csv'
    
    if not os.path.exists(csv_path):
        print(f"[!] Error: El archivo CSV '{csv_path}' no existe.")
        print("Uso: python scripts/migrate_tiendanube.py <ruta_del_archivo.csv>")
        sys.exit(1)

    print(f"[*] Iniciando migración de productos desde '{csv_path}'...")

    # 1. Cargar categorías existentes en caché
    print("[*] Leyendo categorías en Supabase...")
    categories_cache = {}
    try:
        cat_res = db.table("categories").select("*").execute()
        for cat in cat_res.data:
            categories_cache[cat["slug"]] = cat["id"]
        print(f"[+] {len(categories_cache)} categorías cargadas en caché.")
    except Exception as e:
        print(f"[!] Fallo al consultar categorías en Supabase: {e}")
        sys.exit(1)

    # 2. Parsear el archivo CSV
    products_created = 0
    variants_created = 0
    current_product_id = None
    last_identificador = None
    
    with open(csv_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        try:
            raw_headers = next(reader)
        except StopIteration:
            print("[!] Error: El archivo CSV está vacío.")
            sys.exit(1)

        # Mapear headers a índices (sin importar mayúsculas o espacios)
        headers = {h.strip().lower(): idx for idx, h in enumerate(raw_headers)}
        
        # Buscar correspondencias para columnas críticas
        def find_col_idx(candidates):
            for cand in candidates:
                if cand.lower() in headers:
                    return headers[cand.lower()]
            return None

        idx_id = find_col_idx(["identificador", "id", "url", "handle"])
        idx_nombre = find_col_idx(["nombre", "title", "name", "producto"])
        idx_desc = find_col_idx(["descripción", "description", "detalle"])
        idx_precio = find_col_idx(["precio", "price", "precio de lista"])
        idx_stock = find_col_idx(["stock", "cantidad", "inventory", "stock disponible"])
        idx_imagen = find_col_idx(["imagen", "image", "foto", "url de la imagen"])
        idx_categoria = find_col_idx(["categorías", "categoría", "category"])
        idx_talle = find_col_idx(["talle", "talla", "size", "propiedad: talle", "valor: talle"])
        idx_color = find_col_idx(["color", "propiedad: color", "valor: color"])

        if idx_nombre is None or idx_precio is None:
            print("[!] Error: No se encontraron las columnas requeridas (Nombre y Precio) en el CSV.")
            print(f"Headers detectados: {raw_headers}")
            sys.exit(1)

        print("[+] Headers mapeados con éxito. Leyendo registros...")

        for row_idx, row in enumerate(reader, start=2):
            if not row or all(cell == "" for cell in row):
                continue
            
            identificador = row[idx_id] if idx_id is not None and idx_id < len(row) else f"row-{row_idx}"
            nombre = row[idx_nombre] if idx_nombre < len(row) else ""
            
            # Si el identificador cambia o no tiene identificador de variante y tiene nombre, creamos un nuevo producto
            is_new_product = False
            if idx_id is not None:
                is_new_product = (identificador != last_identificador) and nombre != ""
            else:
                is_new_product = nombre != ""

            if is_new_product:
                last_identificador = identificador
                desc = row[idx_desc] if idx_desc is not None and idx_desc < len(row) else ""
                precio_raw = row[idx_precio] if idx_precio < len(row) else "0"
                try:
                    precio = float(precio_raw.replace("$", "").replace(".", "").replace(",", ".").strip())
                except ValueError:
                    precio = 0.0

                imagen_url = row[idx_imagen] if idx_imagen is not None and idx_imagen < len(row) else ""
                imagenes = [imagen_url] if imagen_url else []

                # Obtener o crear categoría
                cat_name = row[idx_categoria] if idx_categoria is not None and idx_categoria < len(row) else "Otros"
                cat_slug = slugify(cat_name)
                
                if cat_slug not in categories_cache:
                    print(f"[*] Creando categoría nueva '{cat_name}' (slug: {cat_slug})...")
                    try:
                        new_cat = db.table("categories").insert({"name": cat_name, "slug": cat_slug}).execute()
                        if new_cat.data:
                            categories_cache[cat_slug] = new_cat.data[0]["id"]
                    except Exception as cat_err:
                        print(f"[!] Error al crear categoría: {cat_err}")
                        categories_cache[cat_slug] = None

                cat_id = categories_cache.get(cat_slug)

                # Verificar si el producto ya existe para reutilizar
                p_check = db.table("products").select("id").eq("name", nombre).execute()
                if p_check.data:
                    current_product_id = p_check.data[0]["id"]
                    print(f"[~] Producto '{nombre}' ya existe. ID: {current_product_id}. Omitiendo creación de producto, agregando variantes.")
                else:
                    print(f"[*] Insertando producto '{nombre}'...")
                    try:
                        p_payload = {
                            "name": nombre,
                            "description": desc,
                            "price": precio,
                            "category_id": cat_id,
                            "images": imagenes,
                            "active": True
                        }
                        p_res = db.table("products").insert(p_payload).execute()
                        if p_res.data:
                            current_product_id = p_res.data[0]["id"]
                            products_created += 1
                        else:
                            current_product_id = None
                            print(f"[!] Error al crear producto '{nombre}'.")
                    except Exception as p_err:
                        print(f"[!] Excepción creando producto: {p_err}")
                        current_product_id = None

            # Si tenemos un producto actual, crear la variante correspondiente
            if current_product_id:
                talle = row[idx_talle] if idx_talle is not None and idx_talle < len(row) else ""
                color = row[idx_color] if idx_color is not None and idx_color < len(row) else ""
                
                if not talle and not color:
                    talle = "Único"
                    color = "Único"

                stock_raw = row[idx_stock] if idx_stock is not None and idx_stock < len(row) else "0"
                try:
                    stock = int(stock_raw)
                except ValueError:
                    stock = 0

                # Validar si esta variante ya existe
                v_check = db.table("variants").select("id").eq("product_id", current_product_id).eq("size", talle).eq("color", color).execute()
                if v_check.data:
                    # Si ya existe, actualizar stock
                    try:
                        db.table("variants").update({"stock": stock}).eq("id", v_check.data[0]["id"]).execute()
                        print(f"  [~] Variante (T: {talle} · C: {color}) ya existe. Stock actualizado a {stock}.")
                    except Exception as v_err:
                        print(f"  [!] Fallo al actualizar stock de variante: {v_err}")
                else:
                    # Crear variante
                    try:
                        v_payload = {
                            "product_id": current_product_id,
                            "size": talle,
                            "color": color,
                            "stock": stock
                        }
                        v_res = db.table("variants").insert(v_payload).execute()
                        if v_res.data:
                            variants_created += 1
                            print(f"  [+] Variante agregada: Talle {talle} · Color {color} · Stock {stock}")
                    except Exception as v_err:
                        print(f"  [!] Fallo al insertar variante: {v_err}")

    print(f"\n[+] MIGRACIÓN FINALIZADA:")
    print(f"  - Productos Creados: {products_created}")
    print(f"  - Variantes Creadas: {variants_created}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
