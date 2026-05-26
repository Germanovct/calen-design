import os
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

load_dotenv(dotenv_path="backend/.env")

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")

print(f"URL: {url}")
print(f"Secret Key: {key}")

if url and key:
    try:
        options = ClientOptions(schema="calen")
        supabase = create_client(url, key, options=options)
        res = supabase.table("categories").select("*").execute()
        print("Success! Data:")
        print(res.data)
    except Exception as e:
        print(f"Error querying database: {e}")
else:
    print("Missing credentials")
