import requests

def SPARQL_query(query):
    response = requests.post('http://localhost:3030/culturaltourism/sparql',
        data={'query': f"""{query}"""})

    result = response.json()['results']['bindings']
    return result if not result == [] else "No result"

# result = SPARQL_query("""
# SELECT DISTINCT ?birthPlaceLabel WHERE {
#     ?x a ontologies:HistoricalFigure.
#     ?x rdfs:label "Ho Chi Minh"@en.
#     ?x ontologies:birthPlace ?Statement.
#     ?Statement ontologies:_birthPlace ?birthPlace.
#     ?birthPlace rdfs:label ?birthPlaceLabel.
#     FILTER(lang(?birthPlaceLabel) = 'vi')
# }""")
# print(result)    

