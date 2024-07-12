import wave
from balacoon_tts import TTS


class TextToSpeechService:
    def __init__(self, model_path: str):
        self.btts = TTS(model_path)
        supported_speakers = self.btts.get_speakers()
        self.speaker = supported_speakers[-1]

    def synthesize(self, text: str):
        samples = self.btts.synthesize(text, self.speaker)

        return samples, self.btts.get_sampling_rate()
