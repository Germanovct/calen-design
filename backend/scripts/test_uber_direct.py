import sys
import os
import asyncio
from fastapi import BackgroundTasks

# Configurar el path para poder importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.routers.shipping import get_shipping_quote, is_caba_gba
from app.schemas.shipping import ShippingQuoteRequest

class MockDB:
    class Table:
        def __init__(self, name):
            self.name = name
        def select(self, *args, **kwargs):
            return self
        def eq(self, *args, **kwargs):
            return self
        def execute(self):
            # Retorna datos simulados de orden
            if self.name == "orders":
                return type('Res', (), {'data': [{
                    "id": "mock_order_id",
                    "status": "approved",
                    "total": 5000.0,
                    "shipping_address": {
                        "name": "Pedro Uber",
                        "email": "pedro@uber.com",
                        "address": "Av. Corrientes 1000",
                        "city": "CABA",
                        "zip_code": "1000",
                        "phone": "+541155554444"
                    }
                }]})()
            elif self.name == "shipping_labels":
                return type('Res', (), {'data': []})()
        def insert(self, *args, **kwargs):
            return self
        def update(self, *args, **kwargs):
            return self

    def table(self, name):
        return self.Table(name)

async def run_tests():
    print("=== TESTING UBER DIRECT & DYNAMIC SHIPPING QUOTES ===")

    # 1. Test is_caba_gba zip code helper
    print("\n[*] Testing CABA/GBA zip code helper...")
    assert is_caba_gba("1425") is True, "1425 should be CABA/GBA"
    assert is_caba_gba("1000") is True, "1000 should be CABA/GBA"
    assert is_caba_gba("1900") is False, "1900 should NOT be CABA/GBA"
    assert is_caba_gba("5000") is False, "5000 should NOT be CABA/GBA"
    print("[+] Zip code helper verified successfully!")

    # 2. Test Quote for CABA (Should return Uber Direct)
    print("\n[*] Requesting shipping quotes for CABA CP: 1425...")
    req_caba = ShippingQuoteRequest(
        cp_destino="1425",
        peso_gr=800,
        largo_cm=20,
        ancho_cm=15,
        alto_cm=10
    )
    quotes_caba = await get_shipping_quote(req_caba, db=MockDB())
    print(f"[+] Returned {len(quotes_caba)} options for CABA:")
    for q in quotes_caba:
        print(f"  - {q.modalidad}: ${q.precio} ({q.dias_estimados} days/hours)")
    
    assert any("Uber" in q.modalidad or "Express" in q.modalidad for q in quotes_caba), "Uber Direct should be offered in CABA"

    # 3. Test Quote for Córdoba (Should NOT return Uber Direct)
    print("\n[*] Requesting shipping quotes for Córdoba CP: 5000...")
    req_cba = ShippingQuoteRequest(
        cp_destino="5000",
        peso_gr=800,
        largo_cm=20,
        ancho_cm=15,
        alto_cm=10
    )
    quotes_cba = await get_shipping_quote(req_cba, db=MockDB())
    print(f"[+] Returned {len(quotes_cba)} options for Córdoba:")
    for q in quotes_cba:
        print(f"  - {q.modalidad}: ${q.precio} ({q.dias_estimados} days)")

    assert not any("Uber" in q.modalidad or "Express" in q.modalidad for q in quotes_cba), "Uber Direct should NOT be offered in Córdoba"
    
    print("\n=== ALL SHIPPING INTEGRATION TESTS PASSED ===")

if __name__ == "__main__":
    asyncio.run(run_tests())
