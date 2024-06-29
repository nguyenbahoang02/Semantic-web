from question_tuner import question_tuner
from question_classifier import question_classifier
from question_analyzer import question_analyzer
from sparql_gen import sparql_gen


def sparql_generator(question, chat_history):
    maximum_classifier_count = 3
    classifier_count = 0
    question_type = []
    while classifier_count < maximum_classifier_count:
        question_layer_1 = question_classifier(question,question_type, chat_history)
        question_type.append(str(question_layer_1["type"]))
        print(question_layer_1)
        question_layer_2 = question_analyzer(question_layer_1, chat_history)
        print(question_layer_2)
        question_layer_3 = question_tuner(question_layer_2)
        print(question_layer_3)
        if isinstance(question_layer_3, dict):
            return sparql_gen(question_layer_3["output"], question_layer_3["type"])
            
    return f"Không có dữ liệu"

# print(sparql_generator("Giới thiệu về Hồ Chí Minh"))