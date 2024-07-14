from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_llm_completion(history, prompt, model="llama3-8b-8192"):
    history = [
        {
            "role": "user" if msg["type"] == "prompt" else "assistant",
            "content": msg["content"],
        }
        for msg in history
    ]
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                you are a helpful voice assistant who responds with short, concise answers.
                respond in a conversational and friendly tone as if in speech. You have a personality, and add your own remarks in answers.
                all responses are converted to voice, and hence must not contain symbols or emojis or formatted in ways which will make voice unnatural.
                """,
            },
            *history,
            {"role": "user", "content": prompt},
        ],
        model=model,
        temperature=0.8,
        max_tokens=100,
        top_p=1,
        stop=None,
        stream=False,
    )
    return chat_completion


def get_whisper_stt(data):
    transcription = client.audio.transcriptions.create(
        file=("audio.wav", data),
        model="whisper-large-v3",
        response_format="json",  # Optional
        language="en",  # Optional
        temperature=0.0,  # Optional
    )
    return transcription.text
