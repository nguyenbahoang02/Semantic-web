package semanticWeb;

import java.io.FileWriter;
import java.io.IOException;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.RDFNode;

public class QuestionGen {
	
	public static String prettyfy2(String string) {
		return string.replaceAll("https://www.culturaltourism.vn/ontologies#", "culturaltourism:");
	}
	
	public static void genQuestion(String location, String ontology) throws IOException {
		OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		model.read(ontology);
		String queryString = "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#>"
				+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX time: <http://www.w3.org/2006/time#>"
				+ "SELECT ?object ?label WHERE { ?object rdf:type culturaltourism:Site."
				+ "?object culturaltourism:memorizePerson ?person."
				+ "?object rdfs:label ?label."
				+ "FILTER (lang(?label) = 'vn')}"
				+ "LIMIT 200";
		Query query = QueryFactory.create(queryString);
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		FileWriter writer = new FileWriter(location, false);
		while (results.hasNext()) {
		    QuerySolution solution = results.nextSolution();
		    RDFNode object = solution.get("object");
		    RDFNode label = solution.get("label");
		    try {
				writer.write("    - Which [festival]"
						+ " [" + label.toString().replaceAll("@vn", "") + "]{" + "\"entity\": \"object\", \"value\": \"" + prettyfy2(object.toString())+ "\"}"
						+" [in memory of]{\"entity\": \"predicate\", \"value\": \"culturaltourism:memorizePerson\"} ?\n");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		qe.close();
		writer.close();
	}
}
