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
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là kiểm tra xem 
                câu hỏi của người dùng có vào bạn phụ trách không:
                Loại mà bạn phụ trách sẽ là câu hỏi thống kê số lượng đối tượng thuộc các lớp như nước, triều đại, người, sự kiện và lễ hội văn hóa
                Từ khóa để phân loại là "có bao nhiêu", "tìm xem có bao nhiêu", "tìm xem đối tượng là ai trong", "tìm xem đối tượng là gì trong", "trong số"
                và những từ chỉ thứ tự như thứ nhất, thứ hai, "đầu tiên", "cuối cùng", ...
                Nếu có những từ khóa trên thì trả lời yes
                Nếu không có từ khóa hoặc câu hỏi không phù hợp thì trả lời no
                Ví dụ phân tích:
                1. Có bao nhiêu nhân vật lịch sử sinh vào năm 1900 ? => có từ có bao nhiêu => yes
                2. Có bao nhiêu lễ hội được tổ chức ở thành phố Hồ Chí Minh ? => có từ có bao nhiêu => yes
                3. Nhân vật lịch sử nào mất cuối cùng năm 1969 ? => có từ khóa cuối cùng => yes 
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": yes/no } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        if "yes" in response.choices[0].message.content.lower():
            return """{"output": 3}"""
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là phân loại 
                câu hỏi của người dùng vào 1 trong 2 loại sau đây: 
                1. Câu hỏi chứa 1 đối tượng 
                2. Câu hỏi chứa 2 đối tượng A và B (A và B có sự liên kết như quan hệ gia đình hoặc A xây B, A tham gia vào B, ...)
                LƯU Ý: CÁC ĐỐI TƯỢNG TRÊN LÀ CÁC ĐỐI TƯỢNG LIÊN QUAN ĐẾN LỊCH SỬ VÍ DỤ NHƯ: TÊN NƯỚC, TRIỀU ĐẠI, NHÂN VẬT LỊCH SỬ, SỰ KIỆN VÀ LỄ HỘI VĂN HÓA, KHÔNG QUAN TÂM ĐẾN CÁC ĐỐI TƯỢNG THUỘC LỚP KHÁC
                Câu hỏi của người dùng sẽ xoay quanh các đối tượng thuộc các lớp như nước, triều đại, người, sự kiện và lễ hội văn hóa
                Nếu trong câu hỏi chỉ xoay quanh 1 đối tượng thì đưa vào loại 1
                Nếu trong câu hỏi có 2 đối tượng và có sự liên kết giữa chúng thì đưa vào loại 2. ví dụ như cha mẹ, vợ chồng, con cháu, xây dựng, tham gia vào, thờ cúng, ...
                Nếu trong câu hỏi có thống kê số lượng đối tượng hoặc tìm xem đối tượng là ai trong 1 danh sách đối tượng thì đưa vào loại 3
                Ví dụ phân tích: 
                1. Hoàng Hoa Thám mất vào ngày nào => chỉ xoay quanh 1 đối tượng => loại 1
                2. Hoàng Hoa Thám có chức vụ gì và sinh vào năm nào => chỉ xoay quanh 1 đối tượng => loại 1
                3. Hoàng Hoa Thám có con là ai ? => có 2 đối tượng là Hoàng Hoa Thám và con Hoàng Hoa Thám => loại 2
                4. Ai sinh vào năm 1969 ? => hỏi về đối tượng sinh năm 1969 => 1 đối tượng => loại 1
                5. Nhân vật lịch sử mất ngày 2/9/1969 mất ở đâu ? => hỏi xoay quanh 1 đối tượng => loại 1
                6. Vợ của Trần Thánh Tông là ai ? => có 2 đối tượng là Trần Thánh Tông và vợ Trần Thánh Tông => loại 2
                7. Nhân vật xây di tích lịch sử Chùa Một Cột sinh năm bao nhiêu ? => có 2 đối tượng là nhân vật xây di tích và Chùa Một Cột => loại 2
                8. Lễ hội Đền Thượng thờ nhân vật lịch sử nào ? => có 2 đối tượng là Lễ hội Đền Thượng và nhân vật lịch sử => loại 2
                9. Hội thả chim làng Dục Tú được tổ chức ở đâu và trong khoảng thời gian nào ? => có 1 đối tượng lễ hội => loại 1
                10. Nhân vật lịch sử nào sinh/mất năm x có chức vụ là y ? => có 1 đối tượng nhân vật lịch sử => loại 1
                11. Nhân vật lịch sử nào sinh ở x mất y ? => có 1 đối tượng nhân vật lịch sử => loại 1
                12. Lễ hội nào tổ chức trong khoảng thời gian x đến y tại z ? => có 1 đối tượng lễ hội => loại 1
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": loại } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        return response.choices[0].message.content

    def second_layer_classifier_type_1(question):
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là kiểm tra xem 
                câu hỏi của người dùng có vào bạn phụ trách không:
                Loại mà bạn phụ trách sẽ là tìm thông tin về 1 đối tượng thuộc các lớp như nước, triều đại, người, sự kiện và lễ hội văn hóa
                Nếu tên là địa điểm như xã quận huyện tỉnh thành phố thì trả lời no 
                Nếu trong câu không có tên thực thể thuộc các lớp trên thì trả lời no
                NẾU TRONG CÂU KHÔNG CÓ TÊN THỰC THỂ THUỘC CÁC LỚP TRÊN THÌ TRẢ LỜI NO
                ĐỐI TƯỢNG CÓ TÊN PHẢI LÀM CHỦ NGỮ THÌ MỚI TRẢ LỜI YES
                Ví dụ phân tích: 
                1. Hoàng Hoa Thám mất vào ngày nào ? => có tên thực thể Hoàng Hoa Thám => yes
                2. Nhân vật lịch sử mất ở Thành phố Điện Biên Phủ vào 13/3/1954 là ai ? => không có tên thực thể thuộc các lớp trên => no
                3. Lễ hội đền Hùng tổ chức ở đâu ? => có tên thực thể Lễ hội đền Hùng => yes
                4. Chùa Sùng Khánh nằm ở đâu ? => có tên thuộc lớp di tích => yes
                5. Nhân vật lịch sử có chức vụ Đại Tướng sinh ở Xã Lộc Thủy mất ở đâu ? => không có tên thực thể thuộc các lớp trên => no
                6. Lễ hội được tổ chức từ ngày 17/8 đến 20/8 âm lịch được tổ chức ở đâu ? => không có tên thực thể => no
                7. Lễ hội tổ chức ở Hà Nội thờ Lý Thường Kiệt được tổ chức trong khoảng thời gian nào ? => có tên Lý Thường Kiệt nhưng đối tượng chủ thể là Lễ hội => no
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": yes/no } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        if "yes" in response.choices[0].message.content.lower():
            return """{"output": 1}"""
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân loại câu hỏi, nhiệm vụ của bạn là kiểm tra xem 
                câu hỏi của người dùng có vào loại bạn phụ trách không:
                Loại bạn phụ trách sẽ là tìm kiếm tên đối tượng thuộc các lớp như nước, triều đại, người, sự kiện và lễ hội văn hóa dựa trên thông tin được cấp từ câu hỏi
                Nếu trong câu hỏi hỏi thuộc tính của đối tượng cần tìm thì trả lời no
                Nếu hỏi tên đối tượng là gì thì trả lời yes
                NẾU KHÔNG HỎI TÊN ĐỐI TƯỢNG LẬP TỨC TRẢ LỜI NO
                CÂU HỎI KHÔNG HỎI TÊN ĐỐI TƯỢNG THUỘC CÁC LỚP TRÊN THÌ TRẢ LỜI NO (ví dụ, nghề nghiệp, chức vụ, sinh, mất ở đâu, ngày nào, tổ chức tại, thời gian tổ chức, ...)
                Ví dụ phân tích: 
                1. Lễ hội nào tổ chức trong khoảng thời gian 16 đến 30 tháng 10 âm lịch tại Hà Nội ? => hỏi tên lễ hội => yes
                2. Lễ hội tổ chức ở Hà Nội tổ chức ngày bao nhiêu => hỏi thời gian tổ chức lễ hội => không hỏi tên => no 
                3. Nhân vật lịch sử nào mất ngày 6/9/1969 ở Thanh Hóa ? => hỏi tên nhân vật lịch sử => yes
                4. Lễ hội nào tổ chức trong khoảng thời gian 1 đến 6 tháng 10 âm lịch tại Tỉnh Ninh Bình ? => hỏi tên lễ hội => yes
                5. Nhân vật lịch sử mất ở Thành phố Điện Biên Phủ vào 13/3/1954 sinh vào ngày nào ? => hỏi nhân vật lịch sử sinh ngày nào => không hỏi tên => no
                6. Nhân vật lịch sử mất ngày 20/4/1996 ở thành phố hồ chí minh có chức vụ gì ? => hỏi chức vụ của nhân vật lịch sử => không hỏi tên => no
                7. Lễ hội được tổ chức từ ngày 17/8 đến 20/8 âm lịch được tổ chức ở đâu ? => hỏi tổ chức ở đâu => không hỏi tên => no
                8. Lễ hội tổ chức ở Hà Nội thờ Lý Thường Kiệt được tổ chức trong khoảng thời gian nào ? => hỏi tổ chức vào thời gian + ở đâu => không hỏi tên => no
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ { "output": yes/no } VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": f"{question}"}
            ]
        )
        if "yes" in response.choices[0].message.content:
            return """{"output": 2}"""
        return """{"output": 3}"""

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
                Nếu trong câu hỏi có từ khóa có bao nhiêu, đếm số, tính tổng => loại 1
                Nếu không có từ khóa thì là loại 2
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
    # print(first_layer_classified_result)
    try:
        first_layer_classified_result_json = json.loads(
            first_layer_classified_result)
        question_type = first_layer_classified_result_json["output"]
        if question_type == 1:
            second_layer_classifier_result = second_layer_classifier_type_1(
                question)
            # print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]
        if question_type == 2:
            second_layer_classifier_result = second_layer_classifier_type_2(
                question)
            # print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]+3
        if question_type == 3:
            second_layer_classifier_result = second_layer_classifier_type_3(
                question)
            # print(second_layer_classifier_result)
            second_layer_classified_result_json = json.loads(
                second_layer_classifier_result)
            final_question_type = second_layer_classified_result_json["output"]+6
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")

    return {"question": question, "type": final_question_type}


# print(question_classifier("Vợ của Trần Thánh Tông là ai ?"))
