from question_tuner import question_tuner
from question_classifier import question_classifier
from question_analyzer import question_analyzer
from sparql_gen import sparql_gen

question = "Nhân vật lịch sử mất ngày 2/9/1969 mất ở đâu ?"
question_layer_1 = question_classifier(question)
question_layer_2 = question_analyzer(question_layer_1)
question_layer_3 = question_tuner(question_layer_2)
print(sparql_gen(question_layer_3["output"], question_layer_3["type"]))
