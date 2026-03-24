import json
from google import genai
from .key_manager import get_next_api_key
from .config import load_config
from .state import GLOBAL_STOP_EVENT
from .logger import log_info
from .seo_agent import load_dynamic_settings

def rewrite_article(original_title: str, original_html: str, 
                    tone: str = 'Professional, highly engaging, and indistinguishable from an expert human writer') -> dict | None:
    try:
        if GLOBAL_STOP_EVENT.is_set(): return None
        
        config = load_config()
        ai_model = config.get("ai_model", "Google Gemini 2.5 Flash")
        depth = int(config.get("editorial_depth", 50))
        translate = config.get("auto_translate", False)
        
        model_name = 'gemini-1.5-pro-latest' if '1.5 Pro' in ai_model else 'gemini-2.5-flash'
        
        depth_instructions = "Rewrite the article while closely matching the original length."
        if depth > 75:
            depth_instructions = "Deep Synthesis: Expand heavily on the concepts, add comprehensive context, and create a much longer, deeply analytical article."
        elif depth < 25:
            depth_instructions = "Light Aggregation: Summarize the article concisely. Keep it brief, directly to the point, and highly scannable."
            
        translate_instructions = "Rewrite completely in fluent, engaging **American English**."
        if translate:
            translate_instructions = "Rewrite and translate everything completely into fluent, engaging **Arabic** suitable for a modern tech magazine."
            
        settings = load_dynamic_settings()
        dynamic_rules = settings.get("dynamic_seo_rules", [])
        rules_text = ""
        if dynamic_rules:
            rules_text = "\nLATEST GOOGLE ALGORITHM RULES YOU MUST FOLLOW:\n"
            for i, rule in enumerate(dynamic_rules, 1):
                rules_text += f"{i}. {rule}\n"
            
        prompt = f"""
        You are a Senior Editor and highly professional SEO expert for a top-tier digital magazine (Technify).
        Your task is to take the following article (which might be in any language) and rewrite it.
        {translate_instructions}
        The new article must be 100% unique and not sound like a literal translation or cheap spun content.
        
        Original Article (Title): {original_title}
        Original Content (HTML):
        {original_html}

        Strict Instructions:
        1. **Depth**: {depth_instructions} Change the flow of ideas if necessary, add a completely new hook/introduction, and a conclusion.
        2. **Tone**: The tone must be {tone}.
        3. **HTML Format**: The output MUST be clean HTML format (use <h2>, <h3>, <p>, <ul>, <blockquote> where appropriate). Do NOT include <html> or <body> tags.
        4. **Keyword Density**: Focus smartly on the main topic without keyword stuffing.
        {rules_text}

        I need the output EXCLUSIVELY in a strict, valid JSON format containing the following fields:
        {{
          "title": "A new, highly engaging, SEO-optimized title (max 60 chars)",
          "slug": "url-slug-in-english-based-on-topic-with-hyphens",
          "metaDescription": "An engaging meta description that encourages clicks (max 155 chars)",
          "content": "The full rewritten article content in HTML format based on instructions above",
          "category": "One appropriate category (e.g., Technology, Business, Health, AI)",
          "tags": ["tag1", "tag2", "tag3", "tag4"]
        }}
        
        CRITICAL JSON RULES:
        - Escape all internal double quotes inside strings with \\".
        - Use single quotes for all HTML attributes in the content (e.g., <div class='wrapper'>).
        - NEVER include literal newline characters inside JSON string values. Use \\n or format the HTML as a continuous single-line string.
        - Return ONLY the raw JSON string. Do NOT wrap it in markdown block quotes like ```json.
        """

        max_retries = 8
        attempt: int = 0
        
        while attempt < max_retries:
            if GLOBAL_STOP_EVENT.is_set(): return None
            
            api_key = get_next_api_key()
            if not api_key:
                log_info("[Rewriter Error]: No API keys available.")
                return None
                
            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(model=model_name, contents=prompt)
                
                response_text = response.text
                clean_json_string = response_text.replace('```json', '').replace('```', '').strip()
                
                try:
                    parsed_data = json.loads(clean_json_string)
                    return parsed_data
                except json.JSONDecodeError:
                    log_info(f"[Rewriter Error]: Failed to parse AI JSON response.")
                    return None
                    
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    log_info(f"[Rewriter Error]: Rate limit hit (429). Rotating API key automatically... ({attempt + 1}/{max_retries})")
                    attempt += 1
                    continue
                else:
                    log_info(f"[Rewriter Error]: {error_str}")
                    return None
                    
        log_info("[Rewriter Error]: Exhausted all available API keys due to rate limitations.")
        return None

    except Exception as e:
        print(f"[Rewriter Error]: {e}")
        return None

def generate_image_alt_text(article_context: str, image_url: str) -> str:
    return f"Illustrative image related to {article_context}"
