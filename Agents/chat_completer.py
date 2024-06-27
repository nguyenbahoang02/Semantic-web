import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def chat_completer(question, query_result):
    if query_result == "No result":
        return "Cơ sở dữ liệu của chúng tôi không có câu trả lời cho câu hỏi của bạn"
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": """Bạn là một chuyên gia trả lời câu hỏi và hoàn thiện câu, nhiệm vụ của bạn là từ thông tin
            được cấp hãy trả lời câu hỏi của người dùng 1 cách tự nhiên, chỉ được sử dụng thông tin được cấp để diễn đạt theo 1 cách khác 
            Nếu kết quả mảng query có độ dài = 5 và câu hỏi ở dạng hỏi liệt kê thì hãy nói thêm là đây chỉ là 1 vài kết quả 
            Nếu đường dẫn hãy thêm vào cho người dùng bấm để tham khảo
            KHÔNG ĐƯỢC SỬ DỤNG THÔNG TIN BÊN NGOÀI THÔNG TIN ĐƯỢC CUNG CẤP
            """},
            {"role": "user", "content": f"<question>{question}</question><query_result>{query_result}</query_result>"}
        ]
    )
    return response.choices[0].message.content
