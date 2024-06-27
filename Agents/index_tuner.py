import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def index_tuner(question, rawIndex):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """Bạn là một chuyên gia phân tích thứ tự. 
                Nhiệm vụ của bạn là phân tích xem thứ tự của đối tượng trong tập đối tượng trong câu hỏi người dùng là gì:
                Ví dụ phân tích: 
                1. Nhân vật lịch sử nào mất cuối cùng năm 1969 ? => mất cuối cùng => index = "-0"
                2. Nhân vật lịch sử nào mất cuối cùng năm 1969 ? => mất đầu tiên => index = "0"
                3. Nhân vật lịch sử sinh thứ 2 năm 1995 là ai ? => thứ 2 => index = "1"
                4. Nhân vật lịch sử nào sinh thứ 3 từ dưới lên năm 1995 ? => thứ 3 từ dưới lên => index = "-2"
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {"output": index(số index, hãy để dạng string)} 
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                """},
                  {"role": "user", "content": f"<question>{question}</question>, <time>{rawIndex}</time>"}]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        return response_json["output"]
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
