import time
import threading
import numpy as np
from faster_whisper import WhisperModel
import sounddevice as sd


model_size = "base.en"


# stt = WhisperModel(model_size, device="cpu")
stt = WhisperModel(model_size, device="cpu", compute_type="float32")


def transcribe_audio(data):
    segments, info = stt.transcribe(data)
    segments = list(segments)
    if not segments:
        print("No segments found")
        return ""
    text = "".join([segment.text for segment in segments])
    return text
