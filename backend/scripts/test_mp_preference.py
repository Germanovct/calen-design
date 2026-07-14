import httpx
import asyncio
import sys
import os

# Configurar path para importar config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.core.config import settings

async def test_mp():
    token = settings.MP_ACCESS_TOKEN
    print(f"[*] Probando token de Mercado Pago: {token[:12]}... (largo: {len(token)})")
    
    if not token or token == "your_mercadopago_access_token":
        print("[!] Error: No hay un token cargado en .env.")
        return

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "items": [
            {
                "title": "Prenda Calen Design - Producto de Test",
                "quantity": 1,
                "unit_price": 500.0,
                "currency_id": "ARS"
            }
        ],
        "back_urls": {
            "success": "http://localhost:5173/checkout/success",
            "failure": "http://localhost:5173/checkout/failure",
            "pending": "http://localhost:5173/checkout/pending"
        },
        "external_reference": "test_integration_ref"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.mercadopago.com/checkout/preferences",
                json=payload,
                headers=headers,
                timeout=10.0
            )
            
        print(f"[*] Código de respuesta de Mercado Pago: {res.status_code}")
        if res.status_code in [200, 201]:
            data = res.json()
            print("[+] Integración de Mercado Pago OK!")
            print(f"  - Preference ID: {data.get('id')}")
            print(f"  - Init Point: {data.get('init_point')}")
            print(f"  - Sandbox Init Point: {data.get('sandbox_init_point')}")
        else:
            print(f"[!] Error al comunicarse con Mercado Pago: {res.text}")
    except Exception as e:
        print(f"[!] Excepción: {e}")

if __name__ == "__main__":
    asyncio.run(test_mp())
