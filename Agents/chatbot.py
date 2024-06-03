import openai
import os
import json
from dotenv import load_dotenv
from sparql_generator import sparql_generator

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def question_classifier(question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                xem câu hỏi của người dùng có liên quan đến lịch sử Việt Nam không: 
                1 số câu hỏi mẫu 
                [{ "question": "Lý Nam Đế mất năm bao nhiêu ?" },
                { "question": "Ai mất năm 1980 ?" },
                { "question": "Nhân vật lịch sử mất ngày 10/3/1960 mất ở đâu ?" },
                { "question": "Ngô Quyền có con là ai ?" },
                {
                    "question": "Nhân vật xây di tích lịch sử Văn Miếu - Quốc Tử Giám sinh năm bao nhiêu ?"
                },
                { "question": "Nhân vật lịch sử mất ngày 12/4/1800 có em trai là ai ?" },
                { "question": "Lý Thái Tổ có bao nhiêu người con ?" },
                { "question": "Có bao nhiêu lễ hội được tổ chức ở Thành phố Hồ Chí Minh ?" },
                { "question": "Vị vua thứ ba của triều Trần là ai ?" },
                { "question": "Nguyễn Trãi mất năm bao nhiêu ?" },
                { "question": "Ai mất năm 1990 ?" },
                { "question": "Nhân vật lịch sử mất ngày 1/5/1975 mất ở đâu ?" },
                { "question": "Ngô Quyền có con gái là ai ?" },
                { "question": "Nhân vật xây di tích lịch sử Tháp Rùa sinh năm bao nhiêu ?" },
                { "question": "Nhân vật lịch sử mất ngày 25/12/1900 có chị gái là ai ?" }]
                Nếu liên quan hãy trả lời "yes" không hay trả lời "no"
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
    print(123)


def start_conversation():
    question = "Lý Nam Đế mất năm bao nhiêu ?"
    is_related_to_history = question_classifier(question)
    if is_related_to_history == "yes":
        print(historical_related_chat(question))
    else:
        print(normal_chat(question))
