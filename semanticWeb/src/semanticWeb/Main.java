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
import org.apache.jena.rdfxml.xmlinput.states.StartStateRDForDescription;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import classes.AdministrativeDivision;
import classes.Dynasty;
import classes.HistoricalFigure;
import classes.Site;
import crawler.Config;
import crawler.DynastyCrawler;
import crawler.HistoricalFigureCrawler;
import crawler.SiteCrawler;

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
		administrativeDivisions.addAll(compositeADFile());
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\testAd.json");
        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.createClass("https://www.culturaltourism.vn/ontologies#AdministrativeDivision");
        	
        	model.add(subject, predicate, classType);
        	
       	// if(object.get("boarderDivision") != null) {
       	// 	String fatherAd = object.get("boarderDivision").toString().replaceAll(" ", "_");
       		
       	// 	Resource boarderStatement = model.createResource();
       	// 	boarderStatement.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
       		
       	// 	Resource ad = model.createResource(base + fatherAd);
       	// 	boarderStatement.addProperty(model.createObjectProperty(base + "_boarderDivision"), ad);
       		
       	// 	model.add(subject, model.createAnnotationProperty(base + "boarderDivision"), boarderStatement);
       		
       	// }
       	
       	// JSONArray array = (JSONArray) object.get("narrowerDivision");
       	// if(array != null) {
       	// 	for (Object narrowerDivision : array) {
       	// 		String sonAd = narrowerDivision.toString().replaceAll(" ", "_");
           		
        //    		Resource narrowerStatement = model.createResource();
        //    		narrowerStatement.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
           		
        //    		Resource ad = model.createResource(base + sonAd);
        //    		narrowerStatement.addProperty(model.createObjectProperty(base + "_narrowerDivision"), ad);
           		
        //    		model.add(subject, model.createAnnotationProperty(base + "narrowerDivision"), narrowerStatement);
		// 		}
       	// }
        }
       
        jsonParser = new JSONParser();
        reader = new FileReader("file\\dynasties.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i = 0; i<objectArray.size(); i++) {
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#Period");
        	
        	model.add(subject, predicate, classType);
        	
        	String startString = object.get("startingTime").toString();
        	String endString = object.get("endingTime").toString();
        	
        	String start = refinedgYear(startString);
        	String end = refinedgYear(endString);
        	
        	Resource startDate = model.createResource();
        	startDate.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        	
        	Resource startDateResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "StartDate");
        	startDateResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        	
        	Resource timeResource = model.createResource();
        	timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
    		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(start, XSDDatatype.XSDgYear));
    		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#hasTRS"), model.createTypedLiteral("http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"));
    		
    		startDateResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), timeResource);
    		startDate.addProperty(model.getObjectProperty(base + "_start"), startDateResource);
    		
    		model.add(subject, model.getAnnotationProperty(base + "start"), startDate);
    		
    		Resource endDate = model.createResource();
    		endDate.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        	
        	Resource endDateResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "EndDate");
        	endDateResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        	
        	Resource endTimeResource = model.createResource();
        	endTimeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
        	endTimeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(end, XSDDatatype.XSDgYear));
        	endTimeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#hasTRS"), model.createTypedLiteral("http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"));
    		
        	endDateResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), endTimeResource);
        	endDate.addProperty(model.getObjectProperty(base + "_end"), endDateResource);
    		
    		model.add(subject, model.getAnnotationProperty(base + "end"), endDate);
        }
        
        jsonParser = new JSONParser();
        reader = new FileReader("file\\betterSites.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i = 0; i<objectArray.size(); i++) {
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	
        	String type = object.get("type").toString();
        	Resource classType = model.getOntClass(base + type);
        	
        	model.add(subject, predicate, classType);
        	
        	String location = object.get("location").toString();
        	Resource locationResource = model.createResource(base + location.replaceAll(" ", "_"));
        	model.add(subject, model.getAnnotationProperty(base + "sitePlace"), locationResource);
        }
        
		jsonParser = new JSONParser();
        reader = new FileReader("file\\evenBetterHistoricalFigures.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#HistoricalFigure");
        	
        	model.add(subject, predicate, classType);
        	
        	
        	try {
        		String dateBirthString = object.get("dateOfBirth").toString();
        		
        		String yearBirth = null;
        		String monthBirth = null;
        		String dayBirth = null;
        		if(dateBirthString.charAt(0)=='-') {
        			yearBirth = dateBirthString.substring(0,5);
        			monthBirth = dateBirthString.substring(6,8);
        			dayBirth = dateBirthString.substring(9,11);
        		}else {
        			yearBirth = dateBirthString.substring(0,4);
        			monthBirth = dateBirthString.substring(5,7);
        			dayBirth = dateBirthString.substring(8,10);
        		}
        		
        		Resource bornInDescription = model.createResource();
        		bornInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource dateBirthResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "BirthDate");
        		dateBirthResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(yearBirth, XSDDatatype.XSDgYear));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#month"), model.createTypedLiteral("--" + monthBirth, XSDDatatype.XSDgMonth));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#day"), model.createTypedLiteral("---" + dayBirth, XSDDatatype.XSDgDay));
        		
        		dateBirthResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), timeResource);
        		bornInDescription.addProperty(model.getObjectProperty(base + "_birthDate"), dateBirthResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "birthDate"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	
        	try {
        		String dateDeathString = object.get("dateOfDeath").toString();
        		
        		String yearDeath = null;
        		String monthDeath = null;
        		String dayDeath = null;
        		if(dateDeathString.charAt(0)=='-') {
        			yearDeath = dateDeathString.substring(0,5);
        			monthDeath = dateDeathString.substring(6,8);
        			dayDeath = dateDeathString.substring(9,11);
        		}else {
        			yearDeath = dateDeathString.substring(0,4);
        			monthDeath = dateDeathString.substring(5,7);
        			dayDeath = dateDeathString.substring(8,10);
        		}
        		
        		Resource diedInDescription = model.createResource();
        		diedInDescription.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		
        		Resource dateDeathResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "DeathDate");
        		dateDeathResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(yearDeath, XSDDatatype.XSDgYear));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#month"), model.createTypedLiteral("--" + monthDeath, XSDDatatype.XSDgMonth));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#day"), model.createTypedLiteral("---" + dayDeath, XSDDatatype.XSDgDay));
        		
        		dateDeathResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), timeResource);
        		diedInDescription.addProperty(model.getObjectProperty(base + "_deathDate"), dateDeathResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
        		
        		diedInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathDate"), diedInDescription);
        		
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
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
        		
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
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathPlace"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        }
        
        OutputStream out = new FileOutputStream("output.rdf");
        model.write(out, "RDF/XML");
	}
	
	public static String refinedgYear(String year) {
		StringBuffer stringBuffer = new StringBuffer("");
		if(year.contains("-")) {
			stringBuffer.append("-");
			if(year.length()<5) {
				int length = year.length() - 1;
				for(; length <4;) {
					stringBuffer.append("0");
					length++;
				}
			}
			stringBuffer.append(year.substring(1));
		}else {
			if(year.length()<4) {
				int length = year.length();
				for(; length <4;) {
					stringBuffer.append("0");
					length++;
				}
			}
			stringBuffer.append(year.substring(0));
		}
		
		return stringBuffer.toString();
	}
	
	public static String checkAd(List<AdministrativeDivision> list, String name) {
		for (AdministrativeDivision administrativeDivision : list) {
			if(administrativeDivision.getName().contains(name)) return administrativeDivision.getName();
		}
		return null;
	}
	
	public static List<AdministrativeDivision> compositeADFile() throws IOException, ParseException {
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
	
	public static List<Dynasty> readDFile() throws IOException, ParseException{
		List<Dynasty> dynasties = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\dynasties.json");
        JSONArray dyArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i = 0; i<dyArray.size(); i++) {
        	JSONObject object = (JSONObject) dyArray.get(i);
        	
        	String name = object.get("name").toString();
        	String startingTime = object.get("startingTime").toString();
        	String endingTime = object.get("endingTime").toString();
        	
        	int s = Integer.parseInt(startingTime);
        	int e = Integer.parseInt(endingTime);
        	
        	dynasties.add(new Dynasty(name, s, e));
        }
		return dynasties;
	}
	
	public static List<Site> readSFile() throws IOException, ParseException{
		List<Site> sites = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\sites.json");
        JSONArray siteArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i = 0; i<siteArray.size(); i++) {
        	JSONObject object = (JSONObject) siteArray.get(i);
        	
        	String name = object.get("name").toString();
        	String type = object.get("type").toString();
        	String location = object.get("location").toString();
        	
        	sites.add(new Site(name, type, location));
        	
        }
		return sites;
	}
	
	public static List<String> readADFile() throws IOException, ParseException{
		List<String> administrativeDivisions = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\testAd.json");
        JSONArray adArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i = 0; i<adArray.size(); i++) {
        	JSONObject object = (JSONObject) adArray.get(i);
        	String name = object.get("name").toString();
        	
        	administrativeDivisions.add(name);
        }
        
		return administrativeDivisions;
	}
	
	public static String prettyfy(String string) {
		return string.replaceAll("https://www.culturaltourism.vn/ontologies#", "").replaceAll("_", " ").replaceAll("\\^\\^http://www.w3.org/2001/XMLSchema#date", "");
	}
	
	public static String datify(String string) {	
		return ""
				+ "ngày "+ string.split("-")[2]
				+ " tháng " + string.split("-")[1]
				+ " năm " + string.split("-")[0]
		;
	}
	
	public static void questionGen() throws IOException {
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
		
//		String filename = "output.rdf";
//		OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
//		model.read(filename);
//		String queryString = "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#>"
//				+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
//				+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
//				+ "PREFIX time: <http://www.w3.org/2006/time#>"
//				+ "SELECT ?object WHERE { ?object rdf:type ?y."
//				+ "?y rdfs:subClassOf* culturaltourism:Site."
//				+ "?object culturaltourism:sitePlace ?x.}"
//				+ "LIMIT 200";
//		Query query = QueryFactory.create(queryString);
//		QueryExecution qe = QueryExecutionFactory.create(query, model);
//		ResultSet results = qe.execSelect();
//		FileWriter writer = new FileWriter("file\\historicalFigureQ.txt", false);
//		while (results.hasNext()) {
//		    QuerySolution solution = results.nextSolution();
//		    RDFNode object = solution.get("object");
//		    writer.write("    - ["+prettyfy(object.toString())+"]{\"entity\": \"object\", \"value\": \"culturaltourism:"+prettyfy(object.toString()).replaceAll(" ", "_")+"\"}"
//		    		+ " [nằm ở]{\"entity\": \"predicate\", \"value\": \"culturaltourism:sitePlace\"} đâu ?\n");
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
		    writer.write("    - ["+datify(prettyfy(object.toString()))+"]" + "{\"entity\": \"object\"} thuộc [triều đại]{\"entity\": \"class\",\"value\": \"culturaltourism:Period\"} nào ?\n");
		}
		qe.close();
		writer.close();
	}
	
	public static void refineSitesFile() throws IOException, ParseException {
		List<Site> sites = new ArrayList<>();
		sites.addAll(readSFile());
		System.out.println(sites.size());
		List<String> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(readADFile());
		for(int i = 0; i<sites.size(); i++) {
			boolean check = false;
			if(sites.get(i).getLocation().equals("Thủ đô Hà Nội")) {
				sites.get(i).setLocation("Thành phố Hà Nội");
				continue;
			}
			if(sites.get(i).getLocation().equals("Bà Rịa-Vũng Tàu")) {
				sites.get(i).setLocation("Tỉnh Bà Rịa - Vũng Tàu");
				continue;
			}
			if(sites.get(i).getLocation().equals("Đăk Lăk")) {
				sites.get(i).setLocation("Tỉnh Đắk Lắk");
				continue;
			}
			if(sites.get(i).getLocation().equals("Đăk Nông")) {
				sites.get(i).setLocation("Tỉnh Đắk Nông");
				continue;
			}
			for(int j = 0; j<administrativeDivisions.size(); j++) {
				if(administrativeDivisions.get(j).toUpperCase().contains(sites.get(i).getLocation().toUpperCase())) {
					sites.get(i).setLocation(administrativeDivisions.get(j));
					check = true;
					break;
				}
			}
		}
		SiteCrawler.writeDatatoFileJSON(sites, "betterSites.json");
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
        

		addDataToOntology();

		
//		questionGen();
		
	}

}















