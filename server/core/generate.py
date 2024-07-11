from .tts import TextToSpeechService

tts = TextToSpeechService()


def generate_audio(text):
    print("generating")
    sample_rate, audio_array = tts.synthesize(text)
    return sample_rate, audio_array
