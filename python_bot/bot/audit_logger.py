import csv
import os
from datetime import datetime
from .logger import log_info

AUDIT_FILE = os.path.join(os.path.dirname(__file__), "audit_log.csv")

def _ensure_csv_header():
    if not os.path.exists(AUDIT_FILE):
        with open(AUDIT_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Timestamp", "Module", "Action", "Result", "Details"])

def log_audit(module: str, action: str, result: str, details: str = ""):
    """
    Appends a forensic-level entry to the executive audit trail CSV.
    This creates a board-room level report of every action the Bot CEO has taken.
    """
    _ensure_csv_header()
    with open(AUDIT_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([datetime.now().isoformat(), module, action, result, details])
    log_info(f"[Nerve Center | Audit Logger] Logged: [{module}] {action} -> {result}")

def get_audit_summary() -> dict:
    """Read the audit log and return summary statistics."""
    if not os.path.exists(AUDIT_FILE):
        return {"total_actions": 0, "modules_active": []}
    
    with open(AUDIT_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    modules = list(set(r["Module"] for r in rows))
    return {
        "total_actions": len(rows),
        "modules_active": modules,
        "last_action": rows[-1] if rows else None
    }

if __name__ == "__main__":
    log_audit("SEO Agent", "Fetched latest rules", "SUCCESS", "3 new rules applied")
    log_audit("ML Engine", "Adjusted keyword density", "SUCCESS", "Changed from 2% to 3%")
    print(get_audit_summary())
