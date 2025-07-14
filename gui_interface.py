import tkinter as tk
from tkinter import filedialog, scrolledtext
import threading
import queue
from assistant_core import JeanAssistant
from config import *

class JeanGUI:
    def __init__(self):
        self.assistant = JeanAssistant()
        self.setup_gui()
        self.message_queue = queue.Queue()
        
    def setup_gui(self):
        """Setup the main GUI window"""
        self.root = tk.Tk()
        self.root.title("Jean AI - Desktop Assistant")
        self.root.geometry("800x700")
        self.root.configure(bg="#1e1e1e")
        
        # Create main frame
        main_frame = tk.Frame(self.root, bg="#1e1e1e")
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Title
        title_label = tk.Label(
            main_frame, 
            text="Jean AI Assistant", 
            font=("Helvetica", 18, "bold"),
            bg="#1e1e1e", 
            fg="#61afef"
        )
        title_label.pack(pady=(0, 10))
        
        # Chat log area
        self.chat_log = scrolledtext.ScrolledText(
            main_frame,
            bg="#282c34",
            fg="#ffffff",
            font=("Consolas", 11),
            wrap=tk.WORD,
            height=25
        )
        self.chat_log.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        # Input frame
        input_frame = tk.Frame(main_frame, bg="#1e1e1e")
        input_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Input field
        self.input_field = tk.Entry(
            input_frame,
            font=("Helvetica", 12),
            bg="#3e4451",
            fg="#ffffff",
            insertbackground="#ffffff"
        )
        self.input_field.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        self.input_field.bind("<Return>", lambda e: self.handle_query())
        
        # Send button
        send_btn = tk.Button(
            input_frame,
            text="Send",
            command=self.handle_query,
            bg="#61afef",
            fg="#ffffff",
            font=("Helvetica", 10, "bold"),
            padx=20
        )
        send_btn.pack(side=tk.RIGHT)
        
        # Button frame
        btn_frame = tk.Frame(main_frame, bg="#1e1e1e")
        btn_frame.pack(fill=tk.X)
        
        # Buttons
        buttons = [
            ("System Info", self.show_system_info, "#98c379"),
            ("Upload File", self.upload_file, "#e5c07b"),
            ("Search Files", self.search_files, "#c678dd"),
            ("Clear Chat", self.clear_chat, "#e06c75")
        ]
        
        for i, (text, command, color) in enumerate(buttons):
            btn = tk.Button(
                btn_frame,
                text=text,
                command=command,
                bg=color,
                fg="#000000",
                font=("Helvetica", 9, "bold"),
                padx=15,
                pady=5
            )
            btn.grid(row=0, column=i, padx=5, pady=5, sticky="ew")
        
        # Configure grid weights
        for i in range(len(buttons)):
            btn_frame.grid_columnconfigure(i, weight=1)
        
        # Welcome message
        self.log_message("Jean AI", "Hello! I'm Jean, your AI assistant. How can I help you today?")
    
    def log_message(self, sender, message):
        """Log message to chat and file"""
        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        formatted_message = f"[{timestamp}] {sender}: {message}\n\n"
        
        self.chat_log.insert(tk.END, formatted_message)
        self.chat_log.see(tk.END)
        
        # Save to file
        try:
            with open(CHAT_HISTORY_FILE, "a", encoding="utf-8") as f:
                f.write(formatted_message)
        except Exception as e:
            print(f"Error saving chat: {e}")
    
    def handle_query(self):
        """Handle user query"""
        user_input = self.input_field.get().strip()
        if not user_input:
            return
        
        self.log_message("You", user_input)
        self.input_field.delete(0, tk.END)
        
        # Process query in separate thread to avoid GUI freezing
        threading.Thread(
            target=self.process_query_thread,
            args=(user_input,),
            daemon=True
        ).start()
    
    def process_query_thread(self, query):
        """Process query in separate thread"""
        try:
            # Save to memory
            self.assistant.save_memory(query)
            
            # Process different types of queries
            response = self.process_query_logic(query)
            
            # Update GUI in main thread
            self.root.after(0, lambda: self.log_message("Jean AI", response))
            self.root.after(0, lambda: self.assistant.speak(response))
            
        except Exception as e:
            error_msg = f"Sorry, I encountered an error: {str(e)}"
            self.root.after(0, lambda: self.log_message("Jean AI", error_msg))
    
    def process_query_logic(self, query):
        """Process the actual query logic"""
        query_lower = query.lower()
        
        # System information queries
        if any(word in query_lower for word in ["cpu", "ram", "memory", "disk", "battery"]):
            return self.assistant.get_system_info(query)
        
        # File operations
        elif any(word in query_lower for word in ["open file", "run script", "search file"]):
            return self.assistant.process_file_command(query)
        
        # Time and date
        elif "time" in query_lower or "date" in query_lower:
            now = datetime.datetime.now()
            if "time" in query_lower:
                return f"The current time is {now.strftime('%H:%M:%S')}"
            else:
                return f"Today's date is {now.strftime('%Y-%m-%d')}"
        
        # Default response
        else:
            return f"I heard you say: '{query}'. I'm still learning to respond to different queries!"
    
    def show_system_info(self):
        """Show comprehensive system information"""
        info_parts = [
            self.assistant.get_system_info("cpu"),
            self.assistant.get_system_info("ram"),
            self.assistant.get_system_info("disk"),
            self.assistant.get_system_info("battery")
        ]
        
        system_info = "System Information:\n" + "\n".join(info_parts)
        self.log_message("Jean AI", system_info)
    
    def upload_file(self):
        """Handle file upload"""
        file_path = filedialog.askopenfilename(
            title="Select a file to analyze",
            filetypes=[
                ("Text files", "*.txt"),
                ("Python files", "*.py"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read(500)  # Read first 500 characters
                
                analysis = f"File: {os.path.basename(file_path)}\nSize: {os.path.getsize(file_path)} bytes\nPreview:\n{content}..."
                self.log_message("Jean AI", f"File uploaded successfully!\n{analysis}")
                
            except Exception as e:
                self.log_message("Jean AI", f"Error reading file: {str(e)}")
    
    def search_files(self):
        """Search for files"""
        result = self.assistant.search_files(".py")  # Search for Python files
        self.log_message("Jean AI", result)
    
    def clear_chat(self):
        """Clear the chat log"""
        self.chat_log.delete(1.0, tk.END)
        self.log_message("Jean AI", "Chat cleared! How can I help you?")
    
    def run(self):
        """Start the GUI application"""
        self.root.mainloop()

# Run the GUI application
if __name__ == "__main__":
    app = JeanGUI()
    app.run()
