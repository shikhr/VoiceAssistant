from .tts import TextToSpeechService
import numpy as np

tts = TextToSpeechService(model_path="models/en_us_hifi92_light_cpu.addon")


def generate_audio(text):
    data, rate = tts.synthesize(text)
    audio_float32 = data.astype(np.float32) / 32768.0
    return audio_float32, rate
