import pyttsx3
import speech_recognition as sr
import psutil
import os
import json
import datetime
import hashlib
from config import *

class JeanAssistant:
    def __init__(self):
        # Initialize text-to-speech engine
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', VOICE_RATE)
        
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        
        print("Jean AI Assistant initialized successfully!")
    
    def speak(self, text):
        """Convert text to speech"""
        print(f"Jean: {text}")
        self.engine.say(text)
        self.engine.runAndWait()
    
    def load_memory(self):
        """Load conversation memory from file"""
        try:
            if os.path.exists(MEMORY_FILE):
                with open(MEMORY_FILE, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading memory: {e}")
        return []
    
    def save_memory(self, entry):
        """Save conversation entry to memory"""
        try:
            memory = self.load_memory()
            memory.append({
                "content": entry,
                "timestamp": str(datetime.datetime.now())
            })
            
            # Keep only the last MAX_MEMORY_ENTRIES
            with open(MEMORY_FILE, 'w') as f:
                json.dump(memory[-MAX_MEMORY_ENTRIES:], f, indent=2)
        except Exception as e:
            print(f"Error saving memory: {e}")
    
    def get_system_info(self, query):
        """Get system information based on query"""
        query = query.lower()
        
        if "cpu" in query:
            cpu_usage = psutil.cpu_percent(interval=1)
            return f"CPU usage is {cpu_usage}%"
        
        elif "ram" in query or "memory" in query:
            ram_usage = psutil.virtual_memory().percent
            return f"RAM usage is {ram_usage}%"
        
        elif "disk" in query:
            disk_usage = psutil.disk_usage('/').percent
            return f"Disk usage is {disk_usage}%"
        
        elif "battery" in query:
            try:
                battery = psutil.sensors_battery()
                if battery:
                    return f"Battery is at {battery.percent}%, {'charging' if battery.power_plugged else 'not charging'}"
                else:
                    return "Battery information not available"
            except:
                return "Battery information not available"
        
        return "System information not found for that query"
    
    def search_files(self, extension=".txt", root_dir=None):
        """Search for files with specific extension"""
        if root_dir is None:
            root_dir = os.path.expanduser("~")  # User's home directory
        
        found_files = []
        try:
            for root, dirs, files in os.walk(root_dir):
                for file in files:
                    if file.endswith(extension):
                        found_files.append(os.path.join(root, file))
                    
                    if len(found_files) >= MAX_FILE_SEARCH_RESULTS:
                        break
                
                if len(found_files) >= MAX_FILE_SEARCH_RESULTS:
                    break
        
        except Exception as e:
            return f"Error searching files: {e}"
        
        if found_files:
            return f"Found {len(found_files)} files:\n" + "\n".join(found_files)
        else:
            return f"No {extension} files found"
    
    def process_file_command(self, query):
        """Process file-related commands"""
        query = query.lower().strip()
        
        if query.startswith("open file"):
            file_path = query.replace("open file", "").strip()
            if os.path.exists(file_path):
                try:
                    os.startfile(file_path)  # Windows
                    return f"Opening file: {file_path}"
                except:
                    try:
                        os.system(f'open "{file_path}"')  # macOS
                        return f"Opening file: {file_path}"
                    except:
                        try:
                            os.system(f'xdg-open "{file_path}"')  # Linux
                            return f"Opening file: {file_path}"
                        except:
                            return "Could not open file"
            else:
                return "File not found"
        
        elif query.startswith("run script"):
            file_path = query.replace("run script", "").strip()
            if os.path.exists(file_path) and file_path.endswith('.py'):
                try:
                    os.system(f'python "{file_path}"')
                    return f"Running Python script: {file_path}"
                except Exception as e:
                    return f"Error running script: {e}"
            else:
                return "Python script not found"
        
        elif "search file" in query:
            return self.search_files()
        
        return "File command not recognized"

# Test the assistant core
if __name__ == "__main__":
    assistant = JeanAssistant()
    assistant.speak("Hello! Jean AI Assistant is ready.")
    
    # Test system info
    print(assistant.get_system_info("cpu usage"))
    print(assistant.get_system_info("ram usage"))
