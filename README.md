# Jean AI Assistant 🤖

A comprehensive AI-powered desktop and web assistant with voice recognition, system monitoring, and intelligent conversation capabilities.

## Features ✨

### 🖥️ Desktop Interface
- Modern Tkinter GUI with dark theme
- Real-time system monitoring (CPU, RAM, disk usage)
- File operations and search capabilities
- Conversation memory and history
- Voice synthesis (text-to-speech)

### 🌐 Web Interface
- Modern responsive web design
- Voice recording and transcription
- Wake word detection ("Hey Jean")
- Real-time chat interface
- Brain loader animations

### 🧠 AI Capabilities
- OpenAI GPT integration for intelligent responses
- OpenAI Whisper for voice transcription
- Conversation context and memory
- System command processing
- File analysis and processing

## Quick Start 🚀

### 1. Setup
\`\`\`bash
# Clone or download the project
cd jean-ai-assistant

# Run the setup script
python setup.py
\`\`\`

### 2. Configuration
Edit `user_config.json` and add your OpenAI API key:
\`\`\`json
{
  "openai_api_key": "your-actual-api-key-here"
}
\`\`\`

### 3. Launch
\`\`\`bash
python launcher.py
\`\`\`

Choose your preferred interface:
- **Desktop GUI**: Traditional desktop application
- **Web Interface**: Browser-based interface
- **Both**: Run both simultaneously

## Installation 📦

### Requirements
- Python 3.7+
- OpenAI API key
- Microphone (for voice features)

### Dependencies
All dependencies are automatically installed via `setup.py`:
- Flask (web server)
- OpenAI (AI integration)
- SpeechRecognition (voice input)
- pyttsx3 (text-to-speech)
- psutil (system monitoring)
- And more...

## Usage 💡

### Desktop Version
1. Type questions in the input field
2. Click "System Info" for hardware status
3. Use "Upload File" to analyze documents
4. "Search Files" to find files on your system

### Web Version
1. Open http://localhost:5000 in your browser
2. Type or use voice input
3. Try wake word detection with "Hey Jean"
4. Enjoy the modern chat interface

## Voice Commands 🎤

- **"Hey Jean"** - Wake word activation
- **System queries**: "What's my CPU usage?"
- **File operations**: "Open file /path/to/file"
- **General chat**: Ask any question!

## API Endpoints 🔌

- `POST /chat` - Send chat messages
- `POST /voice` - Voice transcription
- `POST /wake` - Wake word detection
- `GET /status` - System status
- `POST /clear_memory` - Clear conversation history

## Configuration ⚙️

Edit `config.py` or `user_config.json` to customize:
- OpenAI API settings
- Voice synthesis rate
- Memory limits
- File paths
- And more...

## Troubleshooting 🔧

### Common Issues
1. **Microphone not working**: Check system permissions
2. **OpenAI API errors**: Verify your API key
3. **Import errors**: Run `python setup.py` again

### Getting Help
- Check the console output for error messages
- Ensure all requirements are installed
- Verify your OpenAI API key is valid

## Contributing 🤝

Feel free to contribute improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License 📄

This project is open source. Use responsibly and enjoy!

---

**Made with ❤️ for AI enthusiasts**
# Jean-Ai
