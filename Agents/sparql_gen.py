import re
from datetime import datetime
import json


def read_json_objects_from_file(file_path):
    with open(file_path, 'r', encoding="utf8") as file:
        data = json.load(file)
    return data


labels = read_json_objects_from_file("labels.json")


def is_mega_class(class_name):
    return class_name == "ontologies:AdministrativeDivision" or class_name == "ontologies:HistoricalFigure" or class_name == "ontologies:Site" or class_name == "ontologies:Festival" or class_name == "ontologies:PositionTitle" or class_name == "ontologies:HistoricEvent"


def is_label(string):
    return string in labels


def sparql_gen(output, question_type):
    prefix = """    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX ontologies: <https://tovie.vn/ontologies#>
    PREFIX time:<http://www.w3.org/2006/time#>
    """
    sparql = prefix

    if question_type == 1:
        select = "SELECT "
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"(SAMPLE(?{key_without_colon}Year{index}) AS ?{key_without_colon}Year{index}{index}) (SAMPLE(?{key_without_colon}Month{index}) AS ?{key_without_colon}Month{index}{index}) (SAMPLE(?{key_without_colon}Day{index}) AS ?{key_without_colon}Day{index}{index}) (SAMPLE(?{key_without_colon}Lunar{index}) AS ?{key_without_colon}Lunar{index}{index})"
                continue
            if "ontologies" in a_property["key"]:
                select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
            else:
                select += f"(SAMPLE(?{key_without_colon}{index}{index}) AS ?{key_without_colon}{index}{index}) "
        sparql += select
        sparql += f"""WHERE {{
            ?X rdfs:label "{output["name"]}"@vi.
            ?X a {output["class"]}.
            """
        filter_labels = []
        for index, a_property in enumerate(output["out"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and is_mega_class(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} rdfs:label ?{key_without_colon}Label{index}.
                """
                filter_labels.append(
                    f"""?{key_without_colon}Label{index}""")
                continue
            if "ontologies" in key and value == "timeInstant":
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} time:inDateTime ?OutProp{index}Description.
                OPTIONAL {{?OutProp{index}Description time:year ?{key_without_colon}Year{index}}}
                OPTIONAL {{?OutProp{index}Description time:month ?{key_without_colon}Month{index}}}
                OPTIONAL {{?OutProp{index}Description time:day ?{key_without_colon}Day{index}}}
                OPTIONAL {{?OutProp{index}Description time:hasTRS ?{key_without_colon}Lunar{index}}}
                """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
            if "ontologies" not in a_property["key"]:
                filter_labels.append(
                    f"""?{key_without_colon}{index}""")
                continue
        for index, filter_label in enumerate(filter_labels):
            if index == 0:
                sparql += "FILTER("
                sparql += f"lang({filter_label}) = 'vi' "
            else:
                sparql += f"&& lang({filter_label}) = 'vi'"
            if index == len(filter_labels) - 1:
                sparql += ")"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 2:
        select = f"""SELECT (SAMPLE(?XLabel) AS ?label) WHERE {{
            ?X rdfs:label ?XLabel.
            ?X a {output["class"]}.
        """
        sparql += select
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS <https://dbpedia.org/page/Lunar_calendar>."""
                continue
            if "ontologies" in key and is_label(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "FILTER(lang(?XLabel) = 'vi')"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 3:
        select = "SELECT "
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"(SAMPLE(?{key_without_colon}Year{index}) AS ?{key_without_colon}Year{index}{index}) (SAMPLE(?{key_without_colon}Month{index}) AS ?{key_without_colon}Month{index}{index}) (SAMPLE(?{key_without_colon}Day{index}) AS ?{key_without_colon}Day{index}{index}) (SAMPLE(?{key_without_colon}Lunar{index}) AS ?{key_without_colon}Lunar{index}{index})"
                continue
            if "ontologies" in a_property["key"]:
                select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
            else:
                select += f"(SAMPLE(?{key_without_colon}{index}{index}) AS ?{key_without_colon}{index}{index}) "
        sparql += select
        sparql += f"""WHERE {{
            ?X a {output["class"]}.
            """
        filter_labels = []
        for index, a_property in enumerate(output["out"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and is_mega_class(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} rdfs:label ?{key_without_colon}Label{index}.
                """
                filter_labels.append(
                    f"""?{key_without_colon}Label{index}""")
                continue
            if "ontologies" in key and value == "timeInstant":
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} time:inDateTime ?OutProp{index}Description.
                OPTIONAL {{?OutProp{index}Description time:year ?{key_without_colon}Year{index}}}
                OPTIONAL {{?OutProp{index}Description time:month ?{key_without_colon}Month{index}}}
                OPTIONAL {{?OutProp{index}Description time:day ?{key_without_colon}Day{index}}}
                OPTIONAL {{?OutProp{index}Description time:hasTRS ?{key_without_colon}Lunar{index}}}
                """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
            if "ontologies" not in a_property["key"]:
                filter_labels.append(
                    f"""?{key_without_colon}{index}""")
                continue
        for index, filter_label in enumerate(filter_labels):
            if index == 0:
                sparql += "FILTER("
                sparql += f"lang({filter_label}) = 'vi' "
            else:
                sparql += f"&& lang({filter_label}) = 'vi'"
            if index == len(filter_labels) - 1:
                sparql += ")"
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS <https://dbpedia.org/page/Lunar_calendar>."""
                continue
            if "ontologies" in key and is_label(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 4:
        select = "SELECT "
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
        sparql += select
        sparql += f"""WHERE {{
            ?X rdfs:label "{output["name"]}"@vi.
            ?X a {output["class"]}.
            """
        filter_labels = []
        for index, a_property in enumerate(output["out"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
            ?OutProp{index} rdfs:label ?{key_without_colon}Label{index}.
            """
            filter_labels.append(
                f"""?{key_without_colon}Label{index}""")
            continue
        for index, filter_label in enumerate(filter_labels):
            if index == 0:
                sparql += "FILTER("
                sparql += f"lang({filter_label}) = 'vi' "
            else:
                sparql += f"&& lang({filter_label}) = 'vi'"
            if index == len(filter_labels) - 1:
                sparql += ")"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 5:
        select = "SELECT "
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
        sparql += select
        sparql += f"""WHERE {{
            ?X rdfs:label "{output["name"]}"@vi.
            ?X a {output["class"]}."""
        relationship = output["relationship"]
        indirect_relationship = output["relationship"].replace(":", ":_")
        sparql += f"""
            ?X {relationship} ?YStatement.
            ?YStatement {indirect_relationship} ?Y.
        """
        filter_labels = []
        for index, a_property in enumerate(output["out"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            sparql += f"""?Y {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and is_mega_class(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} rdfs:label ?{key_without_colon}Label{index}.
                """
                filter_labels.append(
                    f"""?{key_without_colon}Label{index}""")
                continue
            if "ontologies" in key and value == "timeInstant":
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} time:inDateTime ?OutProp{index}Description.
                OPTIONAL {{?OutProp{index}Description time:year ?{key_without_colon}Year{index}}}
                OPTIONAL {{?OutProp{index}Description time:month ?{key_without_colon}Month{index}}}
                OPTIONAL {{?OutProp{index}Description time:day ?{key_without_colon}Day{index}}}
                OPTIONAL {{?OutProp{index}Description time:hasTRS ?{key_without_colon}Lunar{index}}}
                """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
            if "ontologies" not in a_property["key"]:
                filter_labels.append(
                    f"""?{key_without_colon}{index}""")
                continue
        for index, filter_label in enumerate(filter_labels):
            if index == 0:
                sparql += "FILTER("
                sparql += f"lang({filter_label}) = 'vi' "
            else:
                sparql += f"&& lang({filter_label}) = 'vi'"
            if index == len(filter_labels) - 1:
                sparql += ")"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 6:
        select = f"""SELECT (SAMPLE(?YLabel) AS ?label) WHERE {{
            ?X a {output["class"]}."""
        sparql += select
        relationship = output["relationship"]
        indirect_relationship = output["relationship"].replace(":", ":_")
        sparql += f"""
            ?X {relationship} ?YStatement.
            ?YStatement {indirect_relationship} ?Y.
            ?Y rdfs:label ?YLabel.
        """
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS <https://dbpedia.org/page/Lunar_calendar>."""
                continue
            if "ontologies" in key and is_label(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "FILTER(lang(?YLabel) = 'vi')"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 7:
        select = f"""SELECT (COUNT(?X) AS ?Total) WHERE {{
            """
        sparql += select
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS <https://dbpedia.org/page/Lunar_calendar>."""
                continue
            if "ontologies" in key and is_label(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        return sparql
    if question_type == 8:
        select = f"""SELECT (SAMPLE(?XLabel) AS ?label) WHERE {{
        ?X rdfs:label ?XLabel.
        ?X a {output["class"]}.
        """
        sparql += select
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
            """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                ?InProp{index} time:inDateTime ?InProp{index}Description.
                """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    ?InProp{index}Description time:year ?year.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    ?InProp{index}Description time:month ?month.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    ?InProp{index}Description time:day ?day.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS <https://dbpedia.org/page/Lunar_calendar>."""
                continue
            if "ontologies" in key and is_label(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                ?InProp{index} rdfs:label "{value}"@vi.
                """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue

        sparql += "FILTER(lang(?XLabel) = 'vi')"
        sparql += "}"
        sparql += f"""GROUP BY ?X
        """
        if output["index"] < 0:
            sparql += f"""ORDERBY DESC(?year) DESC(?month) DESC(?day)
        """
        else:
            sparql += f"""ORDERBY ASC(?year) ASC(?month) ASC(?day)
        """
        sparql += f"""LIMIT 1
        OFFSET {output["index"]}"""
        return sparql


# print(sparql_gen({
#     "class": "ontologies:HistoricalFigure",
#     "name": "Trần Hưng Đạo",
#     "out": {
#         "property": [
#             {
#                 "key": "ontologies:deathPlace",
#                 "value": "ontologies:AdministrativeDivision"
#             },
#             {
#                 "key": "ontologies:deathDate",
#                 "value": "timeInstant"
#             }
#         ]
#     }
# }, 1))
# print(sparql_gen({
#     "class": "ontologies:HistoricalFigure",
#     "in": {
#         "property": [
#             {
#                 "key": "ontologies:deathDate",
#                 "value": {
#                     "year": "1969",
#                     "month": None,
#                     "day": None,
#                     "isLunarCalendar": False
#                 }
#             },
#         ]
#     }
# }, 2))
# print(sparql_gen({
#     "class": "ontologies:HistoricalFigure",
#     "in": {
#         "property": [
#             {
#                 "key": "ontologies:deathDate",
#                 "value": {
#                     "year": "1969",
#                     "month": None,
#                     "day": None,
#                     "isLunarCalendar": False
#                 }
#             },
#         ]
#     },
#     "out": {
#         "property": [
#             {
#                 "key": "ontologies:positionTitle",
#                 "value": "ontologies:PositionTitle"
#             },
#         ]
#     }
# }, 3))
# print(sparql_gen({
#     "class": "ontologies:HistoricalFigure",
#     "index": 1,
#     "in": {
#         "property": [
#             {
#                 "key": "ontologies:deathDate",
#                 "value": {
#                     "year": "1969",
#                     "month": None,
#                     "day": None,
#                     "isLunarCalendar": False
#                 }
#             },
#         ]
#     },
# }, 8))