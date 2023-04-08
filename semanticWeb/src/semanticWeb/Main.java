package semanticWeb;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import classes.AdministrativeDivision;
import classes.HistoricalFigure;
import crawler.Config;
import crawler.HistoricalFigureCrawler;

public class Main {
	
	private static OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM, null);

	
	public static void addDataToOntology() throws IOException, ParseException {
		model.read("Tourism_Ontology.owl");
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
		
		
		List<AdministrativeDivision> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(readADFile());
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\testAd.json");
        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.createClass("https://www.culturaltourism.vn/ontologies#AdministrativeDivision");
        	
        	model.add(subject, predicate, classType);
        	
//        	if(object.get("boarderDivision") != null) {
//        		String fatherAd = object.get("boarderDivision").toString().replaceAll(" ", "_");
//        		
//        		Resource boarderStatement = model.createResource();
//        		boarderStatement.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
//        		
//        		Resource ad = model.createResource(base + fatherAd);
//        		boarderStatement.addProperty(model.createObjectProperty(base + "_boarderDivision"), ad);
//        		
//        		model.add(subject, model.createAnnotationProperty(base + "boarderDivision"), boarderStatement);
//        		
//        	}
//        	
//        	JSONArray array = (JSONArray) object.get("narrowerDivision");
//        	if(array != null) {
//        		for (Object narrowerDivision : array) {
//        			String sonAd = narrowerDivision.toString().replaceAll(" ", "_");
//            		
//            		Resource narrowerStatement = model.createResource();
//            		narrowerStatement.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
//            		
//            		Resource ad = model.createResource(base + sonAd);
//            		narrowerStatement.addProperty(model.createObjectProperty(base + "_narrowerDivision"), ad);
//            		
//            		model.add(subject, model.createAnnotationProperty(base + "narrowerDivision"), narrowerStatement);
//				}
//        	}
        }
        
        
		jsonParser = new JSONParser();
        reader = new FileReader("file\\betterHistoricalFigures.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#HistoricalFigure");
        	
        	model.add(subject, predicate, classType);
        	
        	
        	try {
        		String dateBirth = object.get("dateOfBirth").toString();
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inXSDDate"), model.createTypedLiteral(dateBirth.split("T")[0], XSDDatatype.XSDdate));

        		bornInDescription.addProperty(model.getObjectProperty(base + "_birthDate"), timeResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "birthDate"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	
        	try {
        		String dateDeath = object.get("dateOfDeath").toString();
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inXSDDate"), model.createTypedLiteral(dateDeath.split("T")[0], XSDDatatype.XSDdate));

        		bornInDescription.addProperty(model.getObjectProperty(base + "_deathDate"), timeResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.getOntClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathDate"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	try {
        		String birthPlace = object.get("birthPlace").toString();
        		if(checkAd(administrativeDivisions, birthPlace)!=null) {
        			birthPlace = checkAd(administrativeDivisions, birthPlace);
        		}
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource placeResource = model.createResource(base + birthPlace.replaceAll(" ", "_"));
        		placeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.getOntClass(base + "AdministrativeDivision"));
        		
        		bornInDescription.addProperty(model.getObjectProperty(base + "_birthPlace"), placeResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.getOntClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "birthPlace"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	try {
        		String deathPlace = object.get("deathPlace").toString();
        		if(checkAd(administrativeDivisions, deathPlace)!=null) {
        			deathPlace = checkAd(administrativeDivisions, deathPlace);
        		}
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource placeResource = model.createResource(base + deathPlace.replaceAll(" ", "_"));
        		placeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "AdministrativeDivision"));
        		
        		bornInDescription.addProperty(model.getObjectProperty(base + "_deathPlace"), placeResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "link"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathPlace"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        }
        
        OutputStream out = new FileOutputStream("output.rdf");
        model.write(out, "RDF/XML");
	}
	
	public static String checkAd(List<AdministrativeDivision> list, String name) {
		for (AdministrativeDivision administrativeDivision : list) {
			if(administrativeDivision.getName().contains(name)) return administrativeDivision.getName();
		}
		return null;
	}
	
	public static List<AdministrativeDivision> readADFile() throws IOException, ParseException {
		List<AdministrativeDivision> listAdministrativeDivisions = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\AD_lv1.json");
        JSONArray adLv1 = (JSONArray) jsonParser.parse(reader);
		
        
		for(int i = 0; i<adLv1.size(); i++) {
			JSONObject object = (JSONObject) adLv1.get(i);
			listAdministrativeDivisions.add(new AdministrativeDivision(object.get("Tên").toString()));
		}
	
		reader = new FileReader("file\\AD_lv2.json");
		JSONArray adLv2 = (JSONArray) jsonParser.parse(reader);
        
		
		for(int i = 0; i<adLv2.size(); i++) {
			JSONObject object = (JSONObject) adLv2.get(i);
			String nameString = object.get("Tên").toString();
			String fatherString = object.get("Tỉnh, Thành Phố").toString();
			AdministrativeDivision ad = new AdministrativeDivision(nameString);
			AdministrativeDivision adFather = new AdministrativeDivision(fatherString);
			
			ad.setBoarderDivision(fatherString);
			listAdministrativeDivisions.get(listAdministrativeDivisions.indexOf(adFather)).addNarrowerDivision(nameString);
			
			listAdministrativeDivisions.add(ad);
			
			
		}
		
		reader = new FileReader("file\\AD_lv3.json");
		JSONArray adLv3 = (JSONArray) jsonParser.parse(reader);
        
		
		for(int i = 0; i<adLv3.size(); i++) {
			JSONObject object = (JSONObject) adLv3.get(i);
			if(object.get("Phường Xã") == null) continue;
			String fatherString = object.get("Quận Huyện").toString();
			String nameString = object.get("Phường Xã").toString();
			
			AdministrativeDivision ad = new AdministrativeDivision(nameString);
			AdministrativeDivision adFather = new AdministrativeDivision(fatherString);
			
			ad.setBoarderDivision(fatherString);
			listAdministrativeDivisions.get(listAdministrativeDivisions.indexOf(adFather)).addNarrowerDivision(nameString);
			
			listAdministrativeDivisions.add(ad);
			
			
		}
		
//		try {
//			FileWriter fw = new FileWriter(Config.PATH_FILE + "testAd.json");
//			fw.write("[\n");
//			for (int i = 0; i < listAdministrativeDivisions.size(); i++) {
//				fw.write(listAdministrativeDivisions.get(i).toString());
//				if (i != listAdministrativeDivisions.size() - 1)
//					fw.write(",\n");
//				else
//					fw.write("\n");
//			}
//			fw.write("\n]");
//			fw.close();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
		
		return listAdministrativeDivisions;
	}
	
	public static String prettyfy(String string) {
		return string.replaceAll("https://www.culturaltourism.vn/ontologies#", "").replaceAll("_", " ").replaceAll("\\^\\^http://www.w3.org/2001/XMLSchema#date", "");
	}
	
	public static String datify(String string) {	
		return ""
				+ " năm " + string.split("-")[0]
				+ " ngày "+ string.split("-")[2]
				+ " tháng " + string.split("-")[1]
		;
	}
	
	public static void main(String[] args) throws IOException, ParseException {
		
		
//		model.write(System.out);

		
//		HistoricalFigureCrawler historicalFigureCrawler = new HistoricalFigureCrawler();
//		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
//		
//		JSONParser jsonParser = new JSONParser();
//        FileReader reader = new FileReader("file\\historicalFigures.json");
//        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
//		List<String> nameList = new ArrayList<String>();
//        
//		for(int i=0; i<objectArray.size(); i++) {
//			JSONObject object = (JSONObject) objectArray.get(i);
//			nameList.add(object.get("name").toString());
//		}
//		
//		reader = new FileReader("file\\query.json");
//        objectArray = (JSONArray) jsonParser.parse(reader);
//		
//        listHistoricalFigures.addAll(historicalFigureCrawler.historicalFiguresFilter(objectArray, nameList));
//        historicalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures);
        
		
//		addDataToOntology();
		
//		String filename = "output.rdf";
//		OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
//		model.read(filename);
//		String queryString = "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#>"
//				+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
//				+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
//				+ "SELECT ?object ?property WHERE { ?object rdf:type culturaltourism:HistoricalFigure."
//				+ "?object culturaltourism:deathPlace ?Statement."
//				+ "?Statement  culturaltourism:_deathPlace ?property}"
//				+ "LIMIT 22";
//		Query query = QueryFactory.create(queryString);
//		QueryExecution qe = QueryExecutionFactory.create(query, model);
//		ResultSet results = qe.execSelect();
//		FileWriter writer = new FileWriter("file\\historicalFigureQ.txt", false);
//		while (results.hasNext()) {
//		    QuerySolution solution = results.nextSolution();
//		    RDFNode object = solution.get("object");
//		    RDFNode property = solution.get("property");
//		    writer.write("    - [" + prettyfy(object.toString()) + "]{\"entity\": \"object\", \"value\": \"culturaltourism:" + prettyfy(object.toString()).replaceAll(" ","_") + "}" + 
//		    " [qua đời ở]{\"entity\": \"predicate\", \"value\": \"culturaltourism:deathPlace\"} [" +
//		    		prettyfy(property.toString()) + "]{\"entity\": \"object\", \"value\": \"culturaltourism:" + prettyfy(property.toString()).replaceAll(" ","_") + "}\n");
//		}
//		qe.close();
//		writer.close();

		String filename = "output.rdf";
		OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
		model.read(filename);
		String queryString = "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#>"
				+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
				+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
				+ "PREFIX time: <http://www.w3.org/2006/time#>"
				+ "SELECT ?property WHERE { ?object rdf:type culturaltourism:HistoricalFigure."
				+ "?object culturaltourism:birthDate ?Statement."
				+ "?Statement  culturaltourism:_birthDate ?timeInstant."
				+ "?timeInstant time:inXSDDate ?property}"
				+ "LIMIT 30";
		Query query = QueryFactory.create(queryString);
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		FileWriter writer = new FileWriter("file\\historicalFigureQ.txt", false);
		while (results.hasNext()) {
		    QuerySolution solution = results.nextSolution();
		    RDFNode object = solution.get("property");
		    writer.write("    - [Ai]{\"entity\": \"class\", \"value\": \"culturaltourism:HistoricalFigure\"} " + 
		    " [sinh ngày]{\"entity\": \"predicate\", \"value\": \"culturaltourism:birthDate\"} [" + 
		    datify(prettyfy(object.toString()))+ "]{\"entity\": \"object\"} ?\n");
		}
		qe.close();
		writer.close();
		
		
	}

}















