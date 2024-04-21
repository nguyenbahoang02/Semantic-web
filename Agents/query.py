import requests

def SPARQL_query(query):
    prefix = """
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX ontologies: <https://tovie.vn/ontologies#>
        PREFIX time:<http://www.w3.org/2006/time#>
    """
    response = requests.post('http://localhost:3030/culturaltourism/sparql',
        data={'query': f"""{prefix}
                {query}
                """})

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

