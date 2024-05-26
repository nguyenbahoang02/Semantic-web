from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import json


def read_json_objects_from_file(file_path):
    with open(file_path, 'r', encoding="utf8") as file:
        data = json.load(file)
    return data


labels = read_json_objects_from_file("labels.json")


def label_identifier(user_label):
    uppercase_user_label = user_label.upper()
    highest_score = 0
    for label in labels:
        score = fuzz.partial_ratio(uppercase_user_label, label.upper())
        if score > highest_score:
            highest_score = score
            best_label = label
    return best_label
