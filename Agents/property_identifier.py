import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def property_identifier(natural_language_property, class_name):
    if class_name == "ontologies:HistoricalFigure":
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[{"role": "system", "content": """Bạn là một chuyên gia phân loại lớp dựa theo ngôn ngữ tự nhiên.Hãy phân câu dưới đây vào 1 trong các thuộc tính sau:
                    ontologies:deathPlace: mất ở, mất tại 
                    ontologies:deathDate: mất vào ngày, mất vào lúc 
                    ontologies:birthPlace: được sinh ra ở, sinh ra tại
                    ontologies:birthDate: được sinh vào ngày, vào lúc 
                    ontologies:takePartIn: tham gia vào sự kiện
                    rdfs:label: tên, tên khác
                    ontologies:positionTitle: có chức vụ, giữ chức vụ
                    ontologies:description: có mô tả, giới thiệu 
                    ontologies:hasFather: có cha là
                    ontologies:hasHusband: có chồng là
                    ontologies:hasOlderBrother: có anh trai là
                    ontologies:hasOlderSister: có chị gái là
                    ontologies:hasYoungerBrother: có em trai là
                    ontologies:hasChild: có con là 
                    KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": "ontologies:deathPlace"} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                    """},
                      {"role": "user", "content": natural_language_property}]
        )
        try:
            response_json = json.loads(response.choices[0].message.content)
            return response_json["output"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
    if class_name == "ontologies:Site":
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[{"role": "system", "content": """Bạn là một chuyên gia phân loại lớp dựa theo ngôn ngữ tự nhiên.Hãy phân câu dưới đây vào 1 trong các thuộc tính sau:
                    ontologies:memorizePerson: thờ, tưởng niệm
                    ontologies:sitePlace: nằm ở, nằm tại 
                    KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": "ontologies:memorizePerson"} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                    """},
                      {"role": "user", "content": natural_language_property}]
        )
        try:
            response_json = json.loads(response.choices[0].message.content)
            return response_json["output"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
    if class_name == "ontologies:Festival":
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[{"role": "system", "content": """Bạn là một chuyên gia phân loại lớp dựa theo ngôn ngữ tự nhiên.Hãy phân câu dưới đây vào 1 trong các thuộc tính sau:
                    ontologies:festivalPlace: nằm ở, nằm tại, tổ chức ở
                    ontologies:description: mô tả, giới thiệu
                    KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ {"output": "ontologies:festivalPlace"} VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC
                    """},
                      {"role": "user", "content": natural_language_property}]
        )
        try:
            response_json = json.loads(response.choices[0].message.content)
            return response_json["output"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")


# print(class_identifier("hoàng đế"))
