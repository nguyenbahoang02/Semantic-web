from class_identifier import class_identifier
from property_identifier import property_identifier
from timeInstant_tuner import timeInstant_tuner
from label_identifier import label_identifier
from index_tuner import index_tuner

def question_tuner(question):
    tuned_question = question
    tuned_question["output"]["class"] = class_identifier(
        question["output"]["class"])
    if 'name' in question["output"]:
        name = label_identifier(question["output"]["name"])
        if name != None:
            tuned_question["output"]["name"] = name
        else:
            return question["output"]["name"]
    if 'out' in question["output"]:
        props = []
        for prop in question["output"]["out"]["property"]:
            props.append({
                "key": property_identifier(prop["key"], tuned_question["output"]["class"]),
                "value": class_identifier(prop["value"])
            })
        tuned_question["output"]["out"]["property"] = props
    if 'relationship' in question["output"]:
        relationship = property_identifier(question["output"]["relationship"], tuned_question["output"]["class"])
        if relationship != None:
            tuned_question["output"]["relationship"] = relationship
        else:
            return question["output"]["relationship"]
    if 'in' in question["output"]:
        props = []
        for prop in question["output"]["in"]["property"]:
            value_class = class_identifier(prop["value"])
            if value_class == "timeInstant":
                value = timeInstant_tuner(question["question"], prop["value"])
                props.append({
                    "key": property_identifier(prop["key"], tuned_question["output"]["class"]),
                    "value": value
                })
            else:
                label_value = label_identifier(prop["value"])
                if label_value != None:
                    props.append({
                        "key": property_identifier(prop["key"], tuned_question["output"]["class"]),
                        "value": label_identifier(prop["value"])
                    })
                else:
                    return prop["value"]
        tuned_question["output"]["in"]["property"] = props
    if 'index' in question["output"]:
        index = index_tuner(question["question"], question["output"]["index"])
        if index != None:
            tuned_question["output"]["index"] = index
        else:
            return question["output"]["index"]
    return tuned_question


# print(question_tuner({'output': {'name': 'Hồ Chí Minh', 'class': 'nhân vật lịch sử(người)', 'out': {
#       'property': [{'key': 'tên khác', 'value': 'tên'}]}}, 'question': 'Tên khác của Hồ Chí Minh là gì ?', 'type': 1}))
