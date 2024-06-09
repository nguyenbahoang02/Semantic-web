import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def query_evaluator(question,query):
    no_prefix_query = query[query.upper().find("SELECT"):]
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": """Bạn là một chuyên gia đánh giá câu hỏi, nhiệm vụ của bạn là đánh giá 
            xem câu sparql có tương đương với câu hỏi không: 
                Nếu tương đương hãy trả lời "yes" không hay trả lời "no"
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": "yes" } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
            {"role": "user", "content": f"<question>{question}</question><query>{no_prefix_query}</query>"}
        ]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        return response_json["output"]
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")