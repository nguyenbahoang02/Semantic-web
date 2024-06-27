from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def read_json_objects_from_file(file_path):
    with open(file_path, 'r', encoding="utf8") as file:
        data = json.load(file)
    return data


labels = read_json_objects_from_file("labels.json")


def label_identifier(user_label):
    uppercase_user_label = user_label.upper()
    highest_score = 0
    for label in labels:
        if label.lower() == user_label.lower():
            return label
    for label in labels:
        score = fuzz.partial_ratio(uppercase_user_label, label.upper())
        if score > highest_score:
            highest_score = score
            best_label = label
    # print(highest_score)
    if highest_score == 100:
        return best_label
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[{"role": "system", "content": """Bạn là một chuyên gia phân tích xem 2 label user đưa ra có phải là 1 hay không
            1 số ví dụ:
            [{
                "question": "Nguyễn Gia Khang và Nguyễn Gia Phan",
                "output": "no"
            },
            {
                "question": "Thành phố Hà Nội và Hanoi",
                "output": "yes"
            }]
            KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": "yes"} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
            """},
                  {"role": "user", "content": f"""{user_label} và{best_label}"""}]
    )
    try:
        response_json = json.loads(response.choices[0].message.content)
        if response_json["output"] == "no":
            return None
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
    # print(best_label)
    return best_label


# print(label_identifier("Lễ hội Chọi trâu Hải Lựu"))
