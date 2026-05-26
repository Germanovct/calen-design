from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from app.core.config import settings
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 horas

# Claves en memoria en caso de que falten en el archivo .env
_temp_private_key = ""
_temp_public_key = ""

def _get_keys():
    global _temp_private_key, _temp_public_key
    
    # Si están configuradas en settings, usarlas
    priv_key = settings.JWT_PRIVATE_KEY
    pub_key = settings.JWT_PUBLIC_KEY
    
    # Si falta la clave privada, generar un par en memoria temporal
    if not priv_key or "BEGIN RSA PRIVATE KEY" not in priv_key:
        if not _temp_private_key:
            print("[*] Generando claves RSA RS256 temporales en memoria para desarrollo...")
            private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            
            _temp_private_key = private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption()
            ).decode("utf-8")
            
            public_key = private_key.public_key()
            _temp_public_key = public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ).decode("utf-8")
        
        priv_key = _temp_private_key
        pub_key = _temp_public_key
        
    return priv_key, pub_key

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    private_key, _ = _get_keys()
    
    # Firmar con la clave privada
    encoded_jwt = jwt.encode(to_encode, private_key, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        _, public_key = _get_keys()
        # Verificar con la clave pública
        payload = jwt.decode(token, public_key, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
