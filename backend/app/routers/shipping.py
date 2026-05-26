import base64
import random
import httpx
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.shipping import (
    ShippingLabelCreate, ShippingLabelResponse,
    ShippingQuoteRequest, ShippingQuoteResponse,
    CreateLabelRequest, ShippingTrackingResponse, TrackingEvent
)
from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from app.core.config import settings
from supabase import Client

router = APIRouter()

# Helper para autenticarse y obtener el token de Correo Argentino
async def get_correo_argentino_token() -> Optional[str]:
    # Si las credenciales no están configuradas, retornar None
    if not settings.CORREO_ARGENTINO_USER or not settings.CORREO_ARGENTINO_PASSWORD:
        return None
    try:
        # Codificar en base64 para Basic Auth
        user_pass = f"{settings.CORREO_ARGENTINO_USER}:{settings.CORREO_ARGENTINO_PASSWORD}"
        user_pass_bytes = user_pass.encode("utf-8")
        base64_user_pass = base64.b64encode(user_pass_bytes).decode("utf-8")
        
        headers = {
            "Authorization": f"Basic {base64_user_pass}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{settings.CORREO_ARGENTINO_URL}/token",
                headers=headers,
                timeout=10.0
            )
        if res.status_code == 200:
            return res.json().get("token")
        else:
            print(f"[!] Error al obtener token de Correo Argentino: {res.text}")
            return None
    except Exception as e:
        print(f"[!] Excepción al obtener token de Correo Argentino: {str(e)}")
        return None

# ==========================================
# SHIPPING ENDPOINTS
# ==========================================

@router.post("/quote", response_model=list[ShippingQuoteResponse])
async def get_shipping_quote(
    quote_data: ShippingQuoteRequest,
    db: Client = Depends(get_db)
):
    # Intentar obtener el token de Correo Argentino
    token = await get_correo_argentino_token()
    
    # 1. Fallback Mock si no hay credenciales (o en desarrollo local)
    if not token:
        try:
            cp_dest = int(quote_data.cp_destino)
        except ValueError:
            cp_dest = 2000
            
        cp_orig = int(settings.CP_ORIGEN)
        distance_factor = abs(cp_dest - cp_orig)
        
        base_classic = 2500.0
        base_priority = 4200.0
        
        weight_extra = (quote_data.peso_gr / 1000.0) * 450.0 # $450 por kg
        distance_extra = min(distance_factor * 0.5, 3000.0)
        
        precio_clasico = round(base_classic + weight_extra + distance_extra, 2)
        precio_prioridad = round(base_priority + (weight_extra * 1.2) + (distance_extra * 1.5), 2)
        
        return [
            ShippingQuoteResponse(
                modalidad="Encomienda Clásica",
                precio=precio_clasico,
                dias_estimados=3 if distance_factor < 500 else (5 if distance_factor < 2000 else 7)
            ),
            ShippingQuoteResponse(
                modalidad="Encomienda Prioridad",
                precio=precio_prioridad,
                dias_estimados=1 if distance_factor < 500 else (2 if distance_factor < 2000 else 3)
            )
        ]
        
    # 2. Llamada real a la API de Correo Argentino
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "customerId": settings.CORREO_ARGENTINO_CUSTOMER_ID,
            "postalCodeOrigin": settings.CP_ORIGEN,
            "postalCodeDestination": quote_data.cp_destino,
            "dimensions": {
                "weight": int(quote_data.peso_gr),
                "height": int(quote_data.alto_cm),
                "width": int(quote_data.ancho_cm),
                "length": int(quote_data.largo_cm)
            }
        }
        
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{settings.CORREO_ARGENTINO_URL}/rates",
                json=payload,
                headers=headers,
                timeout=10.0
            )
            
        if res.status_code == 200:
            rates_data = res.json().get("rates", [])
            quotes = []
            for rate in rates_data:
                service_name = rate.get("serviceName", "Encomienda")
                price = float(rate.get("price", 0.0))
                days = int(rate.get("estimatedDeliveryDays", 5))
                
                if "express" in service_name.lower() or "prioridad" in service_name.lower():
                    modalidad = "Encomienda Prioridad"
                else:
                    modalidad = "Encomienda Clásica"
                    
                quotes.append(
                    ShippingQuoteResponse(
                        modalidad=modalidad,
                        precio=price,
                        dias_estimados=days
                    )
                )
            
            if not quotes:
                raise ValueError("API returned empty rates list")
            return quotes
        else:
            print(f"[!] Error de API Correo Argentino: {res.text}")
            raise HTTPException(status_code=400, detail="Error al cotizar con Correo Argentino")
    except Exception as e:
        print(f"[!] Excepción al cotizar con Correo Argentino: {str(e)}")
        # Contingencia mock si se cae el endpoint real
        return [
            ShippingQuoteResponse(modalidad="Encomienda Clásica", precio=3500.0, dias_estimados=5),
            ShippingQuoteResponse(modalidad="Encomienda Prioridad", precio=5200.0, dias_estimados=2)
        ]

@router.post("/orders/{id}/shipping/label", response_model=ShippingLabelResponse, status_code=status.HTTP_201_CREATED)
async def generate_shipping_label(
    id: str,
    label_data: CreateLabelRequest,
    admin: dict = Depends(require_admin),
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    try:
        # 1. Verificar existencia de la orden
        ord_res = db.table("orders").select("id, status, shipping_address").eq("id", id).execute()
        if not ord_res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        order = ord_res.data[0]
        
        # Intentar obtener el token de Correo Argentino
        token = await get_correo_argentino_token()
        
        tracking_number = label_data.tracking_number
        label_url = None
        
        # 2. Generación Real vs Mock
        if token and not tracking_number:
            try:
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                
                import_payload = {
                    "customerId": settings.CORREO_ARGENTINO_CUSTOMER_ID,
                    "orders": [
                        {
                            "externalReference": id,
                            "deliveryAddress": order.get("shipping_address", {}),
                            "weight": 1000,
                            "dimensions": {"height": 10, "width": 15, "length": 20}
                        }
                    ]
                }
                
                async with httpx.AsyncClient() as client:
                    res = await client.post(
                        f"{settings.CORREO_ARGENTINO_URL}/shipping/import",
                        json=import_payload,
                        headers=headers,
                        timeout=10.0
                    )
                    
                if res.status_code in [200, 201]:
                    import_res = res.json()
                    shipment = import_res.get("shipments", [{}])[0]
                    tracking_number = shipment.get("trackingNumber")
                    label_url = shipment.get("labelUrl")
                else:
                    print(f"[!] Error al importar envío en Correo Argentino: {res.text}")
            except Exception as e:
                print(f"[!] Excepción al importar envío: {str(e)}")
                
        # 3. Fallback Mock si no hay tracking
        if not tracking_number:
            rand_code = "".join(random.choices("0123456789", k=9))
            tracking_number = f"CP{rand_code}AR"
            
        if not label_url:
            label_url = f"https://api.correoargentino.com.ar/labels/mock_label_{id}.pdf"
            
        # 4. Guardar o actualizar en shipping_labels
        label_check = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        
        payload = {
            "order_id": id,
            "carrier": label_data.carrier,
            "tracking_number": tracking_number,
            "label_url": label_url
        }
        
        if label_check.data:
            label_id = label_check.data[0]["id"]
            res = db.table("shipping_labels").update(payload).eq("id", label_id).execute()
        else:
            res = db.table("shipping_labels").insert(payload).execute()
            
        if not res.data:
            raise HTTPException(status_code=400, detail="No se pudo guardar la información de envío")
            
        # 5. Cambiar orden a "shipped"
        db.table("orders").update({"status": "shipped"}).eq("id", id).execute()
        
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al generar etiqueta: {str(e)}")

@router.get("/track/{tracking_number}", response_model=ShippingTrackingResponse)
async def get_tracking_status(
    tracking_number: str,
    current_user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    # Buscar la orden por número de tracking en calen.shipping_labels
    label_res = db.table("shipping_labels").select("order_id, carrier").eq("tracking_number", tracking_number).execute()
    if not label_res.data:
        raise HTTPException(status_code=404, detail="Número de tracking no encontrado.")
        
    label_info = label_res.data[0]
    order_id = label_info["order_id"]
    carrier = label_info["carrier"]
    
    # Validar permisos (usuario dueño del pedido o admin)
    ord_res = db.table("orders").select("user_id, status").eq("id", order_id).execute()
    if not ord_res.data:
        raise HTTPException(status_code=404, detail="Orden asociada al tracking no encontrada.")
        
    order = ord_res.data[0]
    if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado a este tracking.")
        
    # Intentar obtener el token de Correo Argentino
    token = await get_correo_argentino_token()
    
    # 1. Consulta Real si hay credenciales
    if token and carrier == "correo_argentino":
        try:
            headers = {"Authorization": f"Bearer {token}"}
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"{settings.CORREO_ARGENTINO_URL}/shipping/tracking?tracking_number={tracking_number}",
                    headers=headers,
                    timeout=10.0
                )
                
            if res.status_code == 200:
                track_data = res.json()
                events_list = track_data.get("data", {}).get("history", [])
                history = []
                for ev in events_list:
                    history.append(
                        TrackingEvent(
                            date=ev.get("date", ""),
                            description=ev.get("description", "")
                        )
                    )
                last_status = track_data.get("data", {}).get("last_status", "En tránsito")
                
                return ShippingTrackingResponse(
                    tracking_number=tracking_number,
                    status=last_status.lower(),
                    carrier=carrier,
                    history=history
                )
        except Exception as e:
            print(f"[!] Excepción al consultar tracking: {str(e)}")
            
    # 2. Fallback Mock Historial
    status_order = order["status"]
    
    history = [
        TrackingEvent(date="2026-05-26T10:00:00Z", description="Envío pre-ingresado por el remitente")
    ]
    
    current_status = "pending"
    if status_order in ["shipped", "delivered"]:
        history.append(TrackingEvent(date="2026-05-26T14:30:00Z", description="Admisión del envío en Sucursal Origen (Correo Argentino)"))
        history.append(TrackingEvent(date="2026-05-27T08:15:00Z", description="En tránsito hacia Centro de Distribución principal"))
        current_status = "shipped"
        
    if status_order == "delivered":
        history.append(TrackingEvent(date="2026-05-28T11:45:00Z", description="Envío en distribución domiciliaria"))
        history.append(TrackingEvent(date="2026-05-28T14:00:00Z", description="Envío entregado exitosamente"))
        current_status = "delivered"
        
    return ShippingTrackingResponse(
        tracking_number=tracking_number,
        status=current_status,
        carrier=carrier,
        history=history
    )

# Endpoints originales mantenidos para compatibilidad de vistas anteriores

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
        ord_res = db.table("orders").select("id, status").eq("id", id).execute()
        if not ord_res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        label_check = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        
        payload = {
            "order_id": id,
            "carrier": shipping_data.carrier,
            "tracking_number": shipping_data.tracking_number,
            "label_url": shipping_data.label_url
        }
        
        if label_check.data:
            label_id = label_check.data[0]["id"]
            res = db.table("shipping_labels").update(payload).eq("id", label_id).execute()
        else:
            res = db.table("shipping_labels").insert(payload).execute()
            
        if not res.data:
            raise HTTPException(status_code=400, detail="No se pudo guardar la información de envío")

        db.table("orders").update({"status": "shipped"}).eq("id", id).execute()
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
        ord_res = db.table("orders").select("user_id").eq("id", id).execute()
        if not ord_res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        order = ord_res.data[0]
        if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Acceso denegado a la información de envío.")

        res = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Información de envío no disponible aún.")
            
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener tracking de envío: {str(e)}")
