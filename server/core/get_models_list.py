import requests
import os

api_key = os.getenv("GROQ_API_KEY")

url = "https://api.groq.com/openai/v1/models"


headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

models_list = None


def get_models():
    global models_list
    if models_list is None:
        response = requests.get(url, headers=headers)
        models_list = response.json()
    return models_list
