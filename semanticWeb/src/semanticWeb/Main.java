package semanticWeb;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.rdfconnection.RDFConnection;
import org.apache.jena.rdfconnection.RDFConnectionFactory;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import classes.HistoricalFigure;
import crawler.HistoricalFigureCrawler;
import jakarta.json.JsonException;

public class Main {
	
	private static OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM, null);

	public static void main(String[] args) throws IOException, ParseException {
		
		model.read("Tourism_Ontology.owl");
//		model.write(System.out);

		
//		HistoricalFigureCrawler historicalFigureCrawler = new HistoricalFigureCrawler();
//		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		
		
//		listHistoricalFigures.addAll(historicalFigureCrawler.getDataFromHTML());
//		historicalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures);
		
		
//		listHistoricalFigures.addAll(historicalFigureCrawler.getMoreData("file\\historicalFigures.json"));
//		historicalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures);
		
		String base = "https://www.culturaltourism.vn/ontologies#";
		
		
		model.setNsPrefix("", "https://www.culturaltourism.vn/ontologies/#");
//		model.setNsPrefix("base", "https://www.culturaltourism.vn/ontologies/");
		model.setNsPrefix("dc", "http://purl.org/dc/elements/1.1/");
		model.setNsPrefix("owl", "http://www.w3.org/2002/07/owl#");
		model.setNsPrefix("rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
		model.setNsPrefix("xml", "http://www.w3.org/XML/1998/namespace");
		model.setNsPrefix("xsd", "http://www.w3.org/2001/XMLSchema#");
		model.setNsPrefix("core", "http://purl.org/vocab/frbr/core#");
		model.setNsPrefix("prov", "http://www.w3.org/ns/prov#");
		model.setNsPrefix("rdfs", "http://www.w3.org/2000/01/rdf-schema#");
		model.setNsPrefix("skos", "http://www.w3.org/2004/02/skos/core#");
		model.setNsPrefix("time", "http://www.w3.org/2006/time#");
		model.setNsPrefix("vnct", "https://www.culturaltourism.vn/ontologies/#");
		model.setNsPrefix("terms", "http://purl.org/dc/terms/");
		model.setNsPrefix("culturaltourism", "https://www.culturaltourism.vn/ontologies#");
		model.setNsPrefix("ontologies1", "https://www.culturaltourism.vn/ontologies/");
		
		
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\historicalFigures.json");
        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
        String baseResource = "https://dbpedia.org/page/";
        
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.createClass("https://www.culturaltourism.vn/ontologies#HistoricalFigure");
        	
        	model.add(subject, predicate, classType);
        	
        	
        	try {
        		String dateBirth = object.get("dateOfBirth").toString();
        		
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		bornInDescription.addProperty(model.createProperty(base + "bornIn"), model.createTypedLiteral(dateBirth));
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), model.createTypedLiteral(baseResource +object.get("name").toString().replaceAll(" ", "_")));
        		
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		
        		model.add(subject, model.createProperty("https://www.culturaltourism.vn/ontologies#bornInDescription"), bornInDescription);
        		
        	}catch(Exception e) {
        		
        	}
        	
        	try {
        		String dateDeath = object.get("dateOfDeath").toString();
        		
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		bornInDescription.addProperty(model.createProperty(base + "diedIn"), model.createTypedLiteral(dateDeath));
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), model.createTypedLiteral(baseResource +object.get("name").toString().replaceAll(" ", "_")));
        		
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		
        		model.add(subject, model.createProperty("https://www.culturaltourism.vn/ontologies#diedInDescription"), bornInDescription);
        		
        	}catch(Exception e) {
        		
        	}
        	
        }
        
        OutputStream out = new FileOutputStream("output.rdf");
        model.write(out, "RDF/XML");
		
		
		
//		List<String> propertiesList = new ArrayList<>();
//		ExtendedIterator<OntProperty> iterator = model.listAllOntProperties();
//		while (iterator.hasNext()) {
//            Object i = iterator.next();
//            if (i.toString().contains("#")) {
//                propertiesList.add(i.toString().split("#")[1].replaceAll("'", ""));
//            }
//        }
//		for (String string : propertiesList) {
//			System.out.println(string);
//		}
	

        
	}

}
