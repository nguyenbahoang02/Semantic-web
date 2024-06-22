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

    def generate(self, prompt: str, stop: List[str] = None, history: List[str] = None):
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
    description_for_tool_agent: str = "Dùng khi người dùng muốn biết thông tin về bạn."

    def use(self, question: str):
        return """Xin chào! Tôi là CulturalTourism Bot — một chatbot AI được tạo ra để mang đến cho bạn những thông tin thú vị và chính xác về lịch sử Việt Nam.
                Vì tôi còn rất mới ở vị trí này, tôi chỉ có thể trả lời bạn về một số chủ đề giới hạn liên quan đến lịch sử nước nhà. Mong bạn thông cảm nếu có sai sót nào!
                Tôi sử dụng dữ liệu được thu thập từ nhiều nguồn đáng tin cậy về lịch sử Việt Nam để cung cấp cho bạn những thông tin hữu ích và chính xác nhất.
                Hãy cùng khám phá những trang sử hào hùng của dân tộc Việt Nam nhé!"""


class get_question_type(BaseTool):
    name: str = "get_question_type"
    description_for_tool_agent: str = "Dùng khi muốn xác định loại câu hỏi"
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
    description_for_tool_agent: str = "Dùng để trả lời câu hỏi liên quan đến lịch sử"
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
    description_for_tool_agent: str = "Dùng để trả lời câu hỏi không liên quan đến lịch sử"
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
SYSTEM_TEMPLATE = """Bạn là trợ lý giúp tôi trả lời câu hỏi về lịch sử Việt Nam.
Bạn không được bịa thông tin. Nếu không có thông tin thật, bạn phải sử dụng các tool để lấy thông tin.
Hãy cố gắng để trả lời được câu hỏi của tôi, bạn phải sử dụng các tool sau đây để trả lời câu hỏi NẾU CẦN THIẾT.
<TOOL>
$tool_description
</TOOL>
Khi lựa chọn 1 tool hay action, dưới đây là định nghĩa về mức độ tin cậy trong lựa chọn của bạn dựa trên thang đo sau:

 - Chắc chắn: Nếu tiêu đề, mô tả, và các tham số đầu vào (nếu có) hoàn toàn khớp với nhau đến 100% và không có sự mơ hồ với các tool khác.
 - Cao: Nếu tiêu đề, mô tả, và các tham số đầu vào có sự tương đồng và không có sự mơ hồ với các tool khác.
 - Thấp: Nếu có sự mơ hồ...
 - Rất thấp: Nếu có rất ít hoặc không có sự khớp nhau...

Chỉ chọn một công cụ nếu mức độ tin cậy của lựa chọn là Cao hoặc Chắc chắn. Nếu mức độ tin cậy là Thấp hoặc Rất thấp, vui lòng chọn Phương án 2.

Bạn chỉ có 2 phương án.

- Phương án 1: chỉ sử dụng khi cần đến tool.
Khi sử dụng phương án, bạn phải trả lời theo format sau:{
Thought: bạn luôn phải nghĩ xem phải làm gì. Cẩn thận đọc kỹ phần mô tả và tham số truyền vào của tool. Đối với các tham số yêu cầu, nếu bạn không thể tìm thấy chúng trực tiếp từ yêu cầu của người dùng, BẠN PHẢI cố gắng sử dụng các công cụ khác để tuân thủ các yêu cầu.
Action: hành động cần làm, phải là 1 trong những $tool_names
Action Input: input của hành động, dùng làm tham số truyền đến tool.
Observation: kết quả hành động}
... (việc Thought/Action/Action Input/Observation có thể lặp lại nhiều lần).


- Phương án 2: bạn trả lời câu hỏi cho người dùng. Dùng khi không còn cần dùng tool.
Khi sử dụng phương án, bạn phải trả lời theo format sau:{
Thought: Tôi có cần tool không? KHÔNG. Tôi đã biết câu trả lời.
Final Answer: câu trả lời cho câu hỏi gốc của người dùng.
}
Bắt đầu!
$Additional_information_unknown_term
câu hỏi người dùng: $question

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
        generated = self.llm.generate(prompt=prompt, stop=self.stop_pattern)
        # print(f'<RAW_RESPONSE>\n{generated}\n</RAW_RESPONSE>')
        response = self._parse(generated)
        # print(f'<REFINED_RESPONSE>\n{response}\n</REFINED_RESPONSE>')
        loop = 0

        while isinstance(response, str):
            # print(f"[b]Found error when parsing response: {response}[/b]")
            generated = self.llm.generate(prompt=prompt, stop=self.stop_pattern)
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
