from question_tuner import question_tuner
from question_classifier import question_classifier
from question_analyzer import question_analyzer
from sparql_gen import sparql_gen


def sparql_generator(question):
    question_layer_1 = question_classifier(question)
    print(question_layer_1)
    question_layer_2 = question_analyzer(question_layer_1)
    print(question_layer_2)
    question_layer_3 = question_tuner(question_layer_2)
    if isinstance(question_layer_3, dict):
        return sparql_gen(question_layer_3["output"], question_layer_3["type"])
    else:
        return "Không có dữ liệu liên quan đến {question_layer_3}"
