export function getPrefix(uri) {
  return uri
    ?.replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:")
    ?.replace("https://tovie.vn/ontologies#", "ontologies:")
    ?.replace("http://www.w3.org/2002/07/owl#", "owl:")
    ?.replace("http://www.w3.org/2003/01/geo/wgs84_pos#", "geo:")
    ?.replace("http://dbpedia.org/ontology/", "dbo:")
    ?.replace("http://www.w3.org/2000/01/rdf-schema#", "rdfs:")
    ?.replace("http://purl.org/dc/terms/", "terms:")
    ?.replace("http://purl.org/dc/elements/1.1/", "dc:")
    ?.replace("https://www.culturaltourism.vn/ontologies", "base:")
    ?.replace("http://www.w3.org/2006/time#", "time:")
    ?.replace("http://xmlns.com/foaf/0.1/", "foaf:")
    ?.replace("http://www.w3.org/2004/02/skos/core#", "skos:")
    ?.replace("http://purl.org/vocab/frbr/core#", "core:")
    ?.replace("http://www.w3.org/2001/XMLSchema#", "xsd:")
    ?.replace("http://www.w3.org/ns/prov#", "prov:");
}

export function getValue(uri) {
  return uri
    ?.replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "")
    ?.replace("https://tovie.vn/ontologies#", "");
}
