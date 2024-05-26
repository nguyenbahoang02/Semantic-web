import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def class_identifier(natural_language_name):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """Bạn là một chuyên gia phân loại lớp dựa theo ngôn ngữ tự nhiên. Hãy phân loại câu dưới đây vào 1 trong các lớp sau:
                ontologies:HistoricalFigure: nhân vật lịch sử(người)
                ontologies:Site: di tích lịch sử 
                ontologies:AdministrativeDivision: đơn vị hành chính, ví dụ như thành phố, quận huyện, tỉnh, cũng là địa điểm
                ontologies:Festival: lễ hội 
                ontologies:PositionTitle: chức vụ của nhân vật lịch sử, hoàng đế, vua, quan, ...
                timeInstant: thời gian
                string: 1 xâu, là string nếu ko phải là lớp nào ở trên
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": "ontologies:HistoricalFigure"} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                """},
                  {"role": "user", "content": natural_language_name}]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        return response_json["output"]
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")


# print(class_identifier("hoàng đế"))
