import openai
import os
import json
from dotenv import load_dotenv
from sparql_generator import sparql_generator
from query_evaluator import query_evaluator
from query_executor import query_executor
from chat_completer import chat_completer
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def question_classifier(question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                xem câu hỏi của người dùng có liên quan đến lịch sử Việt Nam không: 
                Nếu liên quan đến lịch sử Việt Nam hãy trả lời "yes" không hay trả lời "no"
                Nếu có xuất hiện tên người hay sự kiện lịch sử hoặc lễ hội thì trả lời yes 
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": "yes" } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
            {"role": "user", "content": f"{question}"}
        ]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        return response_json["output"]
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")


def normal_chat(question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": """Bạn là hệ thống trả lời câu hỏi người dùng 1 cách thân thiện 
                """},
            {"role": "user", "content": f"{question}"}
        ]
    )
    return response.choices[0].message.content


def historical_related_chat(question):
    query = sparql_generator(question)
    if query[0] == "K":
            return query
    else:
        if query_evaluator(question, query) == "yes":
            query_result = query_executor(query)
            print(query_result)
            return chat_completer(question, query_result)
        else:
            return "Không có dữ liệu cho câu hỏi của bạn"


def start_conversation(question):
    print(question)
    is_related_to_history = question_classifier(question)
    if is_related_to_history == "yes":
        print("Câu hỏi lịch sử")
        return historical_related_chat(question)
    else:
        print("Câu hỏi thông thường")
        return normal_chat(question)
