import os
from flask import Flask, send_from_directory
from flask_cors import CORS
import numpy as np
from core.generate import generate_audio
from core.get_models_list import get_models

from flask_socketio import SocketIO, emit
from dotenv import load_dotenv

load_dotenv()

from core.stt import transcribe_audio
from core.groqapi import get_llm_completion


app = Flask(
    __name__,
    static_url_path="/static",
    static_folder="dist",
)

socketio = SocketIO(
    app,
    cors_allowed_origins=[
        "http://localhost:5173",
        "http://localhost:5000",
    ],
)
CORS(app)


@app.route("/api/get_models_list")
def get_models_list():
    return get_models()


@app.route("/", defaults={"my_path": ""})
@app.route("/<path:my_path>")
def catch_all(my_path):
    if my_path and os.path.exists(os.path.join(app.static_folder, my_path)):
        return send_from_directory(app.static_folder, my_path)
    return send_from_directory(app.static_folder, "index.html")


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("audio_data")
def handle_audio_data(audio_data, history, model_names):
    prompt = transcribe_audio(audio_data, model=model_names["selectedSTT"]).strip()

    if not prompt:
        emit("no_prompt_recognised")
        return

    response = (
        get_llm_completion(
            history=history, prompt=prompt, model=model_names["selectedLLM"]
        )
        .choices[0]
        .message.content
    )

    audio_data, rate = generate_audio(response)

    emit("prompt_response", (prompt, response, audio_data.tolist(), rate))


if __name__ == "__main__":
    socketio.run(app, debug=True)
