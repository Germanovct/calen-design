from supabase import create_client, Client
from app.core.config import settings

supabase_url = settings.SUPABASE_URL
supabase_key = settings.SUPABASE_KEY

# Inicializar cliente de Supabase
supabase: Client = None
if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)

def get_db() -> Client:
    """
    Retorna la instancia del cliente Supabase configurado.
    """
    return supabase
