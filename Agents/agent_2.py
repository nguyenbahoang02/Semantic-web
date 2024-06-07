import openai
import os
import json
from dotenv import load_dotenv


load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def agent_2(user_input):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": "You are a helpful assistant"},
                  {"role": "user", "content": user_input}]
    )
    return response.choices[0].message.content
