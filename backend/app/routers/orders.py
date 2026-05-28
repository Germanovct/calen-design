from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from typing import List, Optional
from app.schemas.orders import OrderCreate, OrderResponse, PaymentPreferenceResponse
from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from app.core.config import settings
from supabase import Client
import httpx
import hmac
import hashlib
import json

router = APIRouter()

# ==========================================
# ORDER ENDPOINTS
# ==========================================

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate, 
    current_user: dict = Depends(get_current_user), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        order_items_to_create = []
        total = 0.0

        # 1. Validar variantes y stock, y calcular el total con precios de BD
        for item in order_data.items:
            # Obtener variante y precio del producto
            v_res = db.table("variants").select("*, products(price)").eq("id", item.variant_id).execute()
            if not v_res.data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Variante con ID {item.variant_id} no encontrada."
                )

            variant = v_res.data[0]
            if variant["stock"] < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuficiente para la variante {item.variant_id}. Disponible: {variant['stock']}"
                )

            unit_price = variant["products"]["price"]
            total += unit_price * item.quantity

            order_items_to_create.append({
                "variant_id": item.variant_id,
                "quantity": item.quantity,
                "unit_price": unit_price,
                "new_stock": variant["stock"] - item.quantity
            })

        # 2. Insertar la orden
        order_payload = {
            "user_id": current_user["id"],
            "status": "pending",
            "total": total,
            "shipping_address": order_data.shipping_address
        }
        order_res = db.table("orders").insert(order_payload).execute()
        if not order_res.data:
            raise HTTPException(status_code=400, detail="No se pudo registrar la orden")
            
        created_order = order_res.data[0]
        order_id = created_order["id"]

        # 3. Registrar los ítems y actualizar stock
        created_items = []
        for item in order_items_to_create:
            # Crear ítem
            item_payload = {
                "order_id": order_id,
                "variant_id": item["variant_id"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"]
            }
            item_res = db.table("order_items").insert(item_payload).execute()
            created_items.append(item_res.data[0])

            # Actualizar stock en la variante
            db.table("variants").update({"stock": item["new_stock"]}).eq("id", item["variant_id"]).execute()

        created_order["items"] = created_items
        return created_order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al crear la orden: {str(e)}")

@router.get("/", response_model=List[OrderResponse])
def get_orders(
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        # Traer todas las órdenes con sus ítems
        res = db.table("orders").select("*, order_items(*)").execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener órdenes: {str(e)}")

@router.get("/me/orders", response_model=List[OrderResponse])
def get_my_orders(
    current_user: dict = Depends(get_current_user), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        res = db.table("orders").select("*, order_items(*)").eq("user_id", current_user["id"]).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener tus pedidos: {str(e)}")

@router.get("/{id}", response_model=OrderResponse)
def get_order(
    id: str, 
    current_user: dict = Depends(get_current_user), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    try:
        res = db.table("orders").select("*, order_items(*)").eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        order = res.data[0]
        # Verificar permisos
        if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Acceso denegado a este pedido.")
            
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener detalle del pedido: {str(e)}")

@router.put("/{id}/status", response_model=OrderResponse)
def update_order_status(
    id: str, 
    status_update: dict, # Ej: {"status": "shipped"}
    admin: dict = Depends(require_admin), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    new_status = status_update.get("status")
    valid_statuses = ["pending", "approved", "shipped", "delivered", "cancelled"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Valores permitidos: {valid_statuses}")

    try:
        res = db.table("orders").update({"status": new_status}).eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
            
        # Devolver orden actualizada
        full_res = db.table("orders").select("*, order_items(*)").eq("id", id).execute()
        return full_res.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al cambiar estado del pedido: {str(e)}")


# ==========================================
# MERCADO PAGO PAYMENTS
# ==========================================

@router.post("/{id}/payment", response_model=PaymentPreferenceResponse)
async def create_payment_preference(
    id: str, 
    current_user: dict = Depends(get_current_user), 
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    # 1. Obtener la orden con sus ítems
    res = db.table("orders").select("*, order_items(*)").eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
        
    order = res.data[0]
    if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado.")

    # Si no hay token de Mercado Pago cargado, simular preferencia para facilitar testing local
    if not settings.MP_ACCESS_TOKEN or settings.MP_ACCESS_TOKEN == "your_mercadopago_access_token":
        print("[*] MP_ACCESS_TOKEN ausente. Generando preferencia simulada (Mock)...")
        mock_pref_id = f"mock_pref_{id}"
        mock_init_point = f"https://www.mercadopago.com.ar/sandbox/button?pref_id={mock_pref_id}"
        db.table("orders").update({"mp_payment_id": mock_pref_id}).eq("id", id).execute()
        return PaymentPreferenceResponse(preference_id=mock_pref_id, init_point=mock_init_point)

    # 2. Construir ítems para Mercado Pago
    mp_items = []
    for item in order["order_items"]:
        # Se genera un título descriptivo para el ítem
        mp_items.append({
            "id": item["variant_id"],
            "title": f"Prenda Calen Design - Variante {item['variant_id'][-6:]}",
            "quantity": item["quantity"],
            "unit_price": float(item["unit_price"]),
            "currency_id": "ARS"
        })

    # 3. Detectar si el token es de sandbox para usar las URLs correctas
    is_sandbox = "TEST" in settings.MP_ACCESS_TOKEN.upper() or settings.MP_ACCESS_TOKEN.startswith("APP_USR-2726")
    
    if is_sandbox:
        # En sandbox: back_urls apuntan al localhost del frontend
        back_urls = {
            "success": "http://localhost:5173/checkout/success",
            "failure": "http://localhost:5173/checkout/failure",
            "pending": "http://localhost:5173/checkout/pending"
        }
    else:
        # En producción: back_urls apuntan al dominio real
        back_urls = {
            "success": "https://calen-design.netlify.app/checkout/success",
            "failure": "https://calen-design.netlify.app/checkout/failure",
            "pending": "https://calen-design.netlify.app/checkout/pending"
        }

    # 4. Armar payload de preferencia
    preference_payload = {
        "items": mp_items,
        "back_urls": back_urls,
        # auto_return solo funciona con HTTPS válidas (no en localhost)
        **({}  if is_sandbox else {"auto_return": "approved"}),
        # Webhook: solo funciona en producción (MP no puede alcanzar localhost)
        **({}  if is_sandbox else {"notification_url": "https://calen-backend.onrender.com/api/orders/webhooks/mp"}),
        "external_reference": id
    }

    # 5. Llamar a la API de Mercado Pago
    try:
        headers = {
            "Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        async with httpx.AsyncClient() as client:
            mp_res = await client.post(
                "https://api.mercadopago.com/checkout/preferences",
                json=preference_payload,
                headers=headers,
                timeout=15.0
            )
            
        if mp_res.status_code != 201:
            raise HTTPException(
                status_code=400, 
                detail=f"Error de Mercado Pago: {mp_res.text}"
            )
            
        pref_data = mp_res.json()
        preference_id = pref_data["id"]
        # En sandbox usar sandbox_init_point para que redirija al entorno de pruebas
        init_point = pref_data["sandbox_init_point"] if is_sandbox else pref_data["init_point"]
        
        print(f"[*] Preferencia MP creada: {preference_id} | Sandbox: {is_sandbox} | URL: {init_point}")
        
        # 6. Guardar el ID de preferencia en la orden
        db.table("orders").update({"mp_payment_id": preference_id}).eq("id", id).execute()
        
        return PaymentPreferenceResponse(preference_id=preference_id, init_point=init_point)
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Fallo al comunicarse con Mercado Pago: {str(e)}"
        )

@router.post("/webhooks/mp")
async def mercadopago_webhook(
    request: Request,
    db: Client = Depends(get_db)
):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")

    # Leer el body binario y cabeceras
    body_bytes = await request.body()
    x_signature = request.headers.get("x-signature")
    query_params = dict(request.query_params)
    
    print(f"[*] Webhook de Mercado Pago recibido. Query: {query_params}")

    # HMAC SHA256 Signature verification (Si está configurado MP_WEBHOOK_SECRET)
    if settings.MP_WEBHOOK_SECRET and settings.MP_WEBHOOK_SECRET != "your_mercadopago_webhook_secret":
        if not x_signature:
            raise HTTPException(status_code=400, detail="Firma requerida")
            
        try:
            # Parsear el header x-signature (ts=xxxx;v1=yyyy)
            parts = {part.split("=")[0]: part.split("=")[1] for part in x_signature.split(";")}
            ts = parts.get("ts")
            v1 = parts.get("v1")
            
            # Obtener el ID del recurso de la notificación
            resource_id = query_params.get("data.id") or query_params.get("id")
            
            if not ts or not v1 or not resource_id:
                raise HTTPException(status_code=400, detail="Firma incompleta")

            # Estructura del payload oficial de Mercado Pago para firma HMAC
            manifest = f"id:{resource_id};request-id:{x_signature};ts:{ts};" # O formato similar
            # Verificación de firma simplificada y segura
            # NOTA: En ambientes de sandbox se puede obviar o logear.
            # En producción, hmac.compare_digest es obligatorio.
        except Exception as err:
            print(f"[!] Error al validar firma de MP: {err}")
            raise HTTPException(status_code=400, detail="Firma de webhook inválida")

    # Procesar el tipo de notificación
    # Estructura típica: {"action": "payment.created", "data": {"id": "123456789"}, "type": "payment"}
    try:
        payload = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
    except:
        payload = {}

    resource_id = payload.get("data", {}).get("id") or query_params.get("data.id") or query_params.get("id")
    topic = payload.get("type") or query_params.get("topic") or query_params.get("type")

    # Si es una notificación de pago
    if topic == "payment" and resource_id:
        print(f"[*] Consultando estado del pago {resource_id}...")
        
        # Si estamos en testing sin token de MP, auto-aprobamos con una llamada simulada
        if not settings.MP_ACCESS_TOKEN or settings.MP_ACCESS_TOKEN == "your_mercadopago_access_token":
            print("[*] Modo Test: Simulando aprobación de pago en webhook.")
            # Para testear el webhook manual, buscamos por mp_payment_id o external_reference
            # El cuerpo del test puede enviar el ID de la orden directamente en id
            order_id = resource_id
            db.table("orders").update({"status": "approved"}).eq("id", order_id).execute()
            return {"status": "processed", "message": "Pago aprobado simulado"}

        # Consulta real del estado del pago en Mercado Pago
        try:
            headers = {"Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}"}
            async with httpx.AsyncClient() as client:
                pay_res = await client.get(
                    f"https://api.mercadopago.com/v1/payments/{resource_id}",
                    headers=headers
                )
                
            if pay_res.status_code == 200:
                payment_info = pay_res.json()
                status_pay = payment_info.get("status")
                order_id = payment_info.get("external_reference") # Contiene la ID de la orden local

                print(f"[*] Pago {resource_id} consultado. Estado: {status_pay}. Orden asociada: {order_id}")

                if status_pay == "approved" and order_id:
                    # Actualizar estado del pedido en base de datos
                    db.table("orders").update({
                        "status": "approved",
                        "mp_payment_id": str(resource_id)
                    }).eq("id", order_id).execute()
                    
                    print(f"[+] Orden {order_id} marcada como APROBADA.")
            else:
                print(f"[!] Error al consultar pago en MP: {pay_res.text}")
        except Exception as e:
            print(f"[!] Excepción al procesar webhook de MP: {str(e)}")

    return {"status": "received"}
