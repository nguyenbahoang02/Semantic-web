import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def question_classifier(question):
    def first_layer_classifier(question):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                câu hỏi của người dùng vào 1 trong 3 loại sau đây: 
                1. Câu hỏi chứa 1 đối tượng A
                2. Câu hỏi chứa 2 đối tượng A và B (A và B có sự liên kết như quan hệ gia đình hoặc A xây B, A tham gia vào B, ...)
                3. Câu hỏi thống kê X [A1,A2,...,An]
                Lưu ý: các đối tượng trên là các đối tượng liên quan đến lịch sử ví dụ như: tên nước, triều đại, nhân vật lịch sử, sự kiện và lễ hội văn hóa
                1 số ví dụ: 
                [
                {
                    "question": "An Dương Vương mất năm bao nhiêu ?",
                    "output": 1
                },
                {
                    "question": "Ai mất năm 1970 ?",
                    "output": 1
                },
                {
                    "question": "Nhân vật lịch sử mất ngày 2/9/1969 mất ở đâu ?",
                    "output": 1
                },
                {
                    "question": "Trưng Trắc có em là ai ?",
                    "output": 2
                },
                {
                    "question": "Vợ của Trần Thánh Tông là ai ?",
                    "output": 2
                },
                {
                    "question": "Nhân vật xây di tích lịch sử Chùa Một Cột sinh năm bao nhiêu ?",
                    "output": 2
                },
                {
                    "question": "Nhân vật lịch sử mất ngày 15/8/1789 có em trai là ai ?",
                    "output": 2
                },
                {
                    "question": "Vua Hùng có bao nhiêu người con ?",
                    "output": 3
                },
                {
                    "question": "Có bao nhiêu lễ hội được tổ chức ở Hà Nội ?",
                    "output": 3
                },
                {
                    "question": "Vị vua thứ hai của triều Lý là ai ?",
                    "output": 3
                }
                ]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": 2 } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        return response.choices[0].message.content

    def second_layer_classifier_type_1(question):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                câu hỏi của người dùng vào 1 trong 3 loại sau đây: 
                Coi đối tượng là các đối tượng liên quan đến lịch sử ví dụ như: tên nước, triều đại, nhân vật lịch sử, sự kiện và lễ hội văn hóa
                1. Người dùng cung cấp tên đối tượng và yêu cầu thuộc tính của đối tượng
                2. Người dùng cung cấp thuộc tính của đối tượng và yêu cầu đối tượng 
                3. Người dùng cung cấp thuộc tính của đối tượng và yêu cầu thuộc tính khác của đối tượng
                1 số ví dụ: 
                [
                {
                    "question": "An Dương Vương mất năm bao nhiêu ?",
                    "output": 1
                },
                {
                    "question": "Hồ Chí Minh tên thật là gì ?",
                    "output": 1
                },
                {
                    "question": "Cao Bá Quát là ai ?",
                    "output": 1
                },
                {
                    "question": "Ai mất năm 1970 ?",
                    "output": 2
                },
                {
                    "question": "Ai sinh ra ở Hà Nội ?",
                    "output": 2
                },
                {
                    "question": "Nhân vật lịch sử mất ngày 2/9/1969 mất ở đâu ?",
                    "output": 3
                },
                {
                    "question": "Nhân vật lịch sử sinh ngày 10/5/1658 mất vào ngày nào ?",
                    "output": 3
                }
                ]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": 2 } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        return response.choices[0].message.content

    def second_layer_classifier_type_2(question):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                câu hỏi của người dùng vào 1 trong 3 loại sau đây: 
                Coi đối tượng là các đối tượng liên quan đến lịch sử ví dụ như: tên nước, triều đại, nhân vật lịch sử, sự kiện và lễ hội văn hóa
                1. Người dùng cung cấp tên 1 đối tượng và yêu cầu 1 đối tượng liên quan(2 đối tượng có quan hệ với nhau như vợ chồng, con cháu, bố mẹ,...)
                2. Người dùng cung cấp tên 1 đối tượng và yêu cầu thuộc tính của đối tượng liên quan 
                3. Người dùng cung cấp thuộc tính của 1 đối tượng và yêu cầu tên của đối tượng liên quan 
                4. Người dùng cung cấp thuộc tính của 1 đối tượng và yêu cầu thuộc tính của đối tượng liên quan
                1 số ví dụ: 
                [
                {
                    "question": "Trưng Trắc có em là ai ?",
                    "output": 1
                },
                {
                    "question": "Con của Trần Quốc Tuấn là ai ?",
                    "output": 1
                },
                {
                    "question": "Nhân vật xây di tích lịch sử Chùa Một Cột sinh năm bao nhiêu ?",
                    "output": 2
                },
                {
                    "question": "Con của Trần Quốc Tuấn sinh ngày bao nhiêu ?",
                    "output": 2
                },
                {
                    "question": "Nhân vật lịch sử mất ngày 15/8/1789 có em trai là ai ?",
                    "output": 3
                },
                {
                    "question": "Nhân vật lịch sử có con trai là Đinh Bộ Lĩnh có vợ là ai ?",
                    "output": 3
                },
                {
                    "question": "Nhân vật lịch sử mất ngày 15/8/1789 có em trai sinh năm bao nhiêu ?",
                    "output": 4
                },
                {
                    "question": "Nhân vật lịch sử có con trai là Đinh Bộ Lĩnh có vợ mất năm bao nhiêu ?",
                    "output": 4
                }
                ]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": 2 } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        return response.choices[0].message.content

    def second_layer_classifier_type_3(question):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                câu hỏi của người dùng vào 1 trong 3 loại sau đây: 
                Coi đối tượng là các đối tượng liên quan đến lịch sử ví dụ như: tên nước, triều đại, nhân vật lịch sử, sự kiện và lễ hội văn hóa
                1. Đếm số phần tử trong tập đối tượng 
                2. Xác định phần tử trong tập đối tượng khi biết số thứ tự của đối tượng 
                1 số ví dụ: 
                [
                {
                    "question": "Vua Hùng có bao nhiêu người con ?",
                    "output": 1
                },
                {
                    "question": "Có bao nhiêu lễ hội được tổ chức ở Hà Nội ?",
                    "output": 1
                },
                {
                    "question": "Vị vua thứ hai của nước Đại Việt là ai ?",
                    "output": 2
                },
                {
                    "question": "Vị Hoàng đế sáng lập triều đại nhà Lê là ai ?",
                    "output": 2
                }
                ]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": 2 } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        return response.choices[0].message.content
    first_layer_classified_result = first_layer_classifier(question)
    final_question_type = 0
    print(first_layer_classified_result)
    try:
        first_layer_classified_result_json = json.loads(
            first_layer_classified_result)
        question_type = first_layer_classified_result_json["output"]
        if question_type == 1:
            second_layer_classifier_result = second_layer_classifier_type_1(
                question)
            print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]
        if question_type == 2:
            second_layer_classifier_result = second_layer_classifier_type_2(
                question)
            print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]+3
        if question_type == 3:
            second_layer_classifier_result = second_layer_classifier_type_3(
                question)
            print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]+6
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")

    return {"question": question, "type": final_question_type}


# print(question_classifier("Vợ của Trần Thánh Tông là ai ?"))
