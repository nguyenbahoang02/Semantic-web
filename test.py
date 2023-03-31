import requests
import json

response = requests.post('http://localhost:3030/tourism/sparql',
       data={'query': 'SELECT * WHERE { ?x a <https://www.culturaltourism.vn/ontologies#TraditionalFestival> . }'})

# print(response.json())
for x in response.json()['results']['bindings'] :
       data = x['x']['value'].replace("https://www.culturaltourism.vn/ontologies#", "").replace("_"," ")
       print(data)
# with open("sample.json", "w", encoding='utf-8') as outfile:
#     json.dump(response.json(), outfile, ensure_ascii=False)