import requests


def query_executor(query):
    response = requests.post('http://localhost:3030/culturaltourism/sparql',
                             data={'query': f"""{query}"""})

    result = response.json()['results']['bindings'][:10]
    result = []
    for item in response.json()['results']['bindings'][:10]:
        if hasattr(item, "X"):
            result.append(item["X"]["value"].replace("#", "/"))
        else:
            result.append(item)
    return result if not result == [] else "No result"

# result = query_executor("""
# SELECT DISTINCT ?birthPlaceLabel WHERE {
#     ?x a ontologies:HistoricalFigure.
#     ?x rdfs:label "Ho Chi Minh"@en.
#     ?x ontologies:birthPlace ?Statement.
#     ?Statement ontologies:_birthPlace ?birthPlace.
#     ?birthPlace rdfs:label ?birthPlaceLabel.
#     FILTER(lang(?birthPlaceLabel) = 'vi')
# }""")
# print(result)
