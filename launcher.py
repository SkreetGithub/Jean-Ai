#!/usr/bin/env python3
"""
Jean AI Assistant Launcher
Choose between Desktop GUI or Web Interface
"""

import sys
import os
import subprocess
import threading
import time
from config import ensure_files_exist

def print_banner():
    """Print Jean AI banner"""
    banner = """
    ╔══════════════════════════════════════╗
    ║           Jean AI Assistant          ║
    ║     Your Intelligent Companion       ║
    ╚══════════════════════════════════════╝
    """
    print(banner)

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        'flask', 'openai', 'pyttsx3', 'psutil', 
        'speechrecognition', 'schedule'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install -r requirements.txt")
        return False
    
    return True

def launch_desktop():
    """Launch the desktop GUI version"""
    try:
        print("🖥️  Launching Desktop GUI...")
        from gui_interface import JeanGUI
        app = JeanGUI()
        app.run()
    except Exception as e:
        print(f"❌ Error launching desktop version: {e}")
        return False
    return True

def launch_web():
    """Launch the web server version"""
    try:
        print("🌐 Launching Web Server...")
        print("Web interface will be available at: http://localhost:5000")
        from web_server import app, initialize_web_server
        initialize_web_server()
        app.run(debug=False, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"❌ Error launching web version: {e}")
        return False
    return True

def launch_both():
    """Launch both desktop and web versions"""
    try:
        print("🚀 Launching both Desktop and Web versions...")
        
        # Start web server in a separate thread
        web_thread = threading.Thread(target=launch_web, daemon=True)
        web_thread.start()
        
        # Give web server time to start
        time.sleep(2)
        print("✅ Web server started successfully!")
        print("🌐 Web interface: http://localhost:5000")
        
        # Start desktop GUI in main thread
        launch_desktop()
        
    except Exception as e:
        print(f"❌ Error launching both versions: {e}")
        return False
    return True

def main():
    """Main launcher function"""
    print_banner()
    
    # Ensure configuration files exist
    ensure_files_exist()
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("\nChoose how to run Jean AI:")
    print("1. 🖥️  Desktop GUI (Tkinter interface)")
    print("2. 🌐 Web Interface (Browser-based)")
    print("3. 🚀 Both (Desktop + Web)")
    print("4. ❌ Exit")
    
    while True:
        try:
            choice = input("\nEnter your choice (1-4): ").strip()
            
            if choice == '1':
                launch_desktop()
                break
            elif choice == '2':
                launch_web()
                break
            elif choice == '3':
                launch_both()
                break
            elif choice == '4':
                print("👋 Goodbye!")
                sys.exit(0)
            else:
                print("❌ Invalid choice. Please enter 1, 2, 3, or 4.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            sys.exit(0)
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
