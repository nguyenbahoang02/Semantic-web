import openai
import os
import json
import typing
import requests
from typing import List, Dict, Tuple, Union, Optional, Type, Any
import string
from string import Template
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import re
from chatbot import question_classifier, historical_related_chat, normal_chat

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


class LLM(BaseModel):
    model: str = "gpt-3.5-turbo-0125"

    def generate(self, prompt: str, stop: List[str] = None):
        response = openai.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            stop=stop
        )
        return response.choices[0].message.content


class BaseTool(BaseModel):
    name: str
    description_for_tool_agent: str
    description_for_retriever: str = None
    shortened_arg_schema: BaseModel = None
    full_arg_schema: BaseModel = None
    Attach_to_final_answer: str = None
    go_back_to_edit_input: str = None
    return_directly: bool = False
    use_input_agent_thought: bool = False
    json_input_schema: str = None
    dependencies: list = None

    def render_text_description_and_args(self) -> str:
        schema = self.shortened_arg_schema.schema_json()
        dict = json.loads(schema)
        converted_schema = dict.copy()
        del converted_schema["title"]
        del converted_schema["type"]
        des_and_args = f"{self.name}:{self.description_for_tool_agent}, args input:{converted_schema}"
        return des_and_args

    def render_text_description_and_args_by_json(self) -> str:
        des_and_args = f"{self.name}:{self.description_for_tool_agent}, args input:{self.json_input_schema}"
        return des_and_args

    def use(self, input_text: str, *kwarg, **kwargs) -> str:
        raise NotImplementedError("use() method not implemented")


class input_full(BaseModel):
    question: str = Field(..., description="Curious about you")


class introduce_myself(BaseTool):
    name: str = "introduce_myself"
    shortened_arg_schema: type[BaseModel] = input_full
    description_for_tool_agent: str = "Use when the user is curious to anything about you."

    def use(self, question: str):
        return """Xin chào! Tôi là CulturalTourism Bot — một chatbot AI được tạo ra để mang đến cho bạn những thông tin thú vị và chính xác về lịch sử Việt Nam.
                Vì tôi còn rất mới ở vị trí này, tôi chỉ có thể trả lời bạn về một số chủ đề giới hạn liên quan đến lịch sử nước nhà. Mong bạn thông cảm nếu có sai sót nào!
                Tôi sử dụng dữ liệu được thu thập từ nhiều nguồn đáng tin cậy về lịch sử Việt Nam để cung cấp cho bạn những thông tin hữu ích và chính xác nhất.
                Hãy cùng khám phá những trang sử hào hùng của dân tộc Việt Nam nhé!"""


class get_question_type(BaseTool):
    name: str = "get_question_type"
    description_for_tool_agent: str = "get question type"
    use_input_agent_thought: bool = True
    json_input_schema: str = """ {"properties": {
    "question": {
      "description": "user question without alteration",
      "type": "string"}
    }
     },"required": ["question"]}"""

    def use(self, question: str, **kwargs):
        output_struct = json.loads(question)
        user_question = output_struct.get("question")
        res = question_classifier(user_question)
        self.return_directly = False
        return "Question is related to Vietnamese history" if res == "yes" else "Question is not related to Vietnamese history"


class get_history_related_question_answer(BaseTool):
    name: str = "get_history_related_question_answer"
    description_for_tool_agent: str = "get answer for history related question"
    use_input_agent_thought: bool = True
    json_input_schema: str = """ {"properties": {
    "question": {
      "description": "user question without alteration",
      "type": "string"}
    }
     },"required": ["question"]}"""

    def use(self, question: str, **kwargs):
        output_struct = json.loads(question)
        user_question = output_struct.get("question")
        res = historical_related_chat(user_question)
        self.return_directly = False
        return res


class get_normal_question_answer(BaseTool):
    name: str = "get_normal_question_answer"
    description_for_tool_agent: str = "get answer for history non-related question"
    use_input_agent_thought: bool = True
    json_input_schema: str = """ {"properties": {
    "question": {
      "description": "user question without alteration",
      "type": "string"}
    }
     },"required": ["question"]}"""

    def use(self, question: str, **kwargs):
        output_struct = json.loads(question)
        user_question = output_struct.get("question")
        res = normal_chat(user_question)
        self.return_directly = False
        return res


class Agent_step(BaseModel):
    Thought: str = Field(default=None, description="think about what to do")
    Action: str = Field(...,
                        description="the action to take, must be one of tools")
    Action_input: str = Field(...,
                              description="the input to the action, to be sent to the tool")
    observation: typing.Any = Field(...,
                                    description="the result of the action")


FINAL_ANSWER_TOKEN = "Final Answer:"
OBSERVATION_TOKEN = "Observation:"
THOUGHT_TOKEN = "Thought:"
SYSTEM_TEMPLATE = """You are my assistant in Vietnamese history information domain.
You must not use fabricated data. If there is no real data, you must rely on data taken from the tool.
Please try your best to answer my question, you must use the following tools to collect more information IF NEEDED.
<TOOL>
$tool_description
</TOOL>
When selecting a tool or action, define your selection confidence based on the following scale:

- Certain: If the title, description, and input parameters (if any) closely match up to 100% and there is no ambiguity with other tools.
- High: If the title, description, and input parameters show a resemblance and there is no ambiguity with other tools.
- Low: If there is ambiguity...
- Very Low: If there is little to no match...

Only select a tool if the selection confidence is High or Certain. If the confidence is Low or Very Low, please choose Option 2.

You just have 2 Option.

- Option 1: only use it when the tool is needed.
For this, you MUST use the following format:{
Thought: you should always think about what to do. Carefully read the description and input parameters of the tool. For the required parameters, if you cannot find the them from the user request directly, you MUST try to use the other tools to obey the requirements.
Action: the action to take, must be one of $tool_names
Action Input: the input for the action, will be sent to the tool.
Observation: the result of the action}
... (this Thought/Action/Action Input/Observation can repeat multiple times).


- Option 2: you respond to the human with the final answer. Use when the tool is no longer needed.
For this, you MUST use the following format:{
Thought: Do I need a tool? NO. I now know the final answer.
Final Answer: the final answer to the original input question.
}
Begin!
$Additional_information_unknown_term
human question: $question

$previous_response
"""


def check_word_in_string(word: str, my_string: str):
    my_string = remove_punctuation(my_string)
    words_in_string = my_string.lower().split()
    return word.lower() in words_in_string


def return_elements_in_string(list: list, my_str: str):
    for item in list:
        if check_word_in_string(item, my_str):
            return item
    return None


def remove_punctuation(action):
    # Loại bỏ dấu `_` khỏi danh sách dấu câu
    punctuations = string.punctuation.replace("_", "")
    for punc in punctuations:
        action = action.replace(punc, "")
    return action


class Agent(BaseModel):
    llm: LLM = LLM()
    tools: List[BaseTool]
    prompt_template: str = SYSTEM_TEMPLATE
    max_loops: int = 4
    stop_pattern: List[str] = [
        f'\n{OBSERVATION_TOKEN}', f'\n\t{OBSERVATION_TOKEN}', "Observation:", "observation"]
    Additional_information: Union[str, list] = None

    @property
    def tool_description(self) -> str:
        return "\n".join([
            f"{tool.render_text_description_and_args()}" if tool.json_input_schema is None else f"{tool.render_text_description_and_args_by_json()}"
            for tool in self.tools])

    @property
    def tool_names(self) -> str:
        return ",".join([tool.name for tool in self.tools])

    @property
    def list_tool_names(self) -> list:
        list_tool = []
        for tool in self.tools:
            list_tool.append(tool.name)
        return list_tool

    @property
    def tool_by_names(self) -> Dict[str, BaseTool]:
        return {tool.name: tool for tool in self.tools}

    def process_tool_name(self, toolname: str):
        return (re.sub(r'[^a-zA-Z]', '', toolname)).lower()

    def run(self, question: str):
        num_loops = 0
        prompt = Template(self.prompt_template)
        prompt = Template(self.prompt_template).substitute(
            tool_description=self.tool_description,
            tool_names=self.tool_names,
            question=question,
            previous_response="$previous_responses",
            Additional_information_unknown_term=f"Additional_information:{self.Additional_information}"
            if self.Additional_information is not None else ""
        )
        list_agent_step = []
        while num_loops < self.max_loops:
            num_loops += 1
            # print(
            #     f"<LOOP_START>\n[bold]The current iteration: {num_loops}[/bold]")

            Intermediate_Steps = self.building_prompt(list_agent_step)
            curr_prompt = Template(prompt).substitute(
                previous_responses=Intermediate_Steps)
            generated, tool, tool_input = self.plan(curr_prompt)
            # print(f"Generated : {generated}")
            if tool.lower() == 'final answer':
                # print(f'<FINAL_ANSWER>{generated}</FINAL_ANSWER>')

                if not list_agent_step:
                    # print(f'<ko dung tool>')
                    return tool_input

                final_tool = list_agent_step[-1].Action
                for tool_name_agent, tool_agent in self.tool_by_names.items():
                    if final_tool == tool_name_agent:
                        if tool_agent.return_directly:
                            tool_input = str(list_agent_step[-1].observation)
                        if tool_agent.Attach_to_final_answer is not None:
                            return tool_input + "\n" + tool_agent.Attach_to_final_answer

                return tool_input

            tool = self.parse_tool_name(tool)
            # print(f"tool {tool}")
            loop_tool_error = 0
            while tool is None:
                # print("im try again to parser a tool")
                generated, tool, tool_input = self.plan(curr_prompt)
                tool = self.parse_tool_name(tool)
                loop_tool_error += 1
                if loop_tool_error > 3:
                    print(f"Unknown tool: {tool}")
            for tool_name, action_tool in self.tool_by_names.items():
                if self.process_tool_name(tool_name) == self.process_tool_name(tool):
                    # print("TOOL_INPUT:" + tool_input)
                    tool_input = tool_input.replace("'", '"')
                    # print("TOOL_INPUT after:" + tool_input)

                    if not action_tool.use_input_agent_thought:
                        tool_result = self.tool_by_names[tool_name].use(
                            question)
                    else:
                        tool_result = self.tool_by_names[tool_name].use(
                            tool_input)

                    # print(f"<TOOL_RESULT>\n{str(tool_result)}\n</TOOL_RESULT>")

                    agent_step = self._parse_agent_step(
                        generated, tool_result, tool_name)

                    if action_tool.go_back_to_edit_input is not None:
                        agent_step.Action_input = str(
                            action_tool.go_back_to_edit_input)

                    list_agent_step.append(agent_step)
                    break

            # print("</LOOP_END>")

    def plan(self, prompt: str) -> tuple[Any, Any, Any]:
        generated = self.llm.generate(prompt, stop=self.stop_pattern)
        # print(f'<RAW_RESPONSE>\n{generated}\n</RAW_RESPONSE>')
        response = self._parse(generated)
        # print(f'<REFINED_RESPONSE>\n{response}\n</REFINED_RESPONSE>')
        loop = 0

        while isinstance(response, str):
            # print(f"[b]Found error when parsing response: {response}[/b]")
            generated = self.llm.generate(prompt, stop=self.stop_pattern)
            response = self._parse(generated)
            loop += 1
            if loop > 3:
                print(f'Cannot parse response!')

        tool, tool_input = self._parse(generated)
        # print(
        #     f'<PLAN_RESULT>\nGenerated: {generated}\nTool: {tool}\nTool Input: {tool_input}\n</PLAN_RESULT>')
        return generated, tool, tool_input

    def _parse(self, generated: str) -> Union[Tuple[str, str], str]:
        if FINAL_ANSWER_TOKEN.lower() in generated.lower():
            # print("[bold]Found final answer in parse function[/bold]")
            return "Final Answer", generated.split(FINAL_ANSWER_TOKEN)[-1].strip()

        regex = r"Action: [\[]?(.*?)[\]]?[\n]*Action Input:[\s]*(.*)"
        match = re.search(regex, generated, re.DOTALL | re.IGNORECASE)

        if not match:
            # print("ERROR OUTPUT PARSER:" + generated)
            return "ERROR OUTPUT"

        tool = match.group(1).strip()
        tool_input = match.group(2)
        tool_input = tool_input.strip(" ").strip('"')
        tool_input_refine = self.parse_tool_input(tool_input)

        return tool, tool_input_refine

    def _parse_agent_step(self, generated: str, tool_result, tool_name) -> tuple[str, str] | str | Agent_step:
        if FINAL_ANSWER_TOKEN.lower() in generated.lower():
            return "Final Answer", generated.split(FINAL_ANSWER_TOKEN)[-1].strip()

        regex = r"[\n]*[\[]?(Thought)?[\]]?:?[\]]?[\n]?\s?[\[]?(.*?)[\]]?[\n]*Action: [\[]?(.*?)[\]]?[\n]*Action Input:[\s]*(.*)"
        process = re.search(regex, generated, re.DOTALL | re.IGNORECASE)

        if not process:
            # print("ERROR OUTPUT PARSER:" + generated)
            return "ERROR OUTPUT"

        thought = process.group(2).strip()
        tool = process.group(3).strip()
        tool_input = process.group(4).strip(" ").strip('"')
        tool_input_refine = self.parse_tool_input(tool_input)

        return Agent_step(Thought=thought, Action=tool_name, Action_input=tool_input_refine, observation=tool_result)

    def building_prompt(self, list_step: list[Agent_step]) -> str:
        Intermediate_Steps = ""

        for step in list_step:
            Intermediate_Steps += f"\nThought: {step.Thought}\nAction: {step.Action}\nAction Input: {step.Action_input}\nObservation: {step.observation}"

        Intermediate_Steps += "\nThought: "

        return Intermediate_Steps

    def parse_tool_name(self, tool_agent_gen: str):
        return return_elements_in_string(self.list_tool_names, tool_agent_gen)

    def parse_tool_input(self, action_input: str):
        json_instance_pattern = r'{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*}'
        json_instances = re.findall(json_instance_pattern, action_input)

        last_json_instance = json_instances[-1]
        return last_json_instance


def start_conversation(question):
    agent = Agent(tools=[get_question_type(), get_history_related_question_answer(
    ), get_normal_question_answer(), introduce_myself()])

    return agent.run(question)
