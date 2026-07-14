import sys
import os

# Configurar el path para poder importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import supabase_admin as db

def main():
    if not db:
        print("[!] Error: Supabase Admin client not initialized.")
        sys.exit(1)

    email = "germanovct@gmail.com"
    password = "adminpasscalen"

    print(f"[*] Buscando usuario existente '{email}'...")
    try:
        users_resp = db.auth.admin.list_users()
        users_list = getattr(users_resp, 'users', users_resp)
        if not isinstance(users_list, list):
            # Fallback por si es otra estructura
            users_list = getattr(users_list, 'data', [])
        
        target_user_id = None
        for user in users_list:
            # En pydantic/supabase models, user puede ser dict o objeto
            u_email = getattr(user, 'email', None) or (user.get('email') if isinstance(user, dict) else None)
            if u_email == email:
                target_user_id = getattr(user, 'id', None) or (user.get('id') if isinstance(user, dict) else None)
                break
        
        if target_user_id:
            print(f"[~] Usuario encontrado con ID: {target_user_id}. Eliminando para recrear...")
            db.auth.admin.delete_user(target_user_id)
            print("[+] Usuario anterior eliminado con éxito.")
        else:
            print("[+] No se encontró usuario previo con este email.")

        # Crear el usuario administrador
        print(f"[*] Creando usuario administrador fresh...")
        res = db.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "name": "Germán Admin",
                "phone": "+541155554444",
                "address": "Av. Santa Fe 3400",
                "role": "admin"
            }
        })
        
        if res.user:
            print(f"\n[+] USUARIO ADMINISTRADOR CREADO:")
            print(f"  - Email: {email}")
            print(f"  - Contraseña: {password}")
            print(f"  - Rol: admin")
        else:
            print("[!] Error al crear el usuario.")
    except Exception as e:
        print(f"[!] Ocurrió un error en el proceso: {str(e)}")

if __name__ == "__main__":
    main()
