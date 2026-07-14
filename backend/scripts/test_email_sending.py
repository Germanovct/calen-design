import sys
import os
import asyncio

# Configurar el path para poder importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.email import (
    send_transactional_email,
    get_order_created_template,
    get_payment_approved_template,
    get_order_shipped_template,
    get_order_delivered_template,
    get_order_cancelled_template
)

# Datos de prueba para simular una orden
mock_order = {
    "id": "abc123e4-567f-89ab-cdef-0123456789ab",
    "total": 12400.0,
    "shipping_address": {
        "name": "Valentina García",
        "email": "valentina@garcia.com",
        "address": "Av. Santa Fe 3400, Piso 5B",
        "city": "CABA",
        "zip_code": "1425",
        "phone": "+54 9 11 5555 4444",
        "shipping_cost": 1500.0
    },
    "detailed_items": [
        {
            "product_name": "Remera Oversized Heavyweight",
            "size": "M",
            "color": "Negro",
            "quantity": 2,
            "unit_price": 4900.0
        },
        {
            "product_name": "Buzo Crop Editorial",
            "size": "S",
            "color": "Gris",
            "quantity": 1,
            "unit_price": 2600.0
        }
    ]
}

async def run_tests():
    print("=== TESTING TRANSACTIONAL EMAIL TEMPLATES ===")
    
    # 1. Test Order Created
    print("\n[*] Generating Order Created email...")
    created_html = get_order_created_template(mock_order)
    assert "Confirmación de Compra" in created_html
    assert "Av. Santa Fe 3400" in created_html
    assert "Buzo Crop Editorial" in created_html
    print("[+] Order Created template generated successfully!")

    # 2. Test Payment Approved
    print("\n[*] Generating Payment Approved email...")
    approved_html = get_payment_approved_template(mock_order)
    assert "Pago Aprobado" in approved_html
    print("[+] Payment Approved template generated successfully!")

    # 3. Test Order Shipped
    print("\n[*] Generating Order Shipped email...")
    shipped_html = get_order_shipped_template(mock_order, "Correo Argentino", "CP123456789AR")
    assert "Pedido Despachado" in shipped_html
    assert "CP123456789AR" in shipped_html
    print("[+] Order Shipped template generated successfully!")

    # 4. Test Order Delivered
    print("\n[*] Generating Order Delivered email...")
    delivered_html = get_order_delivered_template(mock_order)
    assert "Pedido Entregado" in delivered_html
    print("[+] Order Delivered template generated successfully!")

    # 5. Test Order Cancelled
    print("\n[*] Generating Order Cancelled email...")
    cancelled_html = get_order_cancelled_template(mock_order)
    assert "Pedido Cancelado" in cancelled_html
    print("[+] Order Cancelled template generated successfully!")

    # 6. Test Email sending (Mock Mode)
    print("\n[*] Running mock email dispatch test...")
    success = await send_transactional_email(
        to_email=mock_order["shipping_address"]["email"],
        subject="Test de Compra - Calen Design",
        html_content=created_html
    )
    if success:
        print("[+] Mock email transmission test PASSED!")
    else:
        print("[!] Mock email transmission test FAILED!")

if __name__ == "__main__":
    asyncio.run(run_tests())
