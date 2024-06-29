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
    PREFIX ontologies: <https://CHeVIE.vn/ontologies/>
    PREFIX time:<http://www.w3.org/2006/time#>
    """
    sparql = prefix
    if question_type == 1:
        select = "SELECT ?X"
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"(SAMPLE(?{key_without_colon}Year{index}) AS ?{key_without_colon}Year{index}{index}) (SAMPLE(?{key_without_colon}Month{index}) AS ?{key_without_colon}Month{index}{index}) (SAMPLE(?{key_without_colon}Day{index}) AS ?{key_without_colon}Day{index}{index}) (SAMPLE(?{key_without_colon}Lunar{index}) AS ?{key_without_colon}Lunar{index}{index})"
                continue
            if "ontologies" in a_property["key"]:
                select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
            else:
                select += f"(SAMPLE(?{key_without_colon}{index}) AS ?{key_without_colon}{index}{index}) "
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
        select = f"""SELECT ?X (SAMPLE(?XLabel) AS ?label) WHERE {{{{
            ?X rdfs:label ?XLabel.
            ?X a {output["class"]}.
        """
        sparql += select
        where = ""
        where += f"""
            ?X rdfs:label ?XLabel.
            ?X a {output["class"]}.
        """
        have_place_properties = False
        place_props = []
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                where += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            where += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                    where += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                    where += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                    where += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                    where += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                continue
            if "ontologies" in key and is_label(value):
                if "place" in key.lower():
                    have_place_properties = True
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father rdfs:label "{value}"@vi.""")
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father ontologies:broaderDivision ?InProp{index}GrandFatherS.
                    ?InProp{index}GrandFatherS ontologies:_broaderDivision ?InProp{index}GrandFather.
                    ?InProp{index}GrandFather rdfs:label "{value}"@vi.
                    """)
                else:
                    where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                where += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        if have_place_properties:
            for prop in place_props:
                sparql += "UNION{"
                sparql += where
                sparql += prop
                sparql += "}"
        sparql += "FILTER(lang(?XLabel) = 'vi')"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 3:
        select = "SELECT ?X "
        where = ""
        have_place_properties = False
        place_props = []
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"(SAMPLE(?{key_without_colon}Year{index}) AS ?{key_without_colon}Year{index}{index}) (SAMPLE(?{key_without_colon}Month{index}) AS ?{key_without_colon}Month{index}{index}) (SAMPLE(?{key_without_colon}Day{index}) AS ?{key_without_colon}Day{index}{index}) (SAMPLE(?{key_without_colon}Lunar{index}) AS ?{key_without_colon}Lunar{index}{index})"
                continue
            if "ontologies" in a_property["key"]:
                select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
            else:
                select += f"(SAMPLE(?{key_without_colon}{index}) AS ?{key_without_colon}{index}{index}) "
        sparql += select
        sparql += f"""WHERE {{{{
            ?X a {output["class"]}.
            """
        where += f"""
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
            where += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and is_mega_class(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
                ?OutProp{index} rdfs:label ?{key_without_colon}Label{index}.
                """
                where += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
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
                where += f"""?{key_without_colon}{index} {indirect_key} ?OutProp{index}.
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
                where += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
            if "ontologies" not in a_property["key"]:
                filter_labels.append(
                    f"""?{key_without_colon}{index}""")
                continue
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                where += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            where += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                    where += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                    where += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                    where += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                    where += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                continue
            if "ontologies" in key and is_label(value):
                if "place" in key.lower():
                    have_place_properties = True
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father rdfs:label "{value}"@vi.""")
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father ontologies:broaderDivision ?InProp{index}GrandFatherS.
                    ?InProp{index}GrandFatherS ontologies:_broaderDivision ?InProp{index}GrandFather.
                    ?InProp{index}GrandFather rdfs:label "{value}"@vi.
                    """)
                else:
                    where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                where += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        if have_place_properties:
            for prop in place_props:
                sparql += "UNION{"
                sparql += where
                sparql += prop
                sparql += "}"
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
    if question_type == 4:
        select = "SELECT ?X "
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
        select = "SELECT ?X "
        for index, a_property in enumerate(output["out"]["property"]):
            key_without_colon = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"(SAMPLE(?{key_without_colon}Year{index}) AS ?{key_without_colon}Year{index}{index}) (SAMPLE(?{key_without_colon}Month{index}) AS ?{key_without_colon}Month{index}{index}) (SAMPLE(?{key_without_colon}Day{index}) AS ?{key_without_colon}Day{index}{index}) (SAMPLE(?{key_without_colon}Lunar{index}) AS ?{key_without_colon}Lunar{index}{index})"
                continue
            if "ontologies" in a_property["key"]:
                select += f"(SAMPLE(?{key_without_colon}Label{index}) AS ?{key_without_colon}Label{index}{index}) "
            else:
                select += f"(SAMPLE(?{key_without_colon}{index}) AS ?{key_without_colon}{index}{index}) "
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
        select = f"""SELECT ?X (SAMPLE(?Y) AS ?YURL) (SAMPLE(?YLabel) AS ?label) WHERE {{{{
            ?X a {output["class"]}."""
        sparql += select
        relationship = output["relationship"]
        indirect_relationship = output["relationship"].replace(":", ":_")
        sparql += f"""
            ?X {relationship} ?YStatement.
            ?YStatement {indirect_relationship} ?Y.
            ?Y rdfs:label ?YLabel.
        """
        where = ""
        where += f"""?X a {output["class"]}.
            ?X {relationship} ?YStatement.
            ?YStatement {indirect_relationship} ?Y.
            ?Y rdfs:label ?YLabel.
        """
        have_place_properties = False
        place_props = []
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                where += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            where += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                    where += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                    where += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                    where += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                    where += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                continue
            if "ontologies" in key and is_label(value):
                if "place" in key.lower():
                    have_place_properties = True
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father rdfs:label "{value}"@vi.""")
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father ontologies:broaderDivision ?InProp{index}GrandFatherS.
                    ?InProp{index}GrandFatherS ontologies:_broaderDivision ?InProp{index}GrandFather.
                    ?InProp{index}GrandFather rdfs:label "{value}"@vi.
                    """)
                else:
                    where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                where += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        if have_place_properties:
            for prop in place_props:
                sparql += "UNION{"
                sparql += where
                sparql += prop
                sparql += "}"
        sparql += "FILTER(lang(?YLabel) = 'vi')"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 7:
        select = f"""SELECT (COUNT(?X) AS ?Total) WHERE {{{{
            """
        sparql += select
        where = ""
        have_place_properties = False
        place_props = []
        for index, a_property in enumerate(output["in"]["property"]):
            key = a_property["key"]
            key_without_colon = a_property["key"].replace(":", "")
            indirect_key = a_property["key"].replace(":", ":_")
            value = a_property["value"]
            if "ontologies" not in key:
                sparql += f"""?X {key} {value}.
                """
                where += f"""?X {key} {value}.
                """
                continue
            sparql += f"""?X {key} ?{key_without_colon}{index}.
            """
            where += f"""?X {key} ?{key_without_colon}{index}.
            """
            if "ontologies" in key and isinstance(value, dict):
                year = value["year"]
                month = value["month"]
                day = value["day"]
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} time:inDateTime ?InProp{index}Description.
                    """
                if year != None:
                    if len(year) < 4:
                        for i in range(4 - len(year)):
                            year = "0" + year
                    sparql += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                    where += f"""?InProp{index}Description time:year '{year}'^^xsd:gYear.
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                    where += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                    where += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                    where += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
                continue
            if "ontologies" in key and is_label(value):
                if "place" in key.lower():
                    have_place_properties = True
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father rdfs:label "{value}"@vi.""")
                    place_props.append(f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} ontologies:broaderDivision ?InProp{index}FatherS.
                    ?InProp{index}FatherS ontologies:_broaderDivision ?InProp{index}Father.
                    ?InProp{index}Father ontologies:broaderDivision ?InProp{index}GrandFatherS.
                    ?InProp{index}GrandFatherS ontologies:_broaderDivision ?InProp{index}GrandFather.
                    ?InProp{index}GrandFather rdfs:label "{value}"@vi.
                    """)
                else:
                    where += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?InProp{index}.
                    ?InProp{index} rdfs:label "{value}"@vi.
                    """
                continue
            if "ontologies" in key:
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                where += f"""?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}.
                """
                continue
        sparql += "}"
        if have_place_properties:
            for prop in place_props:
                sparql += "UNION{"
                sparql += where
                sparql += prop
                sparql += "}"
        sparql += "}"
        sparql += "GROUP BY ?X"
        return sparql
    if question_type == 8:
        select = f"""SELECT ?X (SAMPLE(?XLabel) AS ?label) WHERE {{
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
                else:
                    sparql += f"""OPTIONAL {{?InProp{index}Description time:year ?year.}}
                    """
                if month != None:
                    if len(month) < 2:
                        month = "0" + month
                    sparql += f"""?InProp{index}Description time:month '--{month}'^^xsd:gMonth.
                    ?InProp{index}Description time:month ?month.
                    """
                else:
                    sparql += f"""OPTIONAL {{?InProp{index}Description time:month ?month}}
                    """
                if day != None:
                    if len(day) < 2:
                        day = "0" + day
                    sparql += f"""?InProp{index}Description time:day '---{day}'^^xsd:gDay.
                    ?InProp{index}Description time:day ?day.
                    """
                else:
                    sparql += f"""OPTIONAL {{?InProp{index}Description time:day ?day.}}
                    """
                if value["isLunarCalendar"] == True:
                    sparql += f"""?InProp{index}Description time:hasTRS "https://dbpedia.org/page/Lunar_calendar"."""
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
        if "-" in output["index"]:
            sparql += f"""ORDERBY DESC(?year) DESC(?month) DESC(?day)
        """
        else:
            sparql += f"""ORDERBY ASC(?year) ASC(?month) ASC(?day)
        """
        sparql += f"""LIMIT 1
        OFFSET {output["index"].replace("-","")}"""
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
