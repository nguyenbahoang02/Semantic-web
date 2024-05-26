import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def question_analyzer(question):
    if question["type"] == 1:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa thực thể gì, thuộc lớp gì và câu hỏi này hỏi về thuộc tính gì của thực thể đó
                1 số ví dụ: 
                [{
                    "question": "Trần Hưng Đạo mất ở đâu và vào ngày nào?",
                    "output": {
                    "name": "Trần Hưng Đạo",
                    "class": "nhân vật lịch sử(người)",
                    "out": {
                        "property": [
                        {
                            "key": "mất ở đâu",
                            "value": "địa điểm"
                        },
                        {
                            "key": "mất vào ngày",
                            "value": "thời gian"
                        }
                        ]
                    }
                    }
                },
                {
                    "question": "Lễ hội đền Hùng được tổ chức ở đâu ?",
                    "output": {
                    "name": "Lễ hội đền Hùng",
                    "class": "lễ hội",
                    "out": {
                        "property": [
                        {
                            "key": "tổ chức ở",
                            "value": "địa điểm"
                        }
                        ]
                    }
                    }
                }]
                Thuộc tính name của output là tên thực thể đã biết và class là lớp của thực thể đang được nhắc đến và property là list các thuộc tính đang được hỏi(có thể có nhiều cần hỏi)
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "name": "Trần Hưng Đạo",
                        "class": "nhân vật lịch sử(người)",
                        "out": {
                        "property": [
                            {
                            "key": "mất ở đâu",
                            "value": "địa điểm"
                            },
                            {
                            "key": "mất vào ngày",
                            "value": "thời gian"
                            }
                        ]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 2:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa thuộc tính và giá trị đã biết nào ? Thực thể đang được hỏi thuộc lớp nào ?
                1 số ví dụ: 
                [{
                    "question": "Có những lễ hội gì ở Hà Nội ?",
                    "output": {
                    "class": "lễ hội",
                    "in": { "property": [{ "key": "ở(được tổ chức ở)", "value": "Hà Nội" }] }
                    }
                },
                {
                    "question": "Ai mất vào ngày 2/9/1969",
                    "output": {
                    "class": "nhân vật lịch sử(người)",
                    "in": { "property": [{ "key": "mất vào ngày", "value": "2/9/1969" }] }
                    }
                }]
                Thuộc tính in của output là những thông tin đã biết và class là lớp của thực thể đang cần tìm(có thể có nhiều thuộc tính đã biết)
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "in": { "property": [{ "key": "mất vào ngày", "value": "2/9/1969" }] }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC  
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 3:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa thuộc tính và giá trị đã biết nào ? Hỏi về thuộc tính và giá trị nào ? Thực thể đang được hỏi thuộc lớp nào ?
                1 số ví dụ:
                [{
                    "question": "Nhân vật lịch sử mất vào ngày 2/9/1969 mất ở đâu ?",
                    "output": {
                        "class": "nhân vật lịch sử",
                        "in": { "property": [{ "key": "mất vào ngày", "value": "2/9/1969" }] },
                        "out": { "property": [{ "key": "mất ở đâu", "value": "địa điểm" }] }
                    }
                },
                {
                    "question": "Lễ hội tổ chức vào ngày 1/6 được tổ chức tại đâu",
                    "output": {
                        "class": "lễ hội",
                        "in": { "property": [{ "key": "tổ chức vào ngày", "value": "1/6" }] },
                        "out": { "property": [{ "key": "tổ chức tại", "value": "địa điểm" }] }
                    }
                }]
                Thuộc tính in của output là những thông tin đã biết còn out là những thông tin cần được biết và class là lớp của thực thể đang được nhắc đến(có thể có nhiều thuộc tính đã biết và cần hỏi)
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "class": "nhân vật lịch sử",
                        "in": { "property": [{ "key": "mất vào ngày", "value": "2/9/1969" }] },
                        "out": { "property": [{ "key": "mất ở đâu", "value": "địa điểm" }] }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
  
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 4:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa thực thể tên gì, thuộc lớp gì và thực thể đó có quan hệ thế thế nào với thực thể cần tìm 
                1 số ví dụ: 
                [{
                    "question": "Con của Trần Nhân Tông là ai ?",
                    "output": {
                        "name": "Trần Nhân Tông",
                        "class": "nhân vật lịch sử(người)",
                        "out": {
                            "property": [{ "key": "con", "value": "người, nhân vật lịch sử" }]
                        }
                    }
                },
                {
                    "question": "Bố của Đinh Tiên Hoàng là ai ?",
                    "output": {
                        "name": "Đinh Tiên Hoàng",
                        "class": "nhân vật lịch sử(người)",
                        "out": {
                            "property": [{ "key": "bố, cha", "value": "người, nhân vật lịch sử" }]
                        }
                    }
                }]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "name": "Đinh Tiên Hoàng",
                        "class": "nhân vật lịch sử(người)",
                        "out": {
                            "property": [{ "key": "bố, cha", "value": "người, nhân vật lịch sử" }]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 5:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa thực thể tên gì, thuộc lớp gì, liên hệ gì với thực thể cần tìm và cần thông tin thuộc tính và giá trị gì của thực thể cần tìm
                1 số ví dụ: 
                [{
                    "question": "Chồng bà Trưng Trắc có danh hiệu gì ?",
                    "output": {
                        "name": "Trưng Trắc",
                        "class": "nhân vật lịch sử(người)",
                        "relationship": "chồng",
                        "out": {
                            "property": [
                                { "key": "có danh hiệu,chức vụ", "value": "danh hiệu, chức vụ" }
                            ]
                        }
                    }
                },
                {
                    "question": "Con của Đinh Công Trứ có danh hiệu gì ?",
                    "output": {
                        "name": "Đinh Công Trứ",
                        "class": "nhân vật lịch sử(người)",
                        "relationship": "con",
                        "out": {
                            "property": [
                                { "key": "có danh hiệu,chức vụ", "value": "danh hiệu, chức vụ" }
                            ]
                        }
                    }
                }]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "name": "Đinh Công Trứ",
                        "class": "nhân vật lịch sử(người)",
                        "relationship": "con",
                        "out": {
                            "property": [
                                { "key": "có danh hiệu,chức vụ", "value": "danh hiệu, chức vụ" }
                            ]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 6:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng thể hiện thực thể đang cần tìm thuộc lớp gì, liên hệ gì với thực thể đã có thông tin và thực thể đã có thông tin có thuộc tính và giá trị đã biết nào ? 
                1 số ví dụ: 
                [{
                    "question": "Nhân vật lịch sử nào có con trai mất vào năm 979",
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "relationship": "bố(cha)",
                        "in": {
                            "property": [{ "key": "mất vào ngày, năm", "value": "979" }]
                        }
                    }
                },
                {
                    "question": "Lễ hội tổ chức ở Hà Nội ngày 26/5 tưởng nhớ nhân vật lịch sử nào ?",
                    "output": {
                        "class": "lễ hội",
                        "relationship": "tưởng nhớ(lễ hội tưởng nhớ nhân vật lịch sử)",
                        "in": {
                            "property": [
                                { "key": "tổ chức ở", "value": "Hà Nội" },
                                { "key": "tổ chức vào ngày", "value": "26/5" }
                            ]
                        }
                    }
                }]
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "relationship": "bố(cha)",
                        "in": {
                            "property": [
                                { "key": "mất vào ngày, năm", "value": "thời gian" }
                            ]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 7:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa tập đối tượng thuộc lớp gì và có đặc điểm chung gì ?
                1 số ví dụ: 
                [{
                    "question": "Vua Hùng có bao nhiêu người con ?",
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                            "in": {
                                "property": [{ "key": "bố, cha", "value": "Vua Hùng" }]
                            }
                    }
                },
                {
                    "question": "Có bao nhiêu lễ hội được tổ chức ở Hà Nội",
                    "output": {
                    "class": "lễ hội",
                        "in": {
                            "property": [{ "key": "tổ chức ở", "value": "Hà Nội" }]
                        }
                    }
                }
                ]
                Như ví dụ trên thì tập đối tượng các người con đều có bố là Vua Hùng 
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "in": {
                            "property": [
                                { "key": "bố, cha", "value": "Vua Hùng" }
                            ]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC  
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis
    if question["type"] == 8:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": """Bạn là một chuyên gia phân tích câu hỏi, nhiệm vụ của bạn là phân tích xem 
                câu hỏi của người dùng có chứa tập đối tượng thuộc lớp gì, có đặc điểm chung gì và thứ tự của đối tượng cần tìm trong tập ? 
                1 số ví dụ: 
                [{
                    "question": "Vị vua thứ hai của nước Đại Việt là ai ?",
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "index": "thứ 2",
                        "in": {
                            "property": [
                                { "key": "triều đại", "value": "Đại Việt" },
                                {"key": "chức vụ","value": "Vua"}
                            ]
                        }
                    }
                },
                {
                    "question": "Vị Hoàng đế sáng lập triều đại nhà Lê là ai ?",
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "index": "thứ nhất",
                        "in": {
                            "property": [
                                { "key": "triều đại", "value": "nhà Lê" },
                                {"key": "chức vụ","value": "Hoàng đế"}
                            ]
                        }
                    }
                }]
                Ở ví dụ thứ nhất tập các đối tượng là nhân vật lịch sử và đều có đặc điểm chung là có chức vụ là Vua và ở triều đại Nhà lê
                KẾT QUẢ CHỈ CẦN 1 JSONOBJECT VÍ DỤ 
                {
                    "question": "Vị Hoàng đế sáng lập triều đại nhà Lê là ai ?",
                    "output": {
                        "class": "nhân vật lịch sử(người)",
                        "index": "thứ nhất",
                        "in": {
                            "property": [
                                { "key": "triều đại", "value": "nhà Lê" },
                                { "key": "chức vụ", "value": "Hoàng đế" }
                            ]
                        }
                    }
                }
                VÀ KHÔNG THÊM BẤT CỨ THÔNG TIN GÌ KHÁC 
                """},
                {"role": "user", "content": question["question"]}
            ]
        )
        try:
            analysis = json.loads(response.choices[0].message.content)
            analysis["question"] = question["question"]
            analysis["type"] = question["type"]
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
        return analysis


print(question_analyzer(
    {"question": "Tên khác của Hồ Chí Minh là gì ?", "type": 1}))
