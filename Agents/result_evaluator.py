import openai
import requests 
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def result_evaluator(answer, question):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """Bạn là chuyên gia nhận định câu hỏi và câu trả lời, nhiệm vụ của bạn là
                   kiểm tra xem kết quả truy vấn được đưa ra có ứng với câu hỏi hay không. 
                   Bạn chỉ cần trả lời yes hoặc no, không cần thêm bất cứ thông tin gì khác!"""},
                    {"role": "user", "content": f"""Kết quả truy vấn sau có đáp ứng được câu hỏi của người dùng không?
                    {{
                    "question": {question},
                    "answer": {answer}
                    }}
                    """}]
    )
    return response.choices[0].message.content
