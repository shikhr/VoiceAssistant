from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_completion(query: str):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "you are a helpful assistant who responds with short and concise answers.",
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
    return chat_completion.choices
