#!/usr/bin/env python3
"""
Jean AI Assistant Setup Script
Automated setup and configuration
"""

import os
import sys
import subprocess
import json

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False

def setup_config():
    """Setup configuration files"""
    print("⚙️  Setting up configuration...")
    
    # Create config template
    config_template = {
        "openai_api_key": "your-openai-api-key-here",
        "voice_rate": 170,
        "max_memory_entries": 20,
        "web_port": 5000,
        "debug_mode": False
    }
    
    config_file = "user_config.json"
    if not os.path.exists(config_file):
        with open(config_file, 'w') as f:
            json.dump(config_template, f, indent=2)
        print(f"✅ Created {config_file}")
    else:
        print(f"ℹ️  {config_file} already exists")
    
    # Create templates directory
    templates_dir = "templates"
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir)
        print(f"✅ Created {templates_dir} directory")
    
    return True

def check_system_requirements():
    """Check system requirements"""
    print("🔍 Checking system requirements...")
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        return False
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Check for microphone access (optional)
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        with sr.Microphone() as source:
            pass
        print("✅ Microphone access available")
    except:
        print("⚠️  Microphone access may be limited")
    
    return True

def create_desktop_shortcut():
    """Create desktop shortcut (Windows only)"""
    if sys.platform == "win32":
        try:
            import winshell
            from win32com.client import Dispatch
            
            desktop = winshell.desktop()
            path = os.path.join(desktop, "Jean AI Assistant.lnk")
            target = os.path.join(os.getcwd(), "launcher.py")
            
            shell = Dispatch('WScript.Shell')
            shortcut = shell.CreateShortCut(path)
            shortcut.Targetpath = sys.executable
            shortcut.Arguments = f'"{target}"'
            shortcut.WorkingDirectory = os.getcwd()
            shortcut.IconLocation = sys.executable
            shortcut.save()
            
            print("✅ Desktop shortcut created")
        except ImportError:
            print("ℹ️  Desktop shortcut creation skipped (winshell not available)")
        except Exception as e:
            print(f"⚠️  Could not create desktop shortcut: {e}")

def main():
    """Main setup function"""
    print("🚀 Jean AI Assistant Setup")
    print("=" * 40)
    
    # Check system requirements
    if not check_system_requirements():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Setup configuration
    if not setup_config():
        sys.exit(1)
    
    # Create desktop shortcut
    create_desktop_shortcut()
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Edit user_config.json to add your OpenAI API key")
    print("2. Run: python launcher.py")
    print("\nEnjoy using Jean AI Assistant! 🤖")

if __name__ == "__main__":
    main()
