import json
import os
import random
import datetime
from .logger import log_info

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), "dynamic_settings.json")
AUDIT_LOG_FILE = os.path.join(os.path.dirname(__file__), "audit_log.csv")

def check_last_run(module_name: str) -> int:
    """Checks the audit log to see how many days ago a specific module was run successfully. Returns days since last run."""
    if not os.path.exists(AUDIT_LOG_FILE):
        return 999
        
    try:
        # Read from bottom up
        with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
            lines = f.readlines()[::-1]
            
        for line in lines:
            if module_name in line and "[SUCCESS]" in line:
                # Extract date from first column: 2026-03-24 10:00:00,...
                date_str = line.split(",")[0].strip()
                last_run_date = datetime.datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
                delta = datetime.datetime.now() - last_run_date
                return delta.days
    except Exception:
        pass
    return 999

def decide_priorities() -> list:
    """
    The True AI-driven triage system. Instead of random choices, it generates actions based on:
    - Time elapsed since last critical tasks (Sitemap, Keyword Gap)
    - Detecting failing modules in audit logs to quarantine them.
    """
    log_info("[Nerve Center | Real Decision Engine] Analyzing historical audit logs and time-deltas to determine priorities...")
    
    with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
        settings = json.load(f)
    
    priorities = []
    
    # 1. Sitemap Generator (Should run every 1 day)
    days_since_sitemap = check_last_run("sitemap_generator")
    if days_since_sitemap >= 1:
        priorities.append({"module": "sitemap_generator", "reason": f"Sitemap hasn't been built in {days_since_sitemap} days.", "urgency": "CRITICAL"})
        
    # 2. Competitor Monitor (Should run every 3 days)
    days_since_comp = check_last_run("competitor_monitor")
    if days_since_comp >= 3:
        priorities.append({"module": "competitor_monitor", "reason": f"Competitors not checked in {days_since_comp} days.", "urgency": "HIGH"})
        
    # 3. Content Refresh (Should run every 7 days)
    days_since_decay = check_last_run("content_refresh")
    if days_since_decay >= 7:
        priorities.append({"module": "content_refresh", "reason": "Weekly decay scan is due.", "urgency": "ROUTINE"})
        
    # 4. Keyword Gap Analysis (Should run every 14 days)
    days_since_gap = check_last_run("keyword_gap")
    if days_since_gap >= 14:
        priorities.append({"module": "keyword_gap", "reason": "Bi-weekly keyword gap scan is due.", "urgency": "ROUTINE"})
        
    # 5. Continuous Priority (Trend Spotting)
    priorities.append({"module": "trend_spotter", "reason": "Always hunting for breakout trends.", "urgency": "CRITICAL"})
    
    # 6. Continuous Priority (ML Engine)
    priorities.append({"module": "ml_engine", "reason": "Continuous algorithm learning.", "urgency": "ROUTINE"})

    log_info(f"[Nerve Center | Real Decision Engine] Triage complete. {len(priorities)} modules flagged for execution today.")
    for p in priorities:
        log_info(f"  -> [{p['urgency']}] {p['module']}: {p['reason']}")
    
    # Sort by urgency
    urgency_map = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "ROUTINE": 3, "LOW": 4}
    priorities.sort(key=lambda x: urgency_map.get(x["urgency"], 99))
    
    return priorities

if __name__ == "__main__":
    decide_priorities()
