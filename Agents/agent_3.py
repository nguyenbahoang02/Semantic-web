import openai
import os
import json
from dotenv import load_dotenv
from langchain.tools import tool
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.tools.render import format_tool_to_openai_function
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def agent_3(user_input):

    def generate_query(user_input):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[{"role": "system", "content": """You are a helpful assistant and your mission is to generate SPARQL query 
                       equivalent to user question. Here are some instruction for you to follow:
                       {
                question: "Who is Hoang Dao Thuy ?",
                query: "SELECT DISTINCT ?description WHERE {
                    ?x a ontologies:HistoricalFigure.
                    ?x rdfs:label "Hoang Dao Thuy"@en.
                    ?x ontologies:description ?Statement.
                    ?Statement ontologies:_description ?description.
                    }",
        },
        When using rdfs:label the name of the thing user want to ask should be in right language @en for English and @vn for Vietnamese 
        Entities in this ontology are formatted like this:
        ontologies:NAME_OF_ENTITY ontologies:NAME_OF_PROPERTY ?Statement
        ?Statement ontologies:_NAME_OF_PROPERTY ?value_of_the_entity     
        And if the final value is a description you can stop generate the SPARQL
        But if it is not then you need to get its label using rdfs:label
        For example {
            question: "What festivals are there in Hanoi ?",
            query: `SELECT DISTINCT ?label WHERE {
                ?x a ontologies:Festival.
                ?x rdfs:label ?label.
                ?x ontologies:festivalPlace ?Statement.
                ?Statement ontologies:_festivalPlace ?place.
                ?place rdfs:label "Ha Noi city"@en.
                FILTER(lang(?label) = 'vn')
                }`,
        } 
        And the final label should be in vietnamese
        Here are more triple:
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?timeDescription.    
        ?timeDescription time:year ?year.
        And here are more property names: takePartIn, memorizePerson, sitePlace, festivalPlace, deathDate, birthDate...      
                       """},
                      {"role": "user", "content": f"Generate SPARQL query for this question <question>{user_input}</question>"}]
        )
        return response.choices[0].message.content
    
    return generate_query(user_input)

print(agent_3('Hồ Chí Minh sinh vào năm nào')) 