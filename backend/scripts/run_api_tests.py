import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import MagicMock

# Ajustar PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.database import get_db, get_admin_db
from app.core.dependencies import get_current_user

# Crear un cliente de prueba
client = TestClient(app)

def test_health_check():
    print("[*] Testing health check root endpoint...")
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    print("[+] Health check OK!")

def test_products_list_mocked():
    print("[*] Testing GET /api/products with mocked DB...")
    
    # Mockear la respuesta del cliente de Supabase
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_res = MagicMock()
    
    mock_res.data = [
        {
            "id": "prod-123",
            "name": "Remera Classic",
            "description": "Una remera clásica de Calen",
            "category_id": "cat-123",
            "price": 4500.00,
            "images": ["image1.jpg"],
            "active": True,
            "created_at": "2026-05-26T12:00:00Z",
            "variants": [
                {
                    "id": "var-123",
                    "product_id": "prod-123",
                    "size": "M",
                    "color": "Negro",
                    "stock": 10,
                    "created_at": "2026-05-26T12:00:00Z"
                }
            ]
        }
    ]
    
    # Configurar el encadenamiento de llamadas en el mock
    mock_db.table.return_value = mock_query
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.execute.return_value = mock_res
    
    # Inyectar el mock de DB en la app
    app.dependency_overrides[get_db] = lambda: mock_db
    
    response = client.get("/api/products")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Remera Classic"
    assert data[0]["variants"][0]["size"] == "M"
    print("[+] Products listing with mock DB OK!")
    
    # Limpiar overrides
    app.dependency_overrides.clear()

def test_auth_login_invalid():
    print("[*] Testing POST /api/auth/login with invalid credentials...")
    
    # Mockear cliente Supabase para fallar en login
    mock_db = MagicMock()
    mock_db.auth.sign_in_with_password.side_effect = Exception("Invalid credentials")
    
    app.dependency_overrides[get_db] = lambda: mock_db
    
    payload = {"email": "invalid@test.com", "password": "wrongpassword"}
    response = client.post("/api/auth/login", json=payload)
    
    # Debe retornar 401 Unauthorized
    assert response.status_code == 401
    assert "incorrectas" in response.json()["detail"]
    print("[+] Auth invalid login response OK!")
    
    app.dependency_overrides.clear()

def test_shipping_label_mocked():
    print("[*] Testing GET /api/shipping/{id}/shipping with mocked DB...")
    
    mock_db = MagicMock()
    mock_query = MagicMock()
    
    mock_db.table.return_value = mock_query
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    
    # Respuesta para la primera consulta (Orden)
    mock_order_res = MagicMock()
    mock_order_res.data = [{"user_id": "user-123"}]
    
    # Respuesta para la segunda consulta (Etiqueta de envío)
    mock_label_res = MagicMock()
    mock_label_res.data = [{
        "id": "label-123",
        "order_id": "order-123",
        "carrier": "Andreani",
        "tracking_number": "TRK123456",
        "label_url": "http://label.pdf",
        "created_at": "2026-05-26T12:00:00Z"
    }]
    
    # Mockear los execute consecutivos
    mock_query.execute.side_effect = [mock_order_res, mock_label_res]
    
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-123", "role": "user"}
    
    response = client.get("/api/shipping/order-123/shipping")
    assert response.status_code == 200
    assert response.json()["carrier"] == "Andreani"
    assert response.json()["tracking_number"] == "TRK123456"
    print("[+] Shipping label details OK!")
    
    app.dependency_overrides.clear()

def test_users_list_admin_mocked():
    print("[*] Testing GET /api/auth/users with different roles...")
    
    # 1. Sin autenticar (Anónimo)
    # get_current_user alzará HTTPException 401 si no hay token, lo mockeamos para fallar
    def mock_get_current_user_anonymous():
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    app.dependency_overrides[get_current_user] = mock_get_current_user_anonymous
    response = client.get("/api/auth/users")
    assert response.status_code == 401
    
    # 2. Con rol user (Acceso denegado)
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-123", "role": "user"}
    response = client.get("/api/auth/users")
    assert response.status_code == 403
    
    # 3. Con rol admin (Exitoso)
    app.dependency_overrides[get_current_user] = lambda: {"id": "admin-123", "role": "admin"}
    
    mock_admin_db = MagicMock()
    mock_user_1 = MagicMock()
    mock_user_1.id = "usr-1"
    mock_user_1.email = "cliente1@example.com"
    mock_user_1.created_at = "2026-05-26T12:00:00Z"
    mock_user_1.user_metadata = {"name": "Cliente Uno", "phone": "112233", "address": "Direccion 1", "role": "user"}
    
    mock_admin_db.auth.admin.list_users.return_value = [mock_user_1]
    app.dependency_overrides[get_admin_db] = lambda: mock_admin_db
    
    response = client.get("/api/auth/users")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["email"] == "cliente1@example.com"
    assert data[0]["name"] == "Cliente Uno"
    assert data[0]["role"] == "user"
    print("[+] Admin users listing OK!")
    
    app.dependency_overrides.clear()

def test_shipping_quote_mocked():
    print("[*] Testing POST /api/shipping/quote...")
    payload = {
        "cp_destino": "1704",
        "peso_gr": 1500,
        "largo_cm": 20,
        "ancho_cm": 15,
        "alto_cm": 10
    }
    response = client.post("/api/shipping/quote", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["modalidad"] == "Encomienda Clásica"
    assert data[1]["modalidad"] == "Encomienda Prioridad"
    assert data[0]["precio"] > 0
    print("[+] Shipping quote OK!")

def test_shipping_label_generation_mocked():
    print("[*] Testing POST /api/shipping/orders/{id}/shipping/label...")
    
    mock_db = MagicMock()
    mock_query = MagicMock()
    
    mock_db.table.return_value = mock_query
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    mock_query.insert.return_value = mock_query
    mock_query.update.return_value = mock_query
    
    mock_order_res = MagicMock()
    mock_order_res.data = [{"id": "ord-123", "status": "pending", "shipping_address": {"name": "Test"}}]
    
    mock_label_check_res = MagicMock()
    mock_label_check_res.data = []
    
    mock_insert_res = MagicMock()
    mock_insert_res.data = [{
        "id": "label-123",
        "order_id": "ord-123",
        "carrier": "correo_argentino",
        "tracking_number": "CP123456789AR",
        "label_url": "http://label.pdf",
        "created_at": "2026-05-26T12:00:00Z"
    }]
    
    mock_query.execute.side_effect = [mock_order_res, mock_label_check_res, mock_insert_res, MagicMock()]
    
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: {"id": "admin-123", "role": "admin"}
    
    payload = {"carrier": "correo_argentino"}
    response = client.post("/api/shipping/orders/ord-123/shipping/label", json=payload)
    assert response.status_code == 201
    assert response.json()["tracking_number"].startswith("CP")
    print("[+] Shipping label generation OK!")
    
    app.dependency_overrides.clear()

def test_shipping_tracking_mocked():
    print("[*] Testing GET /api/shipping/track/{tracking_number}...")
    
    mock_db = MagicMock()
    mock_query = MagicMock()
    
    mock_db.table.return_value = mock_query
    mock_query.select.return_value = mock_query
    mock_query.eq.return_value = mock_query
    
    mock_label_res = MagicMock()
    mock_label_res.data = [{"order_id": "ord-123", "carrier": "correo_argentino"}]
    
    mock_order_res = MagicMock()
    mock_order_res.data = [{"user_id": "user-123", "status": "shipped"}]
    
    mock_query.execute.side_effect = [mock_label_res, mock_order_res]
    
    app.dependency_overrides[get_db] = lambda: mock_db
    app.dependency_overrides[get_current_user] = lambda: {"id": "user-123", "role": "user"}
    
    response = client.get("/api/shipping/track/CP123456789AR")
    assert response.status_code == 200
    data = response.json()
    assert data["tracking_number"] == "CP123456789AR"
    assert data["status"] == "shipped"
    assert len(data["history"]) > 1
    print("[+] Shipping tracking status history OK!")
    
    app.dependency_overrides.clear()

if __name__ == "__main__":
    print("=== STARTING FASTAPI ROUTER TESTS ===")
    try:
        test_health_check()
        test_products_list_mocked()
        test_auth_login_invalid()
        test_shipping_label_mocked()
        test_users_list_admin_mocked()
        test_shipping_quote_mocked()
        test_shipping_label_generation_mocked()
        test_shipping_tracking_mocked()
        print("=== ALL TESTS PASSED SUCCESSFULLY ===")
        sys.exit(0)
    except AssertionError as e:
        print(f"[!] TEST FAILED: Assertion error")
        sys.exit(1)
    except Exception as e:
        print(f"[!] TEST FAILED with exception: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
