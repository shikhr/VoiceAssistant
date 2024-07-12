from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from core.generate import generate_audio

# import soundfile as sf
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv

load_dotenv()

from core.stt import transcribe_audio
from core.groqapi import get_completion

app = Flask(__name__)
socketio = SocketIO(
    app,
    cors_allowed_origins=[
        "http://localhost:5173",
        "https://localhost:5173",
        "https://192.168.0.137:5173",
    ],
)


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("audio_data")
def handle_audio_data(data):
    audio_array = np.frombuffer(data, dtype=np.float32)

    prompt = transcribe_audio(audio_array).strip()
    if not prompt:
        emit("no_prompt_recognised")
        return
    response = (
        get_completion({"role": "user", "content": prompt}).choices[0].message.content
    )
    audio_data, rate = generate_audio(response)
    emit("prompt_response", (prompt, response, audio_data.tolist(), rate))


@app.route("/")
def home():
    return "Hello, Flask!"


# @app.route("/generate")
# def generate():
#     text = "Hello"
#     sample_rate, audio_array = generate_audio(text)
#     return [sample_rate, audio_array.tolist()]


if __name__ == "__main__":
    socketio.run(app)
