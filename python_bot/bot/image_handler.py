import os
import uuid
import time
import requests
import urllib.parse
from google import genai
from google.genai import types
from supabase import create_client, Client
from .key_manager import get_next_api_key
from .logger import log_info
from .state import GLOBAL_STOP_EVENT

def upload_to_supabase(image_bytes: bytes, file_name: str) -> str:
    """Uploads binary image stream to Supabase Storage and enforces public URL returning."""
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        log_info("[Image AI] Supabase credentials missing. Cannot deploy image to bucket.")
        return ""
    
    try:
        supabase_client: Client = create_client(supabase_url, supabase_key)
        bucket_name = "articles"
        
        # Push file to storage securely bypassing 401s
        res = supabase_client.storage.from_(bucket_name).upload(
            path=file_name,
            file=image_bytes,
            file_options={"content-type": "image/jpeg", "upsert": "true"}
        )
        
        # Request immediate public URL mapping from CDNs
        public_url = supabase_client.storage.from_(bucket_name).get_public_url(file_name)
        return public_url
    except Exception as e:
        log_info(f"[Image AI] Deep Cloud injection failed targeting Supabase Storage: {e}")
        return ""

def generate_flux_image(prompt: str) -> str:
    """Generates an image via HuggingFace Inference API utilizing Flux.1."""
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token:
        log_info("[Image AI] CRITICAL: 'HF_TOKEN' missing from .env. Images cannot be generated without an HF Token.")
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80" # Temporary safe placeholder

    API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "width": 1024,
            "height": 576 # Cinematic 16:9 bounds for Tech magazine layout
        }
    }
    
    try:
        log_info(f"[Image AI] Synthesizing asset natively via Hugging Face Flux...")
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        
        # Cold boot defense algorithm (Hugging face proxy models sleep if inactive)
        if response.status_code == 503 and "estimated_time" in response.text:
            try:
                delay = float(response.json().get("estimated_time", 15.0))
                log_info(f"[Image AI] Deep model is currently booting on cloud hardware. Reserving compute for {delay:.1f}s...")
                time.sleep(min(delay, 25)) # Lock upper limit to 25s latency protection
                
                # Retry prompt
                response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
            except Exception as e:
                log_info(f"[Image AI] Model wakeup cycle timed out: {e}")

        # Final extraction
        if response.status_code == 200:
            image_bytes = response.content
            file_name = f"hero_{uuid.uuid4().hex}.jpg"
            log_info(f"[Image AI] Successfully generated authentic asset ({len(image_bytes)} bytes). Deploying to Supabase...")
            
            public_url = upload_to_supabase(image_bytes, file_name)
            
            if public_url:
                log_info(f"[Image AI] Media successfully bridged onto local edge network: {public_url}")
                return public_url
            else:
                log_info("[Image AI] Supabase injection faulted, resulting in blank proxy mapping.")
        else:
            log_info(f"[Image AI] HuggingFace API declined query: {response.text}")

    except Exception as e:
        log_info(f"[Image AI] FATAL: HuggingFace rendering sequence terminated unexpectedly: {e}")

    return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"

def analyze_and_generate_image(original_url: str, article_title: str) -> str:
    """Downloads original image, streams prompt through Gemini Vision, and renders Flux natively."""
    try:
        # 1. Download original image buffer
        image_bytes = None
        content_type = 'image/jpeg'

        if original_url and original_url.startswith('http'):
            try:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                response = requests.get(original_url, headers=headers, timeout=10)
                response.raise_for_status()
                
                content_type = response.headers.get('content-type', '')
                if not content_type.startswith('image/'):
                    content_type = 'image/jpeg'
                    
                image_bytes = response.content
            except Exception as e:
                log_info(f"[Image AI] Bounding box failure downloading original image {original_url}: {e}")
        
        # 2. Extract AI visual prompt logic via Gemini 2.5 Flash setup
        max_retries = 8
        attempt = 0
        prompt_text = f"Analyze the article title: '{article_title}'. Write a highly detailed, professional English prompt (max 500 chars) that can be used in an AI image generator to create a highly modern, professional, 16:9 4k photographic style suitable for a tech magazine cover. Return ONLY the English prompt string, absolutely no other text."
        
        if image_bytes:
            prompt_text = f"Analyze this image and the article title: '{article_title}'. Write a highly detailed, professional English prompt (max 500 chars) that can be used in an AI image generator to completely recreate this image in a highly modern, professional, 16:9 4k photographic style suitable for a tech magazine cover. Return ONLY the English prompt string, absolutely no other text."
        
        generated_prompt = f"A highly professional, modern 16:9 4k tech magazine cover illustration for {article_title}."
        
        while attempt < max_retries:
            if GLOBAL_STOP_EVENT.is_set(): return original_url
            
            api_key = get_next_api_key()
            if not api_key: break
            
            try:
                client = genai.Client(api_key=api_key)
                contents = []
                if image_bytes:
                    contents.append(types.Part.from_bytes(data=image_bytes, mime_type=content_type))
                contents.append(prompt_text)
                
                resp = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=contents
                )
                
                if resp and resp.text:
                    generated_prompt = resp.text.strip().replace('\n', ' ')
                    log_info(f"[Image AI] Synthesized visual prompt parameter mapped.")
                    break
                    
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    attempt = attempt + 1
                    continue
                else:
                    log_info(f"[Image AI] Gemini prompt parsing aborted: {e}")
                    break
                    
        # 3. Stream generated prompt text back into Hugging Face for authentic rendering
        return generate_flux_image(generated_prompt)
        
    except Exception as e:
        log_info(f"[Image AI] Failed to bridge image generation node loop: {e}.")
        return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"

def process_article_image(original_url: str, article_title: str) -> str:
    log_info(f"[Image Handler] Fetching and modeling original visual frame: {original_url}")
    return analyze_and_generate_image(original_url, article_title)
