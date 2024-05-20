from fuzzywuzzy import fuzz


def is_mega_class(class_name):
    return class_name == "ontologies:AdministrativeDivision" or class_name == "ontologies:HistoricalFigure" or class_name == "ontologies:Site" or class_name == "ontologies:Festival" or class_name == "ontologies:PositionTitle"

def sparql_gen(output, question_type):
    prefix = """
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX ontologies: <https://tovie.vn/ontologies#>
        PREFIX time:<http://www.w3.org/2006/time#>
    """
    sparql = prefix

    if question_type == 1:
        select = "SELECT DISTINCT "
        for index, a_property in enumerate(output["out"]["property"]):
            key = a_property["key"].replace(":", "")
            if a_property["value"] == "timeInstant":
                select += f"?{key}Year{index} ?{key}Month{index} ?{key}Day{index} "
                continue
            if "ontologies" in a_property["key"]:
                select += f"?{key}Label{index} "
            else:
                select += f"?{key}{index} "
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
            sparql += f"?X {key} ?{key_without_colon}{index}. "
            if "ontologies" in key and is_mega_class(value):
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?Prop{index}.
                    ?Prop{index} rdfs:label ?{a_property["key"].replace(":","")}Label{index}.
                    """
                filter_labels.append(
                    f"""?{a_property["key"].replace(":","")}Label{index}""")
                continue
            if "ontologies" in a_property["key"] and a_property["value"] == "timeInstant":
                sparql += f"""?{key_without_colon}{index} {indirect_key} ?Prop{index}.
                    ?Prop{index} time:inDateTime ?Prop{index}Description.
                    OPTIONAL {{?Prop{index}Description time:year ?{key_without_colon}Year{index}}}
                    OPTIONAL {{?Prop{index}Description time:month ?{key_without_colon}Month{index}}}
                    OPTIONAL {{?Prop{index}Description time:day ?{key_without_colon}Day{index}}}
                    """
                continue
            if "ontologies" in a_property["key"]:
                sparql += f"?{key_without_colon}{index} {indirect_key} ?{key_without_colon}Label{index}."
                continue
            if "ontologies" not in a_property["key"]:
                sparql += f"?{key_without_colon}{index} {key} ?{key_without_colon}{index}."
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
        return sparql


print(sparql_gen({
    "name": "Trần Hưng Đạo",
    "class": "ontologies:HistoricalFigure",
    "out": {
      "property": [
          {
            "key": "ontologies:deathPlace",
              "value": "ontologies:AdministrativeDivision"
          },
          {
              "key": "ontologies:deathDate",
              "value": "timeInstant"
          }
      ]
      }
}, 1))
# print(fuzz.ratio("Thành phố Hà Nội","Hà Nội"))
