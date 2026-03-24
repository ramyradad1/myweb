import os
import time
import requests
from dotenv import load_dotenv
load_dotenv()
from .logger import log_info
from .seo_agent import research_latest_seo_rules, load_dynamic_settings
from .ml_engine import run_regression_analysis
from .competitor_monitor import run_competitor_monitoring
from .content_refresh import run_content_decay_scan
from .trend_spotter import analyze_breakout_trends
from .ab_tester import execute_ab_testing_cycle

# Phase 6: Business Management
from .omni_channel import distribute_content_to_socials
from .auto_media import generate_article_media
from .auto_moderator import moderate_and_reply_comments
from .auto_translator import expand_geo_reach
from .ad_optimizer import optimize_ad_revenue

# Phase 7: Technical SEO
from .schema_injector import generate_and_inject_schema
from .keyword_gap import perform_keyword_gap_analysis
from .core_web_vitals import monitor_core_web_vitals
from .sitemap_generator import rebuild_and_ping_sitemaps
from .broken_link_guardian import scan_and_fix_broken_links

# Phase 8: Superintelligence
from .user_intent_analyzer import analyze_user_intent
from .algo_update_radar import check_for_algo_updates
from .visitor_profiler import profile_visitor_behavior
from .auto_backlink_builder import hunt_for_backlinks
from .early_warning_system import trigger_early_warning_system
from .smart_dashboard import generate_smart_dashboard

# Phase 9: Self-Learning Memory
from .memory_bank import remember, recall_recent
from .reinforcement_loop import run_reinforcement_check
from .strategy_generator import generate_novel_strategies

# Phase 10: Full Autonomy
from .decision_engine import decide_priorities
from .audit_logger import log_audit

import json
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "dynamic_settings.json")

def is_module_enabled(module_name: str) -> bool:
    """Check if a module is enabled in dynamic_settings.json."""
    try:
        with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
            settings = json.load(f)
        return settings.get("modules", {}).get(module_name, True)
    except Exception:
        return True

def safe_run(module_name: str, func, *args, **kwargs):
    """Safely run a module function with error recovery."""
    if not is_module_enabled(module_name):
        log_info(f"[Nerve Center] [SKIP] Module '{module_name}' is disabled by admin.")
        return None
    try:
        return func(*args, **kwargs)
    except Exception as e:
        log_info(f"[Nerve Center] [ERROR] Module '{module_name}' failed: {e}. Continuing pipeline...")
        log_audit(module_name, "Module execution failed", "ERROR", str(e))
        return None

def send_telegram_alert(message: str):
    """Sends a notification to the admin when the Nerve Center autonomously changes settings."""
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    
    if not bot_token or not chat_id:
        log_info(f"[Nerve Center Alert] (Telegram NOT configured, logging to console instead):\n{message}")
        return
        
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message, "parse_mode": "Markdown"}
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            log_info("[Nerve Center] Successfully sent Telegram alert to admin.")
        else:
            log_info(f"[Nerve Center] Failed to send Telegram alert: {response.text}")
    except Exception as e:
        log_info(f"[Nerve Center] Error sending Telegram alert: {e}")

def run_site_controller():
    """
    The main autonomous loop. 
    1. Fetches live SEO rules.
    2. Analyzes traffic via ML.
    3. Reconfigures the site.
    4. Notifies the admin.
    """
    log_info("="*50)
    log_info("[SYS] [Nerve Center] Waking up to analyze site and perform autonomous optimization...")
    log_info("="*50)
    
    # 0. Superintelligence Safety Checks (Phase 8)
    log_info("[Nerve Center] Step 0: Initializing Superintelligence Pre-Flight Checks...")
    safe_run("algo_update_radar", check_for_algo_updates)
    safe_run("early_warning_system", trigger_early_warning_system)
    safe_run("audit_logger", log_audit, "Pre-Flight", "Safety checks completed", "SUCCESS")

    # 0.5 Self-Learning & Strategy (Phase 9)
    log_info("[Nerve Center] Step 0.5: Consulting Long-Term Memory & Self-Correction Engine...")
    safe_run("reinforcement_loop", run_reinforcement_check)
    safe_run("strategy_generator", generate_novel_strategies)
    safe_run("audit_logger", log_audit, "Strategy Engine", "Generated novel daily tactics", "SUCCESS")

    # 0.9 Decision Engine (Phase 10)
    log_info("[Nerve Center] Step 0.9: Running AI-Driven Priority Triage...")
    priorities = safe_run("decision_engine", decide_priorities) or []
    safe_run("audit_logger", log_audit, "Decision Engine", f"Triaged {len(priorities)} modules", "SUCCESS")

    # 1. Update Core Rules
    log_info("[Nerve Center] Step 1: Connecting SEO Agent to the live web...")
    safe_run("seo_agent", research_latest_seo_rules)
    
    # 2. Run Learning Engine
    log_info("[Nerve Center] Step 2: Connecting ML Engine to site performance data...")
    new_settings = safe_run("ml_engine", run_regression_analysis)
    
    # 3. Market Intelligence (Trends & Competitors)
    log_info("[Nerve Center] Step 3: Pinging Global Trends and Competitor Sitemaps...")
    safe_run("trend_spotter", analyze_breakout_trends)
    safe_run("competitor_monitor", run_competitor_monitoring)
    
    # 4. Content Optimizer (A/B Testing & Refresh)
    log_info("[Nerve Center] Step 4: Optimizing existing content and A/B Title Tests...")
    safe_run("content_refresh", run_content_decay_scan)
    safe_run("ab_tester", execute_ab_testing_cycle)
    
    # 4.5. Deep Cognitive Profiling (Phase 8)
    log_info("[Nerve Center] Step 4.5: Deep Analytics & Intent Profiling...")
    safe_run("user_intent_analyzer", analyze_user_intent, "best cloud hosting 2026")
    safe_run("visitor_profiler", profile_visitor_behavior)
    safe_run("auto_backlink_builder", hunt_for_backlinks, "Tech SEO")
    
    # 5. Business & Revenue Scaling (Phase 6)
    log_info("[Nerve Center] Step 5: Firing up Business Management Automations...")
    safe_run("auto_media", generate_article_media, "SEO Strategy 2026")
    safe_run("omni_channel", distribute_content_to_socials, "SEO Strategy 2026", "https://yourwebsite.com/seo-2026")
    safe_run("auto_moderator", moderate_and_reply_comments)
    safe_run("auto_translator", expand_geo_reach)
    safe_run("ad_optimizer", optimize_ad_revenue)
    
    # 6. Technical SEO (Phase 7)
    log_info("[Nerve Center] Step 6: Initializing Technical SEO Audits & Enhancements...")
    safe_run("schema_injector", generate_and_inject_schema, "SEO Strategy 2026", "https://yourwebsite.com/seo-2026")
    safe_run("keyword_gap", perform_keyword_gap_analysis)
    safe_run("core_web_vitals", monitor_core_web_vitals)
    safe_run("broken_link_guardian", scan_and_fix_broken_links)
    safe_run("sitemap_generator", rebuild_and_ping_sitemaps)
    
    # Generate an intelligent report
    if new_settings:
        target_words = new_settings.get("target_word_count", 0)
        target_imgs = new_settings.get("target_image_count", 0)
        kw_density = new_settings.get("target_keyword_density", 0)
        rules = new_settings.get("dynamic_seo_rules", [])
        
        report = "*[ALERT] Autonomous System Alert [ALERT]*\n\n"
        report += "I have successfully analyzed the live web and recent site traffic, and updated my internal parameters:\n\n"
        report += "*[Machine Learning Findings]*\n"
        report += f"- Optimal Article Length: {target_words} words\n"
        report += f"- Optimal Image Count: {target_imgs}\n"
        report += f"- Optimal Keyword Density: {kw_density}%\n\n"
        report += "*[Latest Google Core Update Rules Implemented]*\n"
        for idx, rule in enumerate(rules, start=1):
            report += f"{idx}. {rule}\n"
            
        # 6.5 Compile Final GUI Dashboard (Phase 8)
        report = generate_smart_dashboard(report)
        
        # Log the entire cycle to audit trail
        remember("Full Nerve Center Cycle", "Completed successfully", {"word_count": target_words, "kw_density": kw_density})
        log_audit("Nerve Center", "Full autonomous cycle completed", "SUCCESS", f"Words: {target_words}, KD: {kw_density}%")
            
        send_telegram_alert(report)

if __name__ == "__main__":
    run_site_controller()
