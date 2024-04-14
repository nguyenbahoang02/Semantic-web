import openai
import os
import json
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools.render import format_tool_to_openai_function
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def agent_2(user_input):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": "You are a helpful assistant"},
                  {"role": "user", "content": user_input}]
    )
    return response.choices[0].message.content
