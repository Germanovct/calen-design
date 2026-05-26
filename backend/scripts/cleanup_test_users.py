import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(dotenv_path="backend/.env")

url = os.getenv("SUPABASE_URL")
secret_key = os.getenv("SUPABASE_SECRET_KEY")

if url and secret_key:
    try:
        supabase_admin = create_client(url, secret_key)
        users = supabase_admin.auth.admin.list_users()
        print(f"Current users in DB: {len(users)}")
        for u in users:
            if u.email and u.email.startswith("test_user_"):
                print(f"Deleting test user: {u.email} (ID: {u.id})...")
                supabase_admin.auth.admin.delete_user(u.id)
                print("Deleted.")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Missing credentials")
