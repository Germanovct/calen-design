from fastapi import Request, HTTPException, Depends, status
from app.core.security import decode_access_token

def get_current_user(request: Request) -> dict:
    """
    Dependencia para obtener el usuario autenticado a partir del token JWT.
    Busca primero en las cookies (para httpOnly cookies) y luego en el header Authorization.
    """
    token = request.cookies.get("access_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado. Inicie sesión para acceder."
        )
        
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sesión expirada o token inválido."
        )
        
    return payload

def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Dependencia para requerir permisos de administrador.
    """
    role = current_user.get("role", "user")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requiere rol de administrador."
        )
    return current_user
