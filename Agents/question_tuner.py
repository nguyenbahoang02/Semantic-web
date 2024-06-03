from class_identifier import class_identifier
from property_identifier import property_identifier
from timeInstant_tuner import timeInstant_tuner
from label_identifier import label_identifier


def question_tuner(question):
    tuned_question = question
    tuned_question["output"]["class"] = class_identifier(
        question["output"]["class"])
    if 'out' in question["output"]:
        props = []
        for prop in question["output"]["out"]["property"]:
            props.append({
                "key": property_identifier(prop["key"], tuned_question["output"]["class"]),
                "value": class_identifier(prop["value"])
            })
        tuned_question["output"]["out"]["property"] = props
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
    return tuned_question


# print(question_tuner({'output': {'name': 'Hồ Chí Minh', 'class': 'nhân vật lịch sử(người)', 'out': {
#       'property': [{'key': 'tên khác', 'value': 'tên'}]}}, 'question': 'Tên khác của Hồ Chí Minh là gì ?', 'type': 1}))
