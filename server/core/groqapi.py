from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_completion(query: str):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """
                you are a helpful voice assistant who responds with short, concise answers.
                respond in a conversational and friendly tone as if in speech.
                all responses are converted to voice, and hence must not contain symbols or formatted in ways which will make voice unnatural.
                """,
            },
            query,
        ],
        model="llama3-8b-8192",
        temperature=0.8,
        max_tokens=100,
        top_p=1,
        stop=None,
        stream=False,
    )
    return chat_completion
