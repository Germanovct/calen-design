import sys
import os

# Configurar el path para poder importar módulos de la app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import supabase_admin as db

def main():
    if not db:
        print("[!] Error: Supabase Admin client not initialized. Check your env secrets.")
        sys.exit(1)

    email = "germanovct@gmail.com"
    password = "adminpasscalen" # Una contraseña segura preestablecida para evitar colisiones
    
    print(f"[*] Registrando usuario administrador '{email}' en Supabase Auth...")
    
    try:
        # Intentar crear el usuario administrador directamente en Supabase Auth
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
            print(f"[+] Usuario Creado Exitosamente!")
            print(f"  - Email: {email}")
            print(f"  - Password: {password}")
            print(f"  - Rol: admin")
        else:
            print("[!] Error al crear el usuario en Supabase Auth.")
    except Exception as e:
        error_msg = str(e)
        if "already exists" in error_msg.lower() or "already registered" in error_msg.lower():
            print(f"[~] El usuario '{email}' ya existe. Intentando resetear su contraseña a '{password}'...")
            try:
                # Si el usuario ya existe, actualizar contraseña mediante admin API
                # Primero buscamos al usuario por email para conseguir su ID
                users_list = db.auth.admin.list_users()
                target_user = None
                for u in users_list:
                    if u.email == email:
                        target_user = u
                        break
                
                if target_user:
                    db.auth.admin.update_user_by_id(
                        target_user.id,
                        {
                            "password": password,
                            "user_metadata": {
                                "name": "Germán Admin",
                                "phone": "+541155554444",
                                "address": "Av. Santa Fe 3400",
                                "role": "admin"
                            }
                        }
                    )
                    print(f"[+] Contraseña de '{email}' reseteada con éxito a '{password}'!")
                else:
                    print("[!] No se encontró el usuario en el listado para actualizar contraseña.")
            except Exception as reset_err:
                print(f"[!] Fallo al actualizar la contraseña del usuario existente: {reset_err}")
        else:
            print(f"[!] Excepción creando usuario admin: {error_msg}")

if __name__ == "__main__":
    main()
