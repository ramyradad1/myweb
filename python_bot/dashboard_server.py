import json
import os
import subprocess
import sys
from flask import Flask, render_template, request, jsonify
from datetime import datetime

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "bot", "dynamic_settings.json")
MEMORY_FILE = os.path.join(os.path.dirname(__file__), "bot", "bot_memory.json")
AUDIT_FILE = os.path.join(os.path.dirname(__file__), "bot", "audit_log.csv")

app = Flask(__name__, template_folder="templates", static_folder="static")

AVAILABLE_REGIONS = {
    "us": "United States",
    "gb": "United Kingdom",
    "de": "Germany",
    "fr": "France",
    "ca": "Canada",
    "au": "Australia",
    "nl": "Netherlands",
    "se": "Sweden",
    "es": "Spain",
    "it": "Italy",
    "in": "India",
    "br": "Brazil",
    "jp": "Japan",
    "kr": "South Korea",
    "za": "South Africa",
    "ie": "Ireland",
    "nz": "New Zealand",
    "sg": "Singapore",
}

MODULE_LABELS = {
    "seo_agent": {"name": "SEO Research Agent", "phase": 1, "desc": "Searches the live web for the latest Google ranking rules."},
    "ml_engine": {"name": "ML Analytics Engine", "phase": 2, "desc": "Runs regression analysis on article features vs traffic."},
    "social_scraper": {"name": "Social Problem Scraper", "phase": 4, "desc": "Scrapes DuckDuckGo for trending tech problems."},
    "competitor_monitor": {"name": "Competitor Monitor", "phase": 5, "desc": "Monitors competitor sitemaps for new content."},
    "content_refresh": {"name": "Content Decay Scanner", "phase": 5, "desc": "Finds and refreshes outdated articles."},
    "internal_linker": {"name": "Internal Link Builder", "phase": 5, "desc": "Auto-injects semantic internal links."},
    "trend_spotter": {"name": "Trend Spotter", "phase": 5, "desc": "Detects viral trends before they peak."},
    "ab_tester": {"name": "A/B Title Tester", "phase": 5, "desc": "Rotates article titles to optimize CTR."},
    "omni_channel": {"name": "Social Media Publisher", "phase": 6, "desc": "Posts to social channels automatically."},
    "auto_media": {"name": "Auto Image Generator", "phase": 6, "desc": "Generates article thumbnails and graphics."},
    "auto_moderator": {"name": "AI Community Moderator", "phase": 6, "desc": "Auto-replies to comments and questions."},
    "auto_translator": {"name": "Auto Translator", "phase": 6, "desc": "Translates content for international SEO."},
    "ad_optimizer": {"name": "Ad Revenue Optimizer", "phase": 6, "desc": "Optimizes ad placements for max revenue."},
    "schema_injector": {"name": "Schema/Rich Snippet Injector", "phase": 7, "desc": "Generates JSON-LD structured data."},
    "keyword_gap": {"name": "Keyword Gap Analyzer", "phase": 7, "desc": "Finds keywords competitors rank for that you don't."},
    "core_web_vitals": {"name": "Core Web Vitals Monitor", "phase": 7, "desc": "Monitors PageSpeed and LCP/CLS/FID."},
    "sitemap_generator": {"name": "Dynamic Sitemap Generator", "phase": 7, "desc": "Rebuilds sitemap.xml and pings search engines."},
    "broken_link_guardian": {"name": "Broken Link Guardian", "phase": 7, "desc": "Scans and fixes 404 dead links."},
    "user_intent_analyzer": {"name": "User Intent Analyzer", "phase": 8, "desc": "Classifies search intent (Buy vs Learn)."},
    "algo_update_radar": {"name": "Algorithm Update Radar", "phase": 8, "desc": "Detects Google algorithm update turbulence."},
    "visitor_profiler": {"name": "Visitor Behavior Profiler", "phase": 8, "desc": "Analyzes bounce rates and dwell time."},
    "auto_backlink_builder": {"name": "Auto Backlink Prospector", "phase": 8, "desc": "Finds guest post opportunities for link building."},
    "early_warning_system": {"name": "Rank Early Warning System", "phase": 8, "desc": "Alerts when top keywords drop in rankings."},
    "smart_dashboard": {"name": "Smart Dashboard Reporter", "phase": 8, "desc": "Compiles visual reports for Telegram."},
    "memory_bank": {"name": "Long-Term Memory Bank", "phase": 9, "desc": "Stores all decisions for learning from history."},
    "reinforcement_loop": {"name": "Self-Correction Engine", "phase": 9, "desc": "Reverts bad ML decisions automatically."},
    "strategy_generator": {"name": "AI Strategy Inventor", "phase": 9, "desc": "Uses LLM to brainstorm novel SEO tactics."},
    "decision_engine": {"name": "Priority Decision Engine", "phase": 10, "desc": "Dynamically triages which modules run today."},
    "audit_logger": {"name": "Executive Audit Logger", "phase": 10, "desc": "Logs every action to CSV for transparency."},
}

def load_settings():
    with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_settings(data):
    with open(SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False, default=str)

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def load_audit():
    if not os.path.exists(AUDIT_FILE):
        return []
    import csv
    with open(AUDIT_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)[-20:]  # last 20 entries


@app.route("/")
def dashboard():
    settings = load_settings()
    memory = load_memory()[-10:]
    audit = load_audit()
    return render_template(
        "dashboard.html",
        settings=settings,
        modules=MODULE_LABELS,
        regions=AVAILABLE_REGIONS,
        memory=memory,
        audit=audit,
        now=datetime.now().strftime("%Y-%m-%d %H:%M"),
    )


@app.route("/api/save", methods=["POST"])
def save():
    data = request.json
    settings = load_settings()
    
    # Update scalar settings
    settings["daily_article_quota"] = int(data.get("daily_article_quota", 3))
    settings["scheduler_interval_hours"] = int(data.get("scheduler_interval_hours", 6))
    settings["target_word_count"] = int(data.get("target_word_count", 1000))
    settings["target_image_count"] = int(data.get("target_image_count", 4))
    settings["target_keyword_density"] = float(data.get("target_keyword_density", 3.0))
    
    # Update regions
    settings["target_regions"] = data.get("target_regions", ["us", "gb"])
    
    # Update module toggles
    modules = data.get("modules", {})
    for key in settings.get("modules", {}):
        if key in modules:
            settings["modules"][key] = modules[key]
    
    save_settings(settings)
    return jsonify({"status": "ok", "message": "Settings saved successfully!"})


@app.route("/api/run", methods=["POST"])
def run_nerve_center():
    try:
        result = subprocess.run(
            [sys.executable, "-m", "bot.site_controller"],
            cwd=os.path.dirname(__file__),
            capture_output=True, text=True, timeout=120,
            encoding="utf-8", errors="replace"
        )
        output = result.stdout[-2000:] if result.stdout else "No output"
        return jsonify({"status": "ok", "output": output, "exit_code": result.returncode})
    except subprocess.TimeoutExpired:
        return jsonify({"status": "error", "message": "Nerve Center timed out (2 min limit)."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    print("=" * 50)
    print("  NERVE CENTER DASHBOARD")
    print("  Open http://localhost:5050 in your browser")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5050, debug=True)
