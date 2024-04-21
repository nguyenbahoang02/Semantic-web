import requests
import re 

def query_evaluate(query):
    def ontology_check(name):
        sparql_query = f"""
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX prov: <http://www.w3.org/ns/prov#>
            PREFIX ontologies: <https://tovie.vn/ontologies#>
            PREFIX time:<http://www.w3.org/2006/time#>
            SELECT DISTINCT ?x {{
                {name} a ?x     
            }}
        """
        response = requests.post('http://localhost:3030/culturaltourism/sparql',
        data={'query': sparql_query})
        try:
            print(response.json()['results']['bindings'][0])
            return True
        except: 
            print(f"Error {name}")
            return False
    
    result_string = "The ontology does not have the following:"
    false_counter = 0
    query_content = query[query.index('{')+1:query.rindex('}')]
    segments = query_content.split('.')
    for segment in segments:
        print(segment)
        if not segment.startswith("FILTER"):
            words = segment.split(" ")
            for word in words:
                if word.startswith("ontologies"):
                    if not ontology_check(word):
                        result_string += f" {word}"
                        false_counter+=1

    
    return result_string if false_counter!= 0 else True 

def label_lang_check(query):
    query_content = query[query.index('{')+1:query.rindex('}')]
    segments = query_content.split('.')
    result = "These labels are not in the correct language: "
    for segment in segments:
        print(segment)
        if not segment.startswith("FILTER"):
            if "@" in segment:
                label = segment.split('"')[1]
                lang = segment.split("@")[1]
                pattern = r'[áàãảạăằắẳẵặâầấẩẫậòóỏõọôốồỗổộơờớởỡợìíỉĩịỳýỷỹỵùúủũụưừứửữựèéẻẽẹêềếểễệđ]'
                match = re.search(pattern, label.lower())
                if match and lang=="en": 
                    result += label
                elif not match and lang == "vi":
                    result += label
                if lang != "en" and lang != "vi":
                    result += label
    return True if result == "These labels are not in the correct language: " else result

# print(label_lang_check("""
# SELECT DISTINCT ?label WHERE {
#     ?x a ontologies:HistoricalFigure.
#     ?x rdfs:label "An Duong Vuong"@vi.
#     ?x ontologies:otherNames ?Statement.
#     ?Statement ontologies:_otherNames ?label.
#     FILTER(lang(?label) = 'vi')
# }                     
# """))