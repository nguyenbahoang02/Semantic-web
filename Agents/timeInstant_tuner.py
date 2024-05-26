import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def timeInstant_tuner(question, rawTime):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """Bạn là một chuyên gia phân tích thời gian dựa trên câu hỏi người dùng. 
                Nhiệm vụ của bạn là tách thời gian trong câu hỏi người dùng theo đúng format dưới đây:
                1 số ví dụ: 
                [{
                    "question": "Ai mất năm 1970 ?",
                    "output": {
                        "year": "1970",
                        "month": null,
                        "day": null,
                        "isLunarCalendar": false
                    }
                },
                {
                    "question": "Lễ hội nào tổ chức vào 10/3 âm lịch ?",
                    "output": {
                        "year": null,
                        "month": "3",
                        "day": "10",
                        "isLunarCalendar": true
                    }
                }]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": {
                   "year": "1969",
                   "month": "10",
                   "day": null,
                   "isLunarCalendar": false
                }} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                """},
                  {"role": "user", "content": f"<question>{question}</question>, <time>{rawTime}</time>"}]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        return response_json["output"]
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
