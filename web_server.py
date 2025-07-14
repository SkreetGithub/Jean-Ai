from flask import Flask, request, jsonify, render_template, send_from_directory
import openai
import base64
import io
import speech_recognition as sr
import threading
import queue
import time
import os
import json
from datetime import datetime
from config import *

app = Flask(__name__)

# Configure OpenAI (replace with your actual API key)
openai.api_key = OPENAI_API_KEY

# Initialize speech recognizer
recognizer = sr.Recognizer()
wake_queue = queue.Queue()

# Memory system for web interface
web_memory = []

def load_web_memory():
    """Load web conversation memory"""
    global web_memory
    try:
        if os.path.exists("web_memory.json"):
            with open("web_memory.json", 'r') as f:
                web_memory = json.load(f)
    except Exception as e:
        print(f"Error loading web memory: {e}")
        web_memory = []

def save_web_memory(user_msg, ai_response):
    """Save web conversation to memory"""
    global web_memory
    try:
        entry = {
            "user": user_msg,
            "ai": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        web_memory.append(entry)
        
        # Keep only last 20 conversations
        web_memory = web_memory[-20:]
        
        with open("web_memory.json", 'w') as f:
            json.dump(web_memory, f, indent=2)
    except Exception as e:
        print(f"Error saving web memory: {e}")

@app.route('/')
def home():
    """Serve the main web interface"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests from web interface"""
    try:
        data = request.json
        prompt = data.get('prompt', '').strip()
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400

        print(f"Received chat request: {prompt}")

        # Build conversation context from memory
        messages = [
            {"role": "system", "content": """You are Jean, a helpful and friendly AI assistant. 
            You are knowledgeable, conversational, and always try to be helpful. 
            Keep your responses concise but informative. 
            You can help with various tasks including answering questions, providing information, 
            and having casual conversations."""}
        ]
        
        # Add recent conversation history for context
        for entry in web_memory[-5:]:  # Last 5 conversations
            messages.append({"role": "user", "content": entry["user"]})
            messages.append({"role": "assistant", "content": entry["ai"]})
        
        # Add current prompt
        messages.append({"role": "user", "content": prompt})

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        # Extract the response
        ai_response = response.choices[0].message.content
        
        # Save to memory
        save_web_memory(prompt, ai_response)
        
        print(f"AI Response: {ai_response}")

        return jsonify({'response': ai_response})

    except Exception as e:
        error_msg = f"Error processing chat request: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/voice', methods=['POST'])
def voice():
    """Handle voice transcription requests"""
    try:
        data = request.json
        voice_data = data.get('voice')
        
        if not voice_data:
            print("Error: No voice data provided")
            return jsonify({'error': 'No voice data provided'}), 400

        print("Processing voice data...")

        # Decode base64 audio data
        try:
            audio_data = base64.b64decode(voice_data)
            audio_file = io.BytesIO(audio_data)
            audio_file.name = "audio.wav"  # Add name attribute for OpenAI API
        except Exception as e:
            print(f"Error decoding audio data: {e}")
            return jsonify({'error': 'Invalid audio data'}), 400

        # Call OpenAI Whisper API for transcription
        try:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            transcribed_text = transcript['text']
            print(f"Transcribed text: {transcribed_text}")
            return jsonify({'transcript': transcribed_text})
        except Exception as e:
            print(f"Error with Whisper API: {e}")
            return jsonify({'error': f'Transcription failed: {str(e)}'}), 500

    except Exception as e:
        error_msg = f"Error in voice endpoint: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/wake', methods=['POST'])
def wake():
    """Handle wake word detection"""
    try:
        data = request.json
        audio_data = data.get('audio')
        
        if not audio_data:
            return jsonify({'error': 'No audio data provided'}), 400

        print("Processing wake word detection...")

        # Decode base64 audio data
        try:
            audio_bytes = base64.b64decode(audio_data)
            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "wake_audio.wav"
        except Exception as e:
            print(f"Error decoding wake word audio: {e}")
            return jsonify({'error': 'Invalid audio data'}), 400

        # Use OpenAI Whisper for more accurate transcription
        try:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            command = transcript['text'].lower()
            print(f"Wake word transcript: {command}")
            
            # Check for wake words
            wake_words = ["hey jean", "hi jean", "hello jean", "jean"]
            if any(wake_word in command for wake_word in wake_words):
                wake_queue.put(True)
                print("Wake word detected!")
                return jsonify({'status': 'Wake word detected', 'transcript': command})
            else:
                print("Wake word not detected")
                return jsonify({'status': 'Wake word not detected', 'transcript': command})
                
        except Exception as e:
            print(f"Error with wake word transcription: {e}")
            return jsonify({'error': f'Wake word detection failed: {str(e)}'}), 500

    except Exception as e:
        error_msg = f"Error in wake endpoint: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/status')
def status():
    """Get system status"""
    try:
        import psutil
        status_info = {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "conversations": len(web_memory),
            "timestamp": datetime.now().isoformat()
        }
        return jsonify(status_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/clear_memory', methods=['POST'])
def clear_memory():
    """Clear conversation memory"""
    try:
        global web_memory
        web_memory = []
        if os.path.exists("web_memory.json"):
            os.remove("web_memory.json")
        return jsonify({'status': 'Memory cleared successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def handle_wake_query():
    """Handle wake word queue processing"""
    while True:
        try:
            if not wake_queue.empty():
                wake_queue.get()
                print("Wake word processed from queue")
                # Additional wake word processing can be added here
            time.sleep(1)
        except Exception as e:
            print(f"Error in wake query handler: {e}")
            time.sleep(5)

def initialize_web_server():
    """Initialize the web server"""
    print("Initializing Jean AI Web Server...")
    
    # Load existing memory
    load_web_memory()
    
    # Start background threads
    threading.Thread(target=handle_wake_query, daemon=True).start()
    
    print("Web server initialized successfully!")

if __name__ == '__main__':
    try:
        initialize_web_server()
        print("Starting Jean AI Web Server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\nShutting down Jean AI Web Server...")
    except Exception as e:
        print(f"Error starting web server: {e}")
