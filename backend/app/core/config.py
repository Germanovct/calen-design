import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY", "")
    MP_ACCESS_TOKEN: str = os.getenv("MP_ACCESS_TOKEN", "")
    MP_WEBHOOK_SECRET: str = os.getenv("MP_WEBHOOK_SECRET", "")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "Calen Design <onboarding@resend.dev>")
    
    # Correo Argentino API config
    CORREO_ARGENTINO_URL: str = os.getenv("CORREO_ARGENTINO_URL", "https://apitest.correoargentino.com.ar/micorreo/v1")
    CORREO_ARGENTINO_USER: str = os.getenv("CORREO_ARGENTINO_USER", "")
    CORREO_ARGENTINO_PASSWORD: str = os.getenv("CORREO_ARGENTINO_PASSWORD", "")
    CORREO_ARGENTINO_CUSTOMER_ID: str = os.getenv("CORREO_ARGENTINO_CUSTOMER_ID", "")
    CP_ORIGEN: str = os.getenv("CP_ORIGEN", "1000") # CP del depósito de Calen Design por defecto
    
    # Manejar posibles saltos de línea codificados como \n en las claves RSA del archivo .env
    JWT_PRIVATE_KEY: str = os.getenv("JWT_PRIVATE_KEY", "").replace("\\n", "\n")
    JWT_PUBLIC_KEY: str = os.getenv("JWT_PUBLIC_KEY", "").replace("\\n", "\n")

settings = Settings()
