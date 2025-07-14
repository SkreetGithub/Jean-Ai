import os
import json

# ================= CONFIG ===================
OPENAI_API_KEY = "your-openai-api-key"  # Replace with your actual API key
CHAT_HISTORY_FILE = "chat_history.txt"
MEMORY_FILE = "memory.json"
SECURE_HISTORY_FILE = "secure_history.json"
GOOGLE_CREDENTIALS_FILE = "credentials.json"

# Google API Scopes
SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/gmail.readonly'
]

# Voice settings
VOICE_RATE = 170
MAX_MEMORY_ENTRIES = 20
MAX_FILE_SEARCH_RESULTS = 10

def ensure_files_exist():
    """Create necessary files if they don't exist"""
    files_to_create = [CHAT_HISTORY_FILE, MEMORY_FILE, SECURE_HISTORY_FILE]
    
    for file_path in files_to_create:
        if not os.path.exists(file_path):
            if file_path.endswith('.json'):
                with open(file_path, 'w') as f:
                    json.dump([], f)
            else:
                with open(file_path, 'w') as f:
                    f.write("")
    
    print("Configuration initialized successfully!")

if __name__ == "__main__":
    ensure_files_exist()
