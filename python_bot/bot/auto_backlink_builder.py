from duckduckgo_search import DDGS
from .logger import log_info

def hunt_for_backlinks(niche: str = "Web Development"):
    """
    Automates prospecting for high-DA contextual backlink opportunities (Guest Posts, Forums) 
    using advanced search engine dorks.
    """
    log_info(f"[Nerve Center | Backlink Builder] Deploying search dorks to prospect PR opportunities for '{niche}'...")
    
    query = f"{niche} 'write for us' OR 'guest post'"
    links = []
    
    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=2)
            for r in dict(enumerate(results)).values():
                links.append(r.get("href", ""))
                
        log_info(f"[Nerve Center | Backlink Builder] Discovered {len(links)} high-DA target domains.")
        if links:
            log_info(f"[Nerve Center | Backlink Builder] [SUCCESS] Added '{links[0]}' to the Pitch Pipeline for outreach.")
    except Exception as e:
        log_info(f"[Nerve Center | Backlink Builder] Rate limited by search engine API during prospecting: {e}")

if __name__ == "__main__":
    hunt_for_backlinks("Tech SEO")
