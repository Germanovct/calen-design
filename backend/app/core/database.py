from supabase import create_client, Client, ClientOptions
from app.core.config import settings

supabase_url = settings.SUPABASE_URL
supabase_key = settings.SUPABASE_KEY

# Inicializar cliente de Supabase con el schema "calen" por defecto
supabase: Client = None
if supabase_url and supabase_key:
    options = ClientOptions(schema="calen")
    supabase = create_client(supabase_url, supabase_key, options=options)

def get_db() -> Client:
    """
    Retorna la instancia del cliente Supabase configurado para el schema 'calen'.
    """
    return supabase
