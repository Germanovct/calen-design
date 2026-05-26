from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional
from app.schemas.products import (
    ProductCreate, ProductUpdate, ProductResponse, 
    VariantCreate, VariantUpdate, VariantResponse
)
from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from supabase import Client

router = APIRouter()

# ==========================================
# PRODUCT ENDPOINTS
# ==========================================

@router.get("/", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    size: Optional[str] = None,
    color: Optional[str] = None,
    active: Optional[bool] = None,
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Base query joining products and variants
        query = db.table("products").select("*, variants(*)")

        # 1. Filtrar por estado activo (los clientes sólo ven activos)
        # Si active no es especificado, por defecto filtramos active=True
        if active is None:
            query = query.eq("active", True)
        else:
            query = query.eq("active", active)

        # 2. Filtrar por categoría (slug)
        if category:
            cat_res = db.table("categories").select("id").eq("slug", category).execute()
            if not cat_res.data:
                return [] # Categoría no encontrada
            category_id = cat_res.data[0]["id"]
            query = query.eq("category_id", category_id)

        # 3. Filtrar por talle y/o color buscando primero en variantes
        if size or color:
            v_query = db.table("variants").select("product_id")
            if size:
                v_query = v_query.eq("size", size)
            if color:
                v_query = v_query.eq("color", color)
            
            v_res = v_query.execute()
            if not v_res.data:
                return [] # No hay productos con esas variantes
                
            # Extraer IDs de productos que coinciden
            product_ids = list(set([item["product_id"] for item in v_res.data]))
            query = query.in_("id", product_ids)

        res = query.execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener productos: {str(e)}")

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: str, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        res = db.table("products").select("*, variants(*)").eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener producto: {str(e)}")

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        data = product.dict()
        res = db.table("products").insert(data).execute()
        if not res.data:
            raise HTTPException(status_code=400, detail="No se pudo crear el producto")
        
        # Devolver el producto con variantes vacías
        created_prod = res.data[0]
        created_prod["variants"] = []
        return created_prod
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear producto: {str(e)}")

@router.put("/{id}", response_model=ProductResponse)
def update_product(
    id: str, 
    product: ProductUpdate, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        data = {k: v for k, v in product.dict().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")
            
        res = db.table("products").update(data).eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado para actualizar")
            
        # Obtener producto actualizado completo con variantes
        full_prod = db.table("products").select("*, variants(*)").eq("id", id).execute()
        return full_prod.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al editar producto: {str(e)}")

@router.delete("/{id}")
def delete_product(
    id: str, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        res = db.table("products").delete().eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return {"message": "Producto eliminado correctamente", "id": id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al eliminar producto: {str(e)}")

@router.post("/{id}/images")
async def upload_product_image(
    id: str, 
    file: UploadFile = File(...), 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Verificar existencia del producto
        prod_check = db.table("products").select("images").eq("id", id).execute()
        if not prod_check.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
            
        # Subir imagen a Supabase Storage
        file_content = await file.read()
        file_path = f"products/{id}/{file.filename}"
        
        # Uploading
        db.storage.from_("calen-products").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type, "x-upsert": "true"}
        )
        
        # Obtener URL pública
        public_url = db.storage.from_("calen-products").get_public_url(file_path)
        
        # Añadir al array de imágenes del producto
        images = prod_check.data[0].get("images") or []
        images.append(public_url)
        
        db.table("products").update({"images": images}).eq("id", id).execute()
        
        return {"message": "Imagen subida correctamente", "url": public_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al subir imagen: {str(e)}")


# ==========================================
# VARIANT ENDPOINTS
# ==========================================

@router.post("/{id}/variants", response_model=VariantResponse, status_code=status.HTTP_201_CREATED)
def create_variant(
    id: str, 
    variant: VariantCreate, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Verificar que el producto existe
        prod_res = db.table("products").select("id").eq("id", id).execute()
        if not prod_res.data:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
            
        data = variant.dict()
        data["product_id"] = id
        
        res = db.table("variants").insert(data).execute()
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear variante: {str(e)}")

@router.put("/variants/{variant_id}", response_model=VariantResponse)
def update_variant(
    variant_id: str, 
    variant: VariantUpdate, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        data = {k: v for k, v in variant.dict().items() if v is not None}
        if not data:
            raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")
            
        res = db.table("variants").update(data).eq("id", variant_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Variante no encontrada")
        return res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al editar variante: {str(e)}")

@router.delete("/variants/{variant_id}")
def delete_variant(
    variant_id: str, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        res = db.table("variants").delete().eq("id", variant_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Variante no encontrada")
        return {"message": "Variante eliminada correctamente", "id": variant_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al eliminar variante: {str(e)}")
