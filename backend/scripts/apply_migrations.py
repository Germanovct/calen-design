import os
import sys
from dotenv import load_dotenv

# Obtener ruta absoluta del directorio backend
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(backend_dir, ".env")

# Cargar variables de entorno
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("\n[!] ERROR: La variable DATABASE_URL no está definida en backend/.env")
    print("Por favor, crea el archivo backend/.env (copiando .env.example) e ingresa la conexión de Postgres de Supabase:")
    print("Ejemplo: DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres")
    sys.exit(1)

try:
    import psycopg2
except ImportError:
    print("\n[*] Instalando psycopg2-binary para la conexión a PostgreSQL...")
    import subprocess
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "psycopg2-binary"])
        import psycopg2
        print("[*] psycopg2-binary instalado correctamente.")
    except Exception as err:
        print(f"[!] Falló la instalación automática de psycopg2-binary: {err}")
        print("Por favor, instálalo manualmente ejecutando: pip install psycopg2-binary")
        sys.exit(1)

print("\n[*] Conectando a la base de datos PostgreSQL de Supabase...")
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Leer el archivo SQL de migración
    sql_file_path = os.path.join(backend_dir, "supabase_schema.sql")
    print(f"[*] Leyendo archivo de migración: {sql_file_path}")
    with open(sql_file_path, "r", encoding="utf-8") as f:
        sql_content = f.read()
        
    print("[*] Ejecutando sentencias SQL (Tablas, RLS, Categorías y Bucket)...")
    cursor.execute(sql_content)
    print("\n[+] ÉXITO: ¡Migraciones de Supabase aplicadas correctamente!")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"\n[!] ERROR al aplicar las migraciones: {e}")
    sys.exit(1)
