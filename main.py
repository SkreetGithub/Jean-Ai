#!/usr/bin/env python3
"""
Jean AI Desktop Assistant
A comprehensive AI-powered desktop assistant with voice recognition,
system monitoring, file operations, and more.
"""

import sys
import os
from config import ensure_files_exist
from gui_interface import JeanGUI

def main():
    """Main application entry point"""
    print("=" * 50)
    print("Jean AI Desktop Assistant")
    print("=" * 50)
    
    try:
        # Ensure configuration files exist
        ensure_files_exist()
        
        # Start the GUI application
        print("Starting Jean AI Assistant...")
        app = JeanGUI()
        app.run()
        
    except KeyboardInterrupt:
        print("\nShutting down Jean AI Assistant...")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
