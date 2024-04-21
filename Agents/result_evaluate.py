import openai
import requests 
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def result_evaluate(query, question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """You are a helpful assistant that evaluate the input query if it is equivalent to the question
                    Output must be a True or False and nothing else"""},
                    {"role": "user", "content": f"""Does this question equivalent to this query
                    {{
                    "question": {question},
                    "query": {query}
                    }}
                    """}]
    )
    return response.choices[0].message.content
