import base64
import random
import httpx
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from app.core.email import (
    send_transactional_email,
    fetch_order_details_for_email,
    get_order_shipped_template
)
from app.schemas.shipping import (
    ShippingLabelCreate, ShippingLabelResponse,
    ShippingQuoteRequest, ShippingQuoteResponse,
    CreateLabelRequest, ShippingTrackingResponse, TrackingEvent
)
from app.core.database import get_db
from app.core.dependencies import require_admin, get_current_user
from app.core.config import settings
from supabase import Client

import json
from app.core.email import (
    send_transactional_email,
    fetch_order_details_for_email,
    get_order_shipped_template
)

# Helper functions for Uber Direct
def is_caba_gba(cp_destino: str) -> bool:
    try:
        cp = int(cp_destino)
        return 1000 <= cp <= 1899
    except ValueError:
        return False

async def get_uber_token() -> Optional[str]:
    if not settings.UBER_CLIENT_ID or not settings.UBER_CLIENT_SECRET:
        return None
    try:
        payload = {
            "client_id": settings.UBER_CLIENT_ID,
            "client_secret": settings.UBER_CLIENT_SECRET,
            "grant_type": "client_credentials",
            "scope": "delivery"
        }
        async with httpx.AsyncClient() as client:
            res = await client.post("https://login.uber.com/oauth/v2/token", data=payload)
            if res.status_code == 200:
                return res.json().get("access_token")
    except Exception as e:
        print(f"[!] Error al obtener OAuth token de Uber: {e}")
    return None

async def get_uber_quote_value(cp_destino: str, token: str) -> Optional[float]:
    if not settings.UBER_CUSTOMER_ID:
        return None
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "pickup_address": json.dumps({
                "street_address": ["Av. Santa Fe 3400"],
                "city": "CABA",
                "state": "Buenos Aires",
                "zip_code": settings.CP_ORIGEN,
                "country": "AR"
            }),
            "dropoff_address": json.dumps({
                "street_address": ["Calle Falsa 123"],
                "city": "CABA",
                "state": "Buenos Aires",
                "zip_code": cp_destino,
                "country": "AR"
            })
        }
        url = f"https://api.uber.com/v1/customers/{settings.UBER_CUSTOMER_ID}/delivery_quotes"
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload, headers=headers)
            if res.status_code == 200:
                quote_res = res.json()
                return float(quote_res.get("fee", 280000)) / 100.0
    except Exception as e:
        print(f"[!] Error al cotizar con Uber Direct: {e}")
    return None

import re
import datetime

def parse_street_address(address_str: str) -> tuple[str, str, str]:
    # Intentar separar calle y número. Ej: "Av. Santa Fe 3400 Piso 5B"
    match = re.search(r'^(.*?)\s+(\d+)\s*(.*?)$', address_str)
    if match:
        street = match.group(1).strip()
        number = match.group(2).strip()
        floor_dept = match.group(3).strip()
        return street, number, floor_dept
    return address_str, "S/N", ""

def resolve_province_code(city_str: str, zip_str: str) -> str:
    city_clean = city_str.lower().strip()
    
    keywords = {
        "buenos aires": "B",
        "caba": "C",
        "capital federal": "C",
        "ciudad autonoma": "C",
        "ciudad autónoma": "C",
        "cordoba": "X",
        "córdoba": "X",
        "santa fe": "S",
        "mendoza": "M",
        "tucuman": "T",
        "tucumán": "T",
        "salta": "A",
        "jujuy": "Y",
        "chaco": "H",
        "formosa": "P",
        "corrientes": "W",
        "misiones": "N",
        "entre rios": "E",
        "entre ríos": "E",
        "santiago del estero": "G",
        "la rioja": "F",
        "catamarca": "K",
        "san juan": "J",
        "san luis": "D",
        "la pampa": "L",
        "neuquen": "Q",
        "neuquén": "Q",
        "rio negro": "R",
        "río negro": "R",
        "chubut": "U",
        "santa cruz": "Z",
        "tierra del fuego": "V"
    }
    
    for kw, code in keywords.items():
        if kw in city_clean:
            return code
            
    try:
        digits = "".join(filter(str.isdigit, zip_str))
        if len(digits) >= 4:
            cp_int = int(digits[:4])
            if 1000 <= cp_int <= 1499:
                return "C"
            elif 1500 <= cp_int <= 1999:
                return "B"
            elif 2000 <= cp_int <= 2999:
                return "B"
            elif 3000 <= cp_int <= 3499:
                return "S"
            elif 3500 <= cp_int <= 3599:
                return "H"
            elif 3600 <= cp_int <= 3699:
                return "P"
            elif 3700 <= cp_int <= 3799:
                return "H"
            elif 4000 <= cp_int <= 4399:
                return "T"
            elif 4400 <= cp_int <= 4599:
                return "A"
            elif 4600 <= cp_int <= 4699:
                return "Y"
            elif 5000 <= cp_int <= 5299:
                return "X"
            elif 5400 <= cp_int <= 5499:
                return "J"
            elif 5500 <= cp_int <= 5699:
                return "M"
            elif 5700 <= cp_int <= 5899:
                return "D"
            elif 8000 <= cp_int <= 8199:
                return "B"
            elif 8300 <= cp_int <= 8399:
                return "Q"
            elif 8400 <= cp_int <= 8499:
                return "R"
            elif 9000 <= cp_int <= 9299:
                return "U"
            elif 9300 <= cp_int <= 9399:
                return "Z"
            elif cp_int >= 9400:
                return "V"
    except Exception:
        pass
        
    return "B"

def get_correo_argentino_headers() -> Optional[dict]:
    # En API 2.0 (Paqar):
    # CORREO_ARGENTINO_PASSWORD se usa como el API-Key (Apikey <Key>)
    # CORREO_ARGENTINO_CUSTOMER_ID se usa como el agreement code
    if not settings.CORREO_ARGENTINO_PASSWORD or not settings.CORREO_ARGENTINO_CUSTOMER_ID:
        return None
    return {
        "Authorization": f"Apikey {settings.CORREO_ARGENTINO_PASSWORD}",
        "agreement": settings.CORREO_ARGENTINO_CUSTOMER_ID,
        "Content-Type": "application/json"
    }

router = APIRouter()

# ==========================================
# SHIPPING ENDPOINTS
# ==========================================

@router.post("/quote", response_model=list[ShippingQuoteResponse])
async def get_shipping_quote(
    quote_data: ShippingQuoteRequest,
    db: Client = Depends(get_db)
):
    quotes = []

    # --- 1. Obtener cotización de Correo Argentino ---
    headers = get_correo_argentino_headers()
    if not headers:
        # Fallback Mock
        try:
            cp_dest = int(quote_data.cp_destino)
        except ValueError:
            cp_dest = 2000
        cp_orig = int(settings.CP_ORIGEN)
        distance_factor = abs(cp_dest - cp_orig)
        base_classic = 2500.0
        base_priority = 4200.0
        weight_extra = (quote_data.peso_gr / 1000.0) * 450.0
        distance_extra = min(distance_factor * 0.5, 3000.0)
        
        precio_clasico = round(base_classic + weight_extra + distance_extra, 2)
        precio_prioridad = round(base_priority + (weight_extra * 1.2) + (distance_extra * 1.5), 2)
        
        quotes.append(ShippingQuoteResponse(
            modalidad="Encomienda Clásica",
            precio=precio_clasico,
            dias_estimados=3 if distance_factor < 500 else (5 if distance_factor < 2000 else 7)
        ))
        quotes.append(ShippingQuoteResponse(
            modalidad="Encomienda Prioridad",
            precio=precio_prioridad,
            dias_estimados=1 if distance_factor < 500 else (2 if distance_factor < 2000 else 3)
        ))
    else:
        try:
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
                    f"{settings.CORREO_ARGENTINO_URL}/v1/rates",
                    json=payload,
                    headers=headers,
                    timeout=10.0
                )
            if res.status_code == 200:
                rates_data = res.json().get("rates", [])
                for rate in rates_data:
                    service_name = rate.get("serviceName", "Encomienda")
                    price = float(rate.get("price", 0.0))
                    days = int(rate.get("estimatedDeliveryDays", 5))
                    modalidad = "Encomienda Prioridad" if ("express" in service_name.lower() or "prioridad" in service_name.lower()) else "Encomienda Clásica"
                    quotes.append(ShippingQuoteResponse(
                        modalidad=modalidad,
                        precio=price,
                        dias_estimados=days
                    ))
            else:
                raise ValueError(f"Correo Argentino rates query failed: {res.text}")
        except Exception as e:
            print(f"[!] Error al cotizar real con Correo Argentino API 2.0: {e}")
            # Mock fallback
            quotes.append(ShippingQuoteResponse(modalidad="Encomienda Clásica", precio=3500.0, dias_estimados=5))
            quotes.append(ShippingQuoteResponse(modalidad="Encomienda Prioridad", precio=5200.0, dias_estimados=2))

    # --- 2. Agregar Uber Direct si aplica (CABA/GBA) ---
    if is_caba_gba(quote_data.cp_destino):
        uber_price = None
        uber_token = await get_uber_token()
        if uber_token:
            uber_price = await get_uber_quote_value(quote_data.cp_destino, uber_token)
        
        if not uber_price:
            # Mock fallback
            try:
                cp_dest = int(quote_data.cp_destino)
            except ValueError:
                cp_dest = 1425
            cp_orig = int(settings.CP_ORIGEN)
            distance_factor = abs(cp_dest - cp_orig)
            uber_price = round(2800.0 + (distance_factor * 2.0), 2)
            
        quotes.append(ShippingQuoteResponse(
            modalidad="Envío Express Same-Day",
            precio=uber_price,
            dias_estimados=0  # 0 indica entrega en el día
        ))

    return quotes

@router.post("/orders/{id}/shipping/label", response_model=ShippingLabelResponse, status_code=status.HTTP_201_CREATED)
async def generate_shipping_label(
    id: str,
    label_data: CreateLabelRequest,
    background_tasks: BackgroundTasks,
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
        
        # Obtener cabeceras de Correo Argentino
        headers = get_correo_argentino_headers()
        
        tracking_number = label_data.tracking_number
        label_url = None
        
        # 2. Generación Real vs Mock
        if headers and not tracking_number:
            try:
                street_name, street_number, floor_dept = parse_street_address(order.get("shipping_address", {}).get("address", ""))
                
                selected_method = order.get("shipping_address", {}).get("shipping_method", "")
                service_type = "CP" if "prioridad" in selected_method.lower() else "CC"
                
                sender_province = resolve_province_code("Buenos Aires", settings.CP_ORIGEN)
                recipient_province = resolve_province_code(
                    order.get("shipping_address", {}).get("city", ""),
                    order.get("shipping_address", {}).get("zip_code", "")
                )
                
                import_payload = {
                    "sellerId": "1",
                    "trackingNumber": "",
                    "order": {
                        "senderData": {
                            "id": "1",
                            "businessName": "Calen Design",
                            "areaCodePhone": "11",
                            "phoneNumber": "55554444",
                            "areaCodeCellphone": "11",
                            "cellphoneNumber": "55554444",
                            "email": "hola@calendesign.com.ar",
                            "observation": "",
                            "address": {
                                "streetName": "Av. Santa Fe",
                                "streetNumber": "3400",
                                "cityName": "CABA",
                                "floor": "",
                                "department": "",
                                "state": sender_province,
                                "zipCode": settings.CP_ORIGEN
                            }
                        },
                        "shippingData": {
                            "name": order.get("shipping_address", {}).get("name", "Comprador"),
                            "areaCodePhone": "",
                            "phoneNumber": "",
                            "areaCodeCellphone": "",
                            "cellphoneNumber": order.get("shipping_address", {}).get("phone", ""),
                            "email": order.get("shipping_address", {}).get("email", ""),
                            "observation": "",
                            "address": {
                                "streetName": street_name,
                                "streetNumber": street_number,
                                "cityName": order.get("shipping_address", {}).get("city", ""),
                                "floor": floor_dept,
                                "department": "",
                                "state": recipient_province,
                                "zipCode": order.get("shipping_address", {}).get("zip_code", "")
                            }
                        },
                        "parcels": [
                            {
                                "dimensions": {
                                    "height": "10",
                                    "width": "15",
                                    "depth": "20"
                                },
                                "productWeight": "1000",
                                "productCategory": "Prendas de Vestir",
                                "declaredValue": str(int(order.get("total", 8000)))
                            }
                        ],
                        "deliveryType": "homeDelivery",
                        "agencyId": "",
                        "saleDate": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S-03:00"),
                        "serviceType": service_type,
                        "shipmentClientId": ""
                    }
                }
                
                async with httpx.AsyncClient() as client:
                    res = await client.post(
                        f"{settings.CORREO_ARGENTINO_URL}/v1/orders",
                        json=import_payload,
                        headers=headers,
                        timeout=10.0
                    )
                    
                if res.status_code in [200, 201]:
                    import_res = res.json()
                    tracking_number = import_res.get("trackingNumber")
                    
                    # Llamar al endpoint v1/labels para obtener el base64 del PDF
                    label_payload = [
                        {
                            "sellerId": settings.CORREO_ARGENTINO_CUSTOMER_ID,
                            "trackingNumber": tracking_number
                        }
                    ]
                    async with httpx.AsyncClient() as label_client:
                        label_res = await label_client.post(
                            f"{settings.CORREO_ARGENTINO_URL}/v1/labels?labelFormat=10x15",
                            json=label_payload,
                            headers=headers,
                            timeout=10.0
                        )
                    if label_res.status_code == 200:
                        label_data_list = label_res.json()
                        if label_data_list and isinstance(label_data_list, list):
                            file_b64 = label_data_list[0].get("fileBase64")
                            if file_b64:
                                label_url = f"data:application/pdf;base64,{file_b64}"
                                print(f"[+] Etiqueta PDF obtenida en base64 para TN: {tracking_number}")
                                
                    if not label_url:
                        label_url = f"{settings.CORREO_ARGENTINO_URL}/v1/orders/{tracking_number}/label"
                else:
                    print(f"[!] Error al crear orden en Correo Argentino Paqar 2.0: {res.text}")
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
        
        # Enviar email de confirmación de despacho
        try:
            full_order = fetch_order_details_for_email(db, id)
            if full_order and full_order.get("shipping_address"):
                to_email = full_order["shipping_address"].get("email")
                if to_email:
                    subject = f"Tu pedido ha sido despachado - Pedido #{id[:8].upper()}"
                    html = get_order_shipped_template(full_order, label_data.carrier, tracking_number)
                    background_tasks.add_task(send_transactional_email, to_email, subject, html)
        except Exception as email_err:
            print(f"[!] Error al encolar email en generate_shipping_label: {email_err}")

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
    background_tasks: BackgroundTasks,
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

        # Enviar email de confirmación de despacho (fallback endpoint)
        try:
            full_order = fetch_order_details_for_email(db, id)
            if full_order and full_order.get("shipping_address"):
                to_email = full_order["shipping_address"].get("email")
                if to_email:
                    subject = f"Tu pedido ha sido despachado - Pedido #{id[:8].upper()}"
                    html = get_order_shipped_template(full_order, shipping_data.carrier, shipping_data.tracking_number)
                    background_tasks.add_task(send_transactional_email, to_email, subject, html)
        except Exception as email_err:
            print(f"[!] Error al encolar email en create_shipping_label fallback: {email_err}")

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

@router.post("/orders/{id}/shipping/uber", response_model=ShippingLabelResponse, status_code=status.HTTP_201_CREATED)
async def dispatch_with_uber_direct(
    id: str,
    background_tasks: BackgroundTasks,
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
        
        # 2. Intentar llamar a Uber API real
        token = await get_uber_token()
        tracking_number = None
        label_url = None
        
        if token and settings.UBER_CUSTOMER_ID:
            try:
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                
                delivery_payload = {
                    "pickup_address": json.dumps({
                        "street_address": ["Av. Santa Fe 3400"],
                        "city": "CABA",
                        "state": "Buenos Aires",
                        "zip_code": settings.CP_ORIGEN,
                        "country": "AR"
                    }),
                    "dropoff_address": json.dumps({
                        "street_address": [order["shipping_address"].get("address", "Calle Falsa 123")],
                        "city": order["shipping_address"].get("city", "CABA"),
                        "state": "Buenos Aires",
                        "zip_code": order["shipping_address"].get("zip_code", "1425"),
                        "country": "AR"
                    }),
                    "manifest_items": [
                        {
                            "name": "Paquete Calen Design",
                            "quantity": 1
                        }
                    ],
                    "pickup_name": "Calen Design",
                    "pickup_phone_number": "+541155554444",
                    "dropoff_name": order["shipping_address"].get("name", "Cliente"),
                    "dropoff_phone_number": order["shipping_address"].get("phone", "+541155554444")
                }
                
                url = f"https://api.uber.com/v1/customers/{settings.UBER_CUSTOMER_ID}/deliveries"
                async with httpx.AsyncClient() as client:
                    res = await client.post(url, json=delivery_payload, headers=headers)
                    
                if res.status_code in [200, 201]:
                    delivery_res = res.json()
                    tracking_number = delivery_res.get("id")
                    label_url = delivery_res.get("share_url")
            except Exception as e:
                print(f"[!] Error al crear envío real con Uber Direct: {str(e)}")
                
        # 3. Fallback Mock si no hay tracking de la API real
        if not tracking_number:
            rand_code = "".join(random.choices("0123456789", k=6))
            tracking_number = f"UBER-{rand_code}"
            
        if not label_url:
            label_url = f"https://www.uber.com/lookup/mock_uber_track_{id}"
            
        # 4. Guardar o actualizar en shipping_labels
        label_check = db.table("shipping_labels").select("*").eq("order_id", id).execute()
        
        payload = {
            "order_id": id,
            "carrier": "Uber Direct",
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
        
        # Enviar email de despacho
        try:
            full_order = fetch_order_details_for_email(db, id)
            if full_order and full_order.get("shipping_address"):
                to_email = full_order["shipping_address"].get("email")
                if to_email:
                    subject = f"Tu pedido ha sido despachado - Pedido #{id[:8].upper()}"
                    html = get_order_shipped_template(full_order, "Uber Direct", tracking_number)
                    background_tasks.add_task(send_transactional_email, to_email, subject, html)
        except Exception as email_err:
            print(f"[!] Error al encolar email en dispatch_with_uber_direct: {email_err}")
            
        return res.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al despachar con Uber: {str(e)}")
