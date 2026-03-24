import os
from supabase import create_client, Client
from dotenv import load_dotenv
from .logger import log_info

# Try to load .env from the parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

def get_supabase_client() -> Client:
    """
    Initializes and returns the Supabase client using the SERVICE ROLE key.
    This grants the Python bot FULL admin privileges to bypass RLS policies
    for autonomous background tasks (like inserting/updating articles).
    """
    url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if not url or not key:
        log_info("[Nerve Center | DB Adapter] FATAL ERROR: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing from .env")
        raise Exception("Supabase credentials missing.")
        
    log_info("[Nerve Center | DB Adapter] Authenticating with Supabase Production Database using Service Role (Admin)...")
    return create_client(url, key)

if __name__ == "__main__":
    # Test connection
    try:
        supabase = get_supabase_client()
        res = supabase.table("articles").select("count").execute()
        print(f"[SUCCESS] Connected to Supabase. Articles count response: {res}")
    except Exception as e:
        print(f"[FAIL] Connection error: {e}")
