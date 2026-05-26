from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.schemas.auth import UserRegister, UserLogin, UserResponse
from app.core.database import get_db
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from supabase import Client

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    try:
        # Registrar el usuario en Supabase Auth
        signup_options = {
            "data": {
                "name": user_data.name,
                "phone": user_data.phone,
                "address": user_data.address,
                "role": "user" # Rol por defecto
            }
        }
        res = db.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": signup_options
        })
        
        if not res.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registro fallido. El usuario podría ya existir o los datos son inválidos."
            )
            
        return UserResponse(
            id=res.user.id,
            email=res.user.email,
            name=user_data.name,
            phone=user_data.phone,
            address=user_data.address,
            role="user"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error en registro: {str(e)}"
        )

@router.post("/login")
def login(login_data: UserLogin, response: Response, db: Client = Depends(get_db)):
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    try:
        # Autenticar en Supabase Auth
        res = db.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        
        if not res.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas."
            )
            
        user_meta = res.user.user_metadata or {}
        role = user_meta.get("role", "user")
        
        # Admin override para el correo de la agencia / owner
        if res.user.email in ["germanovct@gmail.com"]:
            role = "admin"
            
        # Generar token JWT RS256 propio
        token_payload = {
            "id": res.user.id,
            "sub": res.user.id,
            "email": res.user.email,
            "role": role,
            "name": user_meta.get("name"),
            "phone": user_meta.get("phone"),
            "address": user_meta.get("address")
        }
        
        access_token = create_access_token(token_payload)
        
        # Establecer la cookie httpOnly para máxima seguridad
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False, # Cambiar a True en producción con SSL
            samesite="lax",
            max_age=86400 # 24 horas
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": res.user.id,
                "email": res.user.email,
                "name": user_meta.get("name"),
                "phone": user_meta.get("phone"),
                "address": user_meta.get("address"),
                "role": role
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Credenciales incorrectas: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user.get("id"),
        email=current_user.get("email"),
        name=current_user.get("name"),
        phone=current_user.get("phone"),
        address=current_user.get("address"),
        role=current_user.get("role", "user")
    )
