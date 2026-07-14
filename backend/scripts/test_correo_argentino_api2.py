import sys
import os

# Configurar el path para poder importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.routers.shipping import parse_street_address, get_correo_argentino_headers
from app.core.config import settings

def main():
    print("=== TESTING CORREO ARGENTINO API 2.0 INTEGRATION ===")

    # 1. Test Address Parser
    print("\n[*] Testing parse_street_address helper...")
    
    test_addresses = [
        ("Av. Santa Fe 3400 Piso 5B", "Av. Santa Fe", "3400", "Piso 5B"),
        ("Callao 120", "Callao", "120", ""),
        ("San Martin 450 3 D", "San Martin", "450", "3 D"),
        ("Justo Jose de Urquiza 2341", "Justo Jose de Urquiza", "2341", ""),
        ("Calle Falsa Sin Numero", "Calle Falsa Sin Numero", "S/N", "")
    ]
    
    for full_addr, expected_street, expected_num, expected_extra in test_addresses:
        street, num, extra = parse_street_address(full_addr)
        print(f"  - Input: '{full_addr}' -> Street: '{street}', Num: '{num}', Extra: '{extra}'")
        assert street == expected_street, f"Expected street '{expected_street}', got '{street}'"
        assert num == expected_num, f"Expected num '{expected_num}', got '{num}'"
        assert extra == expected_extra, f"Expected extra '{expected_extra}', got '{extra}'"
        
    print("[+] parse_street_address verified successfully!")

    # 2. Test headers structure
    print("\n[*] Testing get_correo_argentino_headers helper...")
    # Mock settings values
    settings.CORREO_ARGENTINO_PASSWORD = "test-apikey-key"
    settings.CORREO_ARGENTINO_CUSTOMER_ID = "18017"
    
    headers = get_correo_argentino_headers()
    print("  - Generated headers:", headers)
    
    assert headers is not None, "Headers should not be None"
    assert headers.get("Authorization") == "Apikey test-apikey-key", "Authorization header mismatch"
    assert headers.get("agreement") == "18017", "Agreement header mismatch"
    
    print("[+] get_correo_argentino_headers verified successfully!")
    print("\n=== ALL API 2.0 INTEGRATION UNIT TESTS PASSED ===")

if __name__ == "__main__":
    main()
