import openai
import os
import json
from typing import Type
from dotenv import load_dotenv
from langchain.tools import tool, BaseTool
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools.render import format_tool_to_openai_function
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser
from pydantic import BaseModel, Field
from agent_2 import agent_2
from agent_3 import agent_3

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


class UserQuestion(BaseModel):
    """Inputs of user without any modifications"""
    user_input: str = Field(description="question")


class GenerateSPARQL(BaseTool):
    name = "generate_SPARQL"
    description = """
            Useful when you want to generate SPARQL query from question related to Vietnamese history like historical figures, events,sites and festivals. 
            """
    args_schema: Type[BaseModel] = UserQuestion

    def _run(self, user_input: str):
        result = agent_3(user_input)
        return result

    def _arun(self):
        raise NotImplementedError("...")


class AnswerQuestions(BaseTool):
    name = "answer_normal_questions"
    description = """
            Useful when you want to answers questions that cannot be answered by any other tools. 
            Do not use this tool when already use other tools"""
    args_schema: Type[BaseModel] = UserQuestion

    def _run(self, user_input: str):
        # result = agent_2(user_input)
        return "We don't have the information you need"

    def _arun(self):
        raise NotImplementedError("...")


tools = [GenerateSPARQL(), AnswerQuestions()]

llm_chat = ChatOpenAI(temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system",
     """You are an assistant that must choose existing tools to answer user questions
        Do not answer without using any tools"""),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

llm_with_tools = llm_chat.bind(
    functions=[format_tool_to_openai_function(t) for t in tools])

agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_function_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | llm_with_tools
    | OpenAIFunctionsAgentOutputParser())

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = agent_executor.invoke({"input": "An Dương Vương có những tên gì"})
print(result)
