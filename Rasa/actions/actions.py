# This files contains your custom actions which can be used to run
# custom Python code.

# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import re
from datetime import datetime

def datify(string):
    numbers = re.findall(r'\d+', string)
    length = len(numbers)
    if length == 1:
        return '' + numbers[0]
    if length == 2:
        dateString = numbers[1] + '/' + numbers[0]
        dateObj = datetime.strptime(dateString, '%Y/%m')
        return dateObj.strftime('%B %Y')
    if length == 3:
        dateString = numbers[2] + '/' + numbers[1] + '/' + str(int(numbers[0]))
        dateObj = datetime.strptime(dateString, "%Y/%m/%d")
        return dateObj.strftime('%B ' + str(int(dateObj.day)) + {1:'st', 2:'nd', 3:'rd'}.get(dateObj.day if dateObj.day < 20 else dateObj.day % 10, 'th') + ', %Y')



class ActionListing(Action):

    def name(self) -> Text:
        return "action_listing"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        getClass = tracker.get_intent_of_latest_message()
        asked_class = None
        if getClass == 'ask_list_historicalFigures' :
            asked_class = 'HistoricalFigure'
        if getClass == 'ask_list_historicalSites':
            asked_class = 'Site'
        if getClass == 'ask_list_festival':
            asked_class = 'Festival'
        if asked_class is None :
            return []
        response = requests.post('http://fuseki:3030/culturaltourism/sparql',
        data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
              SELECT * WHERE {{ \
              {{?x a culturaltourism:{asked_class}.}}  union {{\
              ?x a ?y.\
              ?y rdfs:subClassOf culturaltourism:{asked_class}}}\
              }}"})
        for x in response.json()['results']['bindings'] :
            data = x['x']['value'].replace("https://www.culturaltourism.vn/ontologies", "").replace("_"," ").replace("#","").replace("/", "")
            dispatcher.utter_message(text=data)

        return []

class ActionOneCondition(Action):

    def name(self) -> Text:
        return "action_one_condition"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        if tracker.get_intent_of_latest_message() == "ask_about_historicalFigure":
            classData = next(tracker.get_latest_entity_values("class"),".")
            predicate = next(tracker.get_latest_entity_values("predicate"),".")
            object = next(tracker.get_latest_entity_values("object"),".")
            if predicate == "." :
                response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                    PREFIX time: <http://www.w3.org/2006/time#>\
                    PREFIX prov: <http://www.w3.org/ns/prov#>\
                    SELECT ?description ?url WHERE {{ \
                    {object} culturaltourism:description ?Statement.\
                    ?Statement culturaltourism:_description ?description.\
                    ?Statement prov:wasDerivedFrom ?ref.\
                    ?ref culturaltourism:referenceURL ?url.\
                    }}"})
                if response.json()['results']['bindings'] == []:
                    dispatcher.utter_message("I don't know")
                    return []
                for x in response.json()['results']['bindings'] :
                    description = x['description']['value']
                    url = x['url']['value']
                    object_message = {
                        "text": description,
                        "url": url,
                    }
                    #description 
                    dispatcher.utter_message(attachment=object_message)
                return []
            if classData != ".":
                if predicate == "culturaltourism:birthDate" or predicate == "culturaltourism:deathDate":
                    time = (next(tracker.get_latest_entity_values("time"))).split("T")[0]
                    day = time.split("-")[2]
                    month = time.split("-")[1]
                    year = time.split("-")[0]
                    try:
                        response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                        data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                            PREFIX time: <http://www.w3.org/2006/time#>\
                            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
                            PREFIX prov: <http://www.w3.org/ns/prov#>\
                            SELECT * WHERE {{ \
                            ?x a {classData}.\
                            ?x {predicate} ?Statement.\
                            ?x rdfs:label ?label.\
                            ?Statement {predicate.replace(':',':_')} ?timeInstant.\
                            ?timeInstant time:inDateTime ?des.\
                            ?des time:day ?day.\
                            ?des time:month ?month.\
                            ?des time:year ?year.\
                            ?Statement prov:wasDerivedFrom ?ref.\
                            ?ref culturaltourism:referenceURL ?url.\
                            FILTER (lang(?label) = 'en'&& ?day = '---{day}'^^xsd:gDay && ?month = '--{month}'^^xsd:gMonth && ?year = '{year}'^^xsd:gYear)}}"})
                        if response.json()['results']['bindings'] == []:
                            dispatcher.utter_message("I don't know")
                            return []
                        for x in response.json()['results']['bindings'] :
                            data = x['label']['value'].replace('@en','')
                            url = x['url']['value']
                            object_message = {
                                "text": data,
                                "url": url,
                            }
                            dispatcher.utter_message(attachment=object_message)
                        return []
                    except:
                        dispatcher.utter_message("Can you please rephrase your question?")
                        return []
                try:
                    response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                    data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                        PREFIX prov: <http://www.w3.org/ns/prov#>\
                        SELECT * WHERE {{ \
                        {{?x a {classData}.}}  union {{\
                        ?x a ?y.\
                        ?y rdfs:subClassOf {classData}}}\
                        ?x {predicate} ?Statement.\
                        ?Statement {predicate.replace(':',':_')} {object}.\
                        ?x rdfs:label ?label.\
                        ?x prov:wasDerivedFrom ?ref.\
                        ?ref culturaltourism:referenceURL ?url.\
                        FILTER(lang(?label) = 'en')}}"})
                    if response.json()['results']['bindings'] == []:
                        dispatcher.utter_message("I don't know")
                        return []
                    for x in response.json()['results']['bindings'] :
                        data = x['label']['value']
                        url = x['url']['value']
                        object_message = {
                            "text": data,
                            "url": url,
                        }
                        dispatcher.utter_message(attachment=object_message)
                    return []
                except:
                    dispatcher.utter_message("Can you please rephrase your question?")
                    return[]
            if predicate == "culturaltourism:birthDate" or predicate == "culturaltourism:deathDate":
                response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                    PREFIX time: <http://www.w3.org/2006/time#>\
                    PREFIX prov: <http://www.w3.org/ns/prov#>\
                    SELECT ?day ?month ?year ?url WHERE {{ \
                    {object} {predicate} ?Statement.\
                    ?Statement {predicate.replace(':',':_')} ?timeInstant.\
                    ?timeInstant time:inDateTime ?description.\
                    ?description time:day ?day.\
                    ?description time:month ?month.\
                    ?description time:year ?year.\
                    ?Statement prov:wasDerivedFrom ?ref.\
                    ?ref culturaltourism:referenceURL ?url.\
                    }}"})
                if response.json()['results']['bindings'] == []:
                    dispatcher.utter_message("I don't know")
                    return []
                for x in response.json()['results']['bindings'] :
                    day = x['day']['value']
                    month = x['month']['value']
                    year = x['year']['value']
                    url = x['url']['value']
                    object_message = {
                        "text": datify(day+'~'+month+'~'+year),
                        "url": url,
                    }
                    #birthDate deathDate
                    dispatcher.utter_message(attachment=object_message)
                return []
            try:
                response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                    PREFIX prov: <http://www.w3.org/ns/prov#>\
                    SELECT DISTINCT ?label ?url WHERE {{ \
                    {object} {predicate} ?Statement.\
                    ?Statement {predicate.replace(':',':_')} ?x.\
                    ?x rdfs:label ?label.\
                    ?Statement prov:wasDerivedFrom ?ref.\
                    ?ref culturaltourism:referenceURL ?url.\
                    FILTER(lang(?label) = 'en')}}"})
                if response.json()['results']['bindings'] == []:
                    dispatcher.utter_message("I don't know")
                    return []
                for x in response.json()['results']['bindings'] :
                    data = x['label']['value']
                    url = x['url']['value']
                    object_message = {
                        "text": data,
                        "url": url,
                    }
                    #where 
                    dispatcher.utter_message(attachment=object_message)
                return []
            except:
                dispatcher.utter_message("Can you please rephrase your question?")
            return []
        if tracker.get_intent_of_latest_message() == "ask_about_site":
            classData = next(tracker.get_latest_entity_values("class"),".")
            predicate = next(tracker.get_latest_entity_values("predicate"),".")
            object = next(tracker.get_latest_entity_values("object"),".")
            if classData == "." and predicate == ".":
                try:
                    response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                    data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                        PREFIX prov: <http://www.w3.org/ns/prov#>\
                        SELECT * WHERE {{ \
                        {object} culturaltourism:sitePlace ?admin.\
                        ?admin rdfs:label ?label.\
                        {object} prov:wasDerivedFrom ?ref.\
                        ?ref culturaltourism:referenceURL ?url.\
                        FILTER(lang(?label) = 'en')\
                        }}"})
                    if response.json()['results']['bindings'] == []:
                        dispatcher.utter_message("I don't know")
                        return []
                    for x in response.json()['results']['bindings'] :
                        data = x['label']['value']
                        url = x['url']['value']
                        object_message = {
                            "text": data,
                            "url": url,
                        }
                        #where is this site
                        dispatcher.utter_message(attachment=object_message)
                        return []
                except:
                    dispatcher.utter_message("Can you please rephrase your question?")
                return []
            if classData == ".":
                try:
                    response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                    data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                        PREFIX prov: <http://www.w3.org/ns/prov#>\
                        SELECT * WHERE {{ \
                        {object} {predicate} ?Statement.\
                        ?Statement {predicate.replace(':', ':_')} ?x.\
                        ?x rdfs:label ?label.\
                        {object} prov:wasDerivedFrom ?ref.\
                        ?ref culturaltourism:referenceURL ?url.\
                        FILTER(lang(?label) = 'en')\
                        }}"})
                    if response.json()['results']['bindings'] == []:
                        dispatcher.utter_message("I don't know")
                        return []
                    for x in response.json()['results']['bindings'] :
                        data = x['label']['value']
                        url = x['url']['value']
                        object_message = {
                            "text": data,
                            "url": url,
                        }
                        #memorize 
                        dispatcher.utter_message(attachment=object_message)
                        return []
                    return []
                except:
                    dispatcher.utter_message("Can you please rephrase your question?")
                return []
        if tracker.get_intent_of_latest_message() == "ask_about_festival":
            classData = next(tracker.get_latest_entity_values("class"),".")
            predicate = next(tracker.get_latest_entity_values("predicate"),".")
            object = next(tracker.get_latest_entity_values("object"),".")
            if classData == ".":
                try:
                    response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                    data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                        PREFIX prov: <http://www.w3.org/ns/prov#>\
                        SELECT * WHERE {{ \
                        {object} {predicate} ?Statement.\
                        ?Statement {predicate.replace(':', ':_')} ?x.\
                        ?x rdfs:label ?label.\
                        {object} prov:wasDerivedFrom ?ref.\
                        ?ref culturaltourism:referenceURL ?url.\
                        FILTER(lang(?label) = 'en')\
                        }}"})
                    if response.json()['results']['bindings'] == []:
                        dispatcher.utter_message("I don't know")
                        return []
                    for x in response.json()['results']['bindings'] :
                        data = x['label']['value']
                        url = x['url']['value']
                        object_message = {
                            "text": data,
                            "url": url,
                        }
                        #festivalPlace
                        dispatcher.utter_message(attachment=object_message)
                    return []
                except:
                    dispatcher.utter_message("Can you please rephrase your question?")
                return []
            try:
                response = requests.post('http://fuseki:3030/culturaltourism/sparql',
                data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
                    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                    PREFIX prov: <http://www.w3.org/ns/prov#>\
                    SELECT * WHERE {{ \
                    ?x a {classData}.\
                    ?x {predicate} ?Statement.\
                    ?Statement {predicate.replace(':', ':_')} {object}.\
                    ?x rdfs:label ?label.\
                    ?x prov:wasDerivedFrom ?ref.\
                    ?ref culturaltourism:referenceURL ?url.\
                    FILTER(lang(?label) = 'en')\
                    }}"})
                if response.json()['results']['bindings'] == []:
                    dispatcher.utter_message("I don't know")
                    return []
                for x in response.json()['results']['bindings'] :
                    data = x['label']['value']
                    url = x['url']['value']
                    object_message = {
                        "text": data,
                        "url": url,
                    }
                    #what festival take place in
                    dispatcher.utter_message(attachment=object_message)
                return []
            except:
                dispatcher.utter_message("Can you please rephrase your question?")
            return []
        dispatcher.utter_message("Can you please rephrase your question?")
        return []
        # if tracker.get_intent_of_latest_message() == "ask_about_dynasty":
        #     classData = next(tracker.get_latest_entity_values("class"),".")
        #     predicate = next(tracker.get_latest_entity_values("predicate"))
        #     object = next(tracker.get_latest_entity_values("object"))
        #     time = (next(tracker.get_latest_entity_values("time"))).split("T")[0]

        #     try:
        #         response = requests.post('http://fuseki:3030/culturaltourism/sparql',
        #         data={'query': f"PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> \
        #             PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
        #             PREFIX time: <http://www.w3.org/2006/time#>\
        #             SELECT * WHERE {{ \
        #             ?x a culturaltourism:Period.\
        #             }}"})
        #         for x in response.json()['results']['bindings'] :
        #             data = x['x']['value'].replace("https://www.culturaltourism.vn/ontologies", "").replace("_"," ").replace("#","").replace("/", "")
        #             dispatcher.utter_message(text=data)
        #         return []
        #     except:
        #         dispatcher.utter_message("Can you please rephrase your question?")
        #     return []