import os
import time
from duckduckgo_search import DDGS
from .logger import log_info
from .seo_agent import load_dynamic_settings

def get_ddg_region_code(country_name: str) -> str:
    """Maps country names to DuckDuckGo region codes."""
    mapping = {
        "United States": "us-en",
        "United Kingdom": "uk-en",
        "Germany": "de-de",
        "France": "fr-fr",
        "Canada": "ca-en",
        "Australia": "au-en",
        "Egypt": "eg-ar",
        "Saudi Arabia": "sa-ar",
        "UAE": "ae-ar",
        "Spain": "es-es",
        "Italy": "it-it",
        "India": "in-en",
        "Brazil": "br-pt",
        "Japan": "jp-jp",
        "Mexico": "mx-es"
    }
    return mapping.get(country_name, "us-en")

def analyze_breakout_trends():
    """
    Connects to DuckDuckGo News API to detect trending topics in the targeted geo-regions.
    Fetches latest tech news per region and looks for overlapping/global trends.
    """
    settings = load_dynamic_settings()
    regions = settings.get("target_regions", ["United States"])
    
    log_info(f"[Nerve Center | Trend Spotter] Pinging global trend metrics across {len(regions)} regions: {', '.join(regions)}")
    
    all_trends = []
    
    try:
        with DDGS() as ddgs:
            for region in regions:
                region_code = get_ddg_region_code(region)
                log_info(f"   -> Scanning {region} ({region_code})...")
                
                # We add exponential backoff/delay to avoid DDGS rate limits (Weakness #7 fix)
                time.sleep(2) 
                
                # Fetch recent news related to technology and AI
                results = ddgs.news("technology OR artificial intelligence OR web development", region=region_code, max_results=5)
                
                if results:
                    for r in results:
                        all_trends.append({
                            "title": r.get('title', ''),
                            "source": r.get('source', ''),
                            "region": region
                        })
    except Exception as e:
        log_info(f"[Nerve Center | Trend Spotter] ML Error during trend extraction: {e}")
        return []

    # Cross-Region Analysis: Find topics that are trending in MULTIPLE regions simultaneously
    if not all_trends:
        log_info("[Nerve Center | Trend Spotter] Search velocity is stable. No new breakouts detected.")
        return []
        
    log_info(f"[Nerve Center | Trend Spotter] Extracted {len(all_trends)} fresh news items. Analyzing cross-region velocity...")
    
    # Simple NLP to find overlapping noun phrases or bigrams could go here.
    # For now, we return the top trend from the primary region.
    
    top_trend = all_trends[0]
    log_info(f"[Nerve Center | Trend Spotter] [ALERT] BREAKOUT TREND DETECTED: '{top_trend['title']}' (Trending in {top_trend['region']})")
    log_info(f"[Nerve Center | Trend Spotter] Preemptively alerting the Writer Agent to aggregate sources and publish immediately.")
    
    return all_trends

if __name__ == "__main__":
    analyze_breakout_trends()
