from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.shipping import ShippingLabelCreate, ShippingLabelResponse
from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from supabase import Client

router = APIRouter()

@router.post("/{id}/shipping", response_model=ShippingLabelResponse, status_code=status.HTTP_201_CREATED)
def create_shipping_label(
    id: str, 
    shipping_data: ShippingLabelCreate, 
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # 1. Verificar existencia de la orden
        ord_res = db.table("orders").select("id, status").eq("id", id).execute()
        if not ord_res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        # 2. Cargar o actualizar la etiqueta de envío en calen.shipping_labels
        # Verificar si ya existe una etiqueta para esa orden
        label_check = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        
        payload = {
            "order_id": id,
            "carrier": shipping_data.carrier,
            "tracking_number": shipping_data.tracking_number,
            "label_url": shipping_data.label_url
        }
        
        if label_check.data:
            # Actualizar existente
            label_id = label_check.data[0]["id"]
            res = db.table("shipping_labels").update(payload).eq("id", label_id).execute()
        else:
            # Crear nueva
            res = db.table("shipping_labels").insert(payload).execute()
            
        if not res.data:
            raise HTTPException(status_code=400, detail="No se pudo guardar la información de envío")

        # 3. Transicionar automáticamente el estado del pedido a "shipped"
        db.table("orders").update({"status": "shipped"}).eq("id", id).execute()
        print(f"[+] Orden {id} transicionada automáticamente a estado: shipped")
        
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar envío: {str(e)}")

@router.get("/{id}/shipping", response_model=ShippingLabelResponse)
def get_shipping_label(
    id: str, 
    current_user: dict = Depends(get_current_user), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # 1. Verificar existencia de la orden y permisos del usuario
        ord_res = db.table("orders").select("user_id").eq("id", id).execute()
        if not ord_res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        order = ord_res.data[0]
        if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Acceso denegado a la información de envío de este pedido.")

        # 2. Buscar etiqueta de envío
        res = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Información de envío no disponible aún para esta orden.")
            
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener tracking de envío: {str(e)}")
