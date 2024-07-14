# AI-Powered Voice Assistant

This project implements an AI-powered voice assistant using React for the frontend and Flask for the backend. It leverages various AI models for speech-to-text, text-to-speech, and natural language processing to create an interactive voice-based interface.

## Features

- Real-time voice interaction
- Speech-to-text conversion using Whisper models
- Natural language processing using Groq API
- Text-to-speech synthesis
- Dynamic model selection for LLM and STT
- WebSocket communication for real-time updates

## Architecture

The application is split into two main parts:

1. **Frontend (React)**

   - Handles user interface and audio recording
   - Communicates with the backend using WebSockets
   - Renders responses and plays audio

2. **Backend (Flask)**
   - Processes audio input
   - Manages AI model interactions
   - Generates responses and audio output

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python 3.11+
- Conda (recommended for environment management)

### Backend Setup

1. Create a new conda environment:

   ```
   conda env create -f environment.yml
   ```

2. Activate the environment:

   ```
   conda activate voiceAssistant
   ```

3. Set up your environment variables:

   - Create a `.env` file in the root directory
   - Add your Groq API key:
     ```
     GROQ_API_KEY=your_api_key_here
     ```

4. Download the required TTS model:

   - Create a `models` directory in the `server` folder if it doesn't exist
   - Download the `en_us_hifi92_light_cpu.addon` file from the [Balacoon TTS Hugging Face repository](https://huggingface.co/balacoon/tts)
   - Place the downloaded file in the `server/models/` directory

5. Start the Flask server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Open the application in your web browser (typically at `http://localhost:5173`)
2. Select your preferred LLM and STT models from the dropdown menus
3. Click the microphone icon to start voice interaction
4. Speak your query or command
5. The assistant will process your input and respond both visually and audibly

## License

[MIT License](https://opensource.org/licenses/MIT)

## Acknowledgments

- This project uses the Groq API for fast and advanced language processing capabilities
- Speech recognition is powered by the Whisper models
- Text-to-speech functionality is provided by the Balacoon TTS library
- Voice Activity Detection (VAD) is implemented using Ricky0123's vad-react library
