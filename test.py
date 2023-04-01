import requests
import random

response = requests.post('http://localhost:3030/culturaltourism/sparql',
       data={'query': 'PREFIX ontologies: <https://www.culturaltourism.vn/ontologies#> SELECT * WHERE { ?x a ontologies:HistoricalFigure . }'})

print(response.content.decode('utf-8'))

# for x in range(5) :
#        data = response.json()['results']['bindings'][random.randint(0, 5)]['x']['value'].replace("https://www.culturaltourism.vn/ontologies", "").replace("_"," ").replace("#","").replace("/", "")
#        print(data)

# for x in response.json()['results']['bindings'] :
#        data = x['x']['value'].replace("https://www.culturaltourism.vn/ontologies#TraditionalFestival", "").replace("_"," ")
#        print(data)
# with open("sample.json", "w", encoding='utf-8') as outfile:
#     json.dump(response.json(), outfile, ensure_ascii=False)