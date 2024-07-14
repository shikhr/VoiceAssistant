import numpy as np
from faster_whisper import WhisperModel
import io
from .groqapi import get_whisper_stt
import soundfile as sf

model_size = "base.en"

stt = WhisperModel(model_size, device="cpu", compute_type="float32")


def transcribe_audio(data, model):
    audio_array = np.frombuffer(data, dtype=np.float32)

    if model == "whisper-base-local":
        segments, info = stt.transcribe(audio_array, language="en")
        segments = list(segments)
        text = "".join([segment.text for segment in segments])
    else:
        wav_data = get_wav_data(audio_array)
        text = get_whisper_stt(wav_data)

    if not text:
        return ""

    return text


def get_wav_data(audio_array):
    buffer = io.BytesIO()
    sf.write(buffer, audio_array, 16000, format="WAV")

    wav_data = buffer.getvalue()
    buffer.close()

    return wav_data
