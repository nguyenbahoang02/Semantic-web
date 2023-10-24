export function getPrefix(uri) {
  return uri
    .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:")
    .replace("https://tovie.vn/ontologies#", "ontologies:");
}

export function getValue(uri) {
  return uri
    .replace("http://www.w3.org/1999/02/22-rdf-syntax-ns#", "")
    .replace("https://tovie.vn/ontologies#", "");
}
