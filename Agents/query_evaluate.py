from owlready2 import get_ontology
import os

def query_evaluate():
    def ontology_check():
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, '../semanticWeb/ontology.rdf')
        onto = get_ontology(filename)
        onto.load()

    ontology_check()
    return True

query_evaluate()
