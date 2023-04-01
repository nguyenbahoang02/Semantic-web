# This files contains your custom actions which can be used to run
# custom Python code.

# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
import random

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
        response = requests.post('http://localhost:3030/culturaltourism/sparql',
        data={'query': f"PREFIX ontologies: <https://www.culturaltourism.vn/ontologies#> \
              PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
              SELECT * WHERE {{ \
              {{?x a ontologies:{asked_class}.}}  union {{\
              ?x a ?y.\
              ?y rdfs:subClassOf ontologies:{asked_class}}}\
              }}"})
        for x in response.json()['results']['bindings'] :
            data = x['x']['value'].replace("https://www.culturaltourism.vn/ontologies", "").replace("_"," ").replace("#","").replace("/", "")
            dispatcher.utter_message(text=data)

        return []
