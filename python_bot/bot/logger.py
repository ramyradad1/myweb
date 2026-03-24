from datetime import datetime
from collections import deque

# Store the last 100 log messages
log_buffer = deque(maxlen=100)

def log_info(message: str):
    timestamp = datetime.now().strftime("%H:%M:%S")
    formatted_log = f"[{timestamp}] {message}"
    
    # Print to terminal as well
    print(formatted_log)
    
    # Add to shared buffer
    log_buffer.append(formatted_log)

def get_logs():
    return list(log_buffer)
