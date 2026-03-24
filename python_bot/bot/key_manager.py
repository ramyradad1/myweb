import os
import json
import base64
from Crypto.Cipher import AES
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env.local")
load_dotenv(env_path)

decrypted_keys = None
current_index = 0

def decrypt(encrypted_str: str, secret_hex: str) -> str:
    parts = encrypted_str.split(':')
    if len(parts) != 3:
        raise ValueError("Invalid encrypted string format. Expected iv:authTag:ciphertext")
        
    iv_hex, auth_tag_hex, ciphertext_hex = parts

    key = bytes.fromhex(secret_hex)
    iv = bytes.fromhex(iv_hex)
    auth_tag = bytes.fromhex(auth_tag_hex)
    ciphertext = bytes.fromhex(ciphertext_hex)

    cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
    decrypted = cipher.decrypt_and_verify(ciphertext, auth_tag)
    
    return decrypted.decode('utf-8')

DEFAULT_API_KEYS = [
    "AIzaSyBfEzZIWSPv-MlZz0rPD_fmtYI6Wp-0EvQ",
    "AIzaSyDsl7gkK_KZqG9mQMJid5No4-jHezya1RM",
    "AIzaSyAQRHS57fgyVFUBTZtB-UzeOurM6RJaImw",
    "AIzaSyDb9pzkKkme8GOINyB-MyOIAyQg9AzbKcw",
    "AIzaSyAjrqDlWaEYYh7L3CyYLKNI0FQWPIv1sVo",
    "AIzaSyCK5aGbuJiATTIx0N8b7O0gbMedKeLvhgY",
    "AIzaSyBp5L12HgUkimutOCbryjVlUxBAxmMB3Zs",
    "AIzaSyA-HotvV6FUepPC-uqnqlYbfiIg2ApvXnA"
]

def load_keys() -> list[str]:
    global decrypted_keys
    if decrypted_keys is not None:
        return decrypted_keys

    # Priority 1: Check environment comma-separated array
    env_keys = os.getenv('GEMINI_API_KEYS')
    if env_keys:
        decrypted_keys = [k.strip() for k in env_keys.split(',') if k.strip()]
        return decrypted_keys
        
    # Priority 2: Use provided defaults
    decrypted_keys = DEFAULT_API_KEYS
    print(f"[KeyManager] [SUCCESS] Successfully loaded {len(decrypted_keys)} API keys for rotation.")
    return decrypted_keys

def get_next_api_key() -> str:
    global current_index
    keys = load_keys()
    key = keys[current_index]
    current_index = (current_index + 1) % len(keys)
    return key

def get_key_count() -> int:
    return len(load_keys())

def reset_rotation() -> None:
    global current_index
    current_index = 0
