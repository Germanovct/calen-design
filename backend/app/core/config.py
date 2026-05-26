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
    
    # Manejar posibles saltos de línea codificados como \n en las claves RSA del archivo .env
    JWT_PRIVATE_KEY: str = os.getenv("JWT_PRIVATE_KEY", "").replace("\\n", "\n")
    JWT_PUBLIC_KEY: str = os.getenv("JWT_PUBLIC_KEY", "").replace("\\n", "\n")

settings = Settings()
