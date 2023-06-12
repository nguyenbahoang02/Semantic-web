package semanticWeb;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import org.apache.jena.riot.protobuf.wire.PB_RDF.RDF_Stream;
import org.apache.jena.vocabulary.RDFS;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.AdministrativeDivision;
import classes.Country;
import classes.Dynasty;
import classes.Ethnic;
import classes.Event;
import classes.Festival;
import classes.HistoricalFigure;
import classes.Site;
import classes.Title;
import crawler.AdministrativeDivisionCrawler;
import crawler.Config;
import crawler.CountryCrawler;
import crawler.DynastyCrawler;
import crawler.EthnicCrawler;
import crawler.EventCrawler;
import crawler.FestivalCrawler;
import crawler.HistoricalFigureCrawler;
import crawler.SiteCrawler;
import crawler.TitleCrawler;

public class Main {
	
	private static OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM, null);
	private static String base = "https://www.culturaltourism.vn/ontologies#";
	
	public static void addDataToOntology() throws IOException, ParseException {
		model.read("Tourism_Ontology.owl");
		
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
		model.setNsPrefix("terms", "http://purl.org/dc/terms/");
		model.setNsPrefix("culturaltourism", "https://www.culturaltourism.vn/ontologies#");
		model.setNsPrefix("dbo", "http://dbpedia.org/ontology/");
		model.setNsPrefix("geo", "http://www.w3.org/2003/01/geo/wgs84_pos#");
		model.setNsPrefix("foaf", "http://xmlns.com/foaf/0.1/");
		
		List<AdministrativeDivision> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(compositeADFile());
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\testAd.json");
        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.createClass(base + "AdministrativeDivision");
        	
        	subject.addProperty(RDFS.label, object.get("enName").toString(), "en");
        	subject.addProperty(RDFS.label, object.get("name").toString(), "vn");
        	
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
        
//        jsonParser = new JSONParser();
//        reader = new FileReader("file\\betterSites.json");
//        objectArray = (JSONArray) jsonParser.parse(reader);
//        
//        for(int i = 0; i<objectArray.size(); i++) {
//        	JSONObject object = (JSONObject) objectArray.get(i);
//        	
//        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
//        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
//        	
//        	String type = object.get("type").toString();
//        	Resource classType = model.getOntClass(base + type);
//        	
//        	model.add(subject, predicate, classType);
//        	
//        	String location = object.get("location").toString();
//        	Resource locationResource = model.createResource(base + location.replaceAll(" ", "_"));
//        	model.add(subject, model.getAnnotationProperty(base + "sitePlace"), locationResource);
//        }
//        
        jsonParser = new JSONParser();
        reader = new FileReader("file\\refinedSitesFromDiTichVn.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i = 0; i<objectArray.size(); i++) {
        	JSONObject object = (JSONObject) objectArray.get(i);
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	
        	Resource classType = model.getOntClass(base + "Site");
        	
        	try {
        		String img = object.get("imgUrl").toString();
            	subject.addProperty(model.createProperty("http://dbpedia.org/ontology/thumbnail"), img);
			} catch (Exception e) {
				
			}
        	
        	try {
				String coorString = object.get("coordinate").toString();
				String lati = coorString.split("~")[0];
				String longi = coorString.split("~")[1];
				
				subject.addProperty(model.createProperty("http://www.w3.org/2003/01/geo/wgs84_pos#lat"), model.createTypedLiteral(Double.parseDouble(lati), XSDDatatype.XSDdouble));
				subject.addProperty(model.createProperty("http://www.w3.org/2003/01/geo/wgs84_pos#long"), model.createTypedLiteral(Double.parseDouble(longi), XSDDatatype.XSDdouble));
			} catch (Exception e) {
				
			}
        	
        	model.add(subject, predicate, classType);
        	
        	String location = object.get("location").toString();
        	Resource locationResource = model.createResource(base + location.replaceAll(" ", "_"));
        	model.add(subject, model.getAnnotationProperty(base + "sitePlace"), locationResource);
        	try {
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
        		
        		model.add(subject, model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        	}catch (Exception e) {
        		
			}
        	
        	try {
        		Resource resource = model.createResource(base + object.get("memorizePerson").toString().replaceAll(" ", "_"));
        		
        		model.add(subject, model.createProperty(base + "memorizePerson"), resource);
        	}catch (Exception e) {
        		
			}
        }
        
        jsonParser = new JSONParser();
        reader = new FileReader("file\\festivalFromLehoiInfo.json");
        objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i = 0; i<objectArray.size(); i++) {
        	
        	JSONObject object = (JSONObject) objectArray.get(i);
        	if(object.get("name").toString().toLowerCase().contains("khách")||object.get("name").toString().contains("%")) continue;
        	
        	Resource subject = model.createResource(base + object.get("name").toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	
        	Resource classType = model.getOntClass(base + "Festival");
        	
        	model.add(subject, predicate, classType);
        	
        	String location = object.get("festivalPlace").toString();
        	Resource locationResource = model.createResource(base + location.replaceAll(" ", "_"));
        	model.add(subject, model.getAnnotationProperty(base + "festivalPlace"), locationResource);
        	
        	Resource resource = model.createResource();
    		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
    		resource.addProperty(model.createProperty(base + "referenceURL"), object.get("urlRef").toString());
    		
    		model.add(subject, model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        }
        
        List<Country> countries = new ArrayList<>();
        countries.addAll(CountryCrawler.getDataFromFile("refinedCountryFromWiki.json"));
        for (Country country : countries) {
        	Resource subject = model.createResource(base + country.getName().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	
        	Resource classType = model.getOntClass(base + "Country");
        	
        	model.add(subject, predicate, classType);
        	
        	Resource resource = model.createResource(base + country.getDynasty().replaceAll(" ", "_"));
        	model.add(subject, model.getProperty(base + "formedInPeriod"), resource);
        	
        	Resource urlResource = model.createResource();
        	urlResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        	urlResource.addProperty(model.createProperty(base + "referenceURL"), country.getUrlRef());
    		
    		model.add(subject, model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), urlResource);
		}
        
        
//        addHFtoOntology("refinedHFFromWikidata.json");
//        addHFtoOntology("refinedHFFromVanSuVn.json");
        addEventsToOntology("rawEventsFromWikipedia.json");
        addHFtoOntology("HFFromWikipedia.json");
        addEthnicToOntology("ethnics.json");
        addTitleToOntology("titles.json");
        addTitleToOntology("titlesFromWiki.json");
        OutputStream out = new FileOutputStream("output.rdf");
        model.write(out, "RDF/XML");
	}
	
	public static void addEventsToOntology(String url) {
		List<Event> events = EventCrawler.getDataFromFile(url);
		
		for (Event event : events) {
			Resource subject = model.createResource(base + event.getName().replaceAll(" ", "_").replaceAll(",", "%2C"));
			Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#HistoricEvent");
        	
        	model.add(subject, predicate, classType);
        	
        	Resource resource = model.createResource();
    		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
    		resource.addProperty(model.createProperty(base + "referenceURL"), event.getUrlRef());
    		
    		model.add(subject, model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        	
		}
	}
	
	public static void addEthnicToOntology(String url) {
		List<Ethnic> ethnics = EthnicCrawler.getDataFromFile(url);
		
		for(Ethnic ethnic : ethnics) {
			
			Resource subject = model.createResource(base + ethnic.getName().replaceAll(" ", "_"));
			Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#Ethnic");
        	
        	subject.addProperty(RDFS.label, engify(ethnic.getName()), "en");
        	subject.addProperty(RDFS.label, ethnic.getName(), "vn");
        	
        	model.add(subject, predicate, classType);
		}
	}
	
	public static void addTitleToOntology(String url) {
		List<Title> titles = TitleCrawler.getDataFromFile(url);
		
		for(Title title : titles) {
			
			Resource subject = model.createResource(base + title.getName().replaceAll(" ", "_"));
			Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#PositionTitle");
        	
        	subject.addProperty(RDFS.label, title.getName(), "vn");
        	try {
        		subject.addProperty(model.getProperty("http://purl.org/dc/elements/1.1/description"), title.getDescription());
			} catch (Exception e) {
				
			}
        	
        	model.add(subject, predicate, classType);
		}
	}
	
	public static void addHFtoOntology(String url) throws IOException, ParseException {
		
		List<AdministrativeDivision> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(compositeADFile());

		List<HistoricalFigure> objectArray = HistoricalFigureCrawler.getDataFromFile(url);
		
        for(HistoricalFigure object : objectArray){
        	
        	Resource subject = model.createResource(base + object.getName().toString().replaceAll(" ", "_"));
        	Property predicate = model.getProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type");
        	Resource classType = model.getOntClass("https://www.culturaltourism.vn/ontologies#HistoricalFigure");
        	
        	subject.addProperty(RDFS.label, object.getEnName().toString(), "en");
        	subject.addProperty(RDFS.label, object.getName().toString(), "vn");
        	subject.addProperty(model.createProperty("http://xmlns.com/foaf/0.1/name"), object.getName(), "vn");
        	subject.addProperty(model.createProperty("http://xmlns.com/foaf/0.1/name"), object.getEnName(), "en");
        	
        	
        	if(object.getOtherName()!=null) {
        		for(String otherName:object.getOtherName()) {
        			subject.addProperty(model.createProperty("http://xmlns.com/foaf/0.1/name"), otherName, "vn");
        		}
        		for(String otherName:object.getOtherNameEn()) {
        			subject.addProperty(model.createProperty("http://xmlns.com/foaf/0.1/name"), otherName, "en");
        		}
        	}
        	
        	model.add(subject, predicate, classType);
        	
        	try {
        		String dateBirthString = object.getDateOfBirth().toString();
        		
        		String yearBirth = null;
        		String monthBirth = null;
        		String dayBirth = null;
        		if(dateBirthString.length()==4) {
        			yearBirth = dateBirthString;
        		}else
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
        		
//        		Resource dateBirthResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "BirthDate");
        		Resource dateBirthResource = model.createResource();
        		dateBirthResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(yearBirth, XSDDatatype.XSDgYear));
        		if(monthBirth!=null)
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#month"), model.createTypedLiteral("--" + monthBirth, XSDDatatype.XSDgMonth));
        		if(dayBirth!=null)
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#day"), model.createTypedLiteral("---" + dayBirth, XSDDatatype.XSDgDay));
        		
        		dateBirthResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), timeResource);
        		bornInDescription.addProperty(model.getObjectProperty(base + "_birthDate"), dateBirthResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.getUrlRef().toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "birthDate"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	
        	try {
        		String dateDeathString = object.getDateOfDeath().toString();
        		
        		String yearDeath = null;
        		String monthDeath = null;
        		String dayDeath = null;
        		if(dateDeathString.length()==4) {
        			yearDeath = dateDeathString;
        		}else
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
        		
//        		Resource dateDeathResource = model.createResource(base + object.get("name").toString().replaceAll(" ", "_") + "DeathDate");
        		Resource dateDeathResource = model.createResource();
        		dateDeathResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#Instant"));
        		
        		
        		Resource timeResource = model.createResource();
        		timeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass("http://www.w3.org/2006/time#DateTimeDescription"));
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#year"), model.createTypedLiteral(yearDeath, XSDDatatype.XSDgYear));
        		if(monthDeath!=null)
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#month"), model.createTypedLiteral("--" + monthDeath, XSDDatatype.XSDgMonth));
        		if(dayDeath!=null)
        		timeResource.addProperty(model.createProperty("http://www.w3.org/2006/time#day"), model.createTypedLiteral("---" + dayDeath, XSDDatatype.XSDgDay));
        		
        		dateDeathResource.addProperty(model.createProperty("http://www.w3.org/2006/time#inDateTime"), timeResource);
        		diedInDescription.addProperty(model.getObjectProperty(base + "_deathDate"), dateDeathResource);
        		
        		Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.getUrlRef().toString());
        		
        		diedInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathDate"), diedInDescription);
        		
        	}catch(Exception e) {
        		
        	}
        	
        	try {
        		String birthPlace = object.getBirthPlace().toString();
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
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.getUrlRef().toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "birthPlace"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	try {
        		String deathPlace = object.getDeathPlace().toString();
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
        		resource.addProperty(model.createProperty(base + "referenceURL"), object.getUrlRef().toString());
        		
        		bornInDescription.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
        		
        		model.add(subject, model.getAnnotationProperty(base + "deathPlace"), bornInDescription);
        		
        	}catch(Exception e) {

        	}
        	
        	try {
        		String positionTitle = object.getPositionTitle();
        		Resource resource = model.createResource(base + positionTitle.replaceAll(" ", "_"));
        		
        		model.add(subject, model.getAnnotationProperty(base + "positionTitle"), resource);
        	}catch (Exception e) {

			}
        	
        	try {
				String description = object.getDescription();
        		
				Resource descript = model.createResource();
				descript.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
        		descript.addProperty(model.createDatatypeProperty(base + "_description"), description);
				
				Resource resource = model.createResource();
        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
        		resource.addProperty(model.createProperty(base + "referenceURL"), "https://vi.wikipedia.org/wiki/"+object.getName().replaceAll(" ", "_"));
        		
        		descript.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
				
        		model.add(subject, model.createAnnotationProperty(base + "description"), descript);
			} catch (Exception e) {
				
			}
        	
        	try {
        		if (object.getTakePartInEvents()!=null) {
					for (String takePartInEvent : object.getTakePartInEvents()) {
						Resource descript = model.createResource();
						descript.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Statement"));
						
		        		Resource takeResource = model.createResource(base + takePartInEvent.replaceAll(" ", "_").replaceAll(",", "%2C"));
		        		takeResource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.getOntClass(base + "HistoricEvent"));
		        		descript.addProperty(model.getObjectProperty(base + "_takePartIn"), takeResource);
		        		
//						Resource resource = model.createResource();
//		        		resource.addProperty(model.createProperty("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), model.createClass(base + "Reference"));
//		        		resource.addProperty(model.createProperty(base + "referenceURL"), "https://vi.wikipedia.org/wiki/"+object.getName().replaceAll(" ", "_"));
//		        		
//		        		descript.addProperty(model.getAnnotationProperty("http://www.w3.org/ns/prov#wasDerivedFrom"), resource);
						
		        		model.add(subject, model.createAnnotationProperty(base + "takePartIn"), descript);
					}
				}
			} catch (Exception e) {
				
			}
        }
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
	
	public static List<Site> readSFile(String url) throws IOException, ParseException{
		List<Site> sites = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\" + url);
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
	
	public static List<HistoricalFigure> readHFFile(String url) throws IOException, ParseException{
		List<HistoricalFigure> historicalFigures = new ArrayList<>();
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("file\\" + url);
        JSONArray adArray = (JSONArray) jsonParser.parse(reader);
		
        for(int i = 0; i<adArray.size(); i++) {
        	JSONObject object = (JSONObject) adArray.get(i);
        	String name = object.get("name").toString();
        	String dateBirth = null;
        	
        	if(object.get("dateOfBirth")!=null) {
        		dateBirth = object.get("dateOfBirth").toString();
        	}
        	String dateDeath = null;
        	if(object.get("dateOfDeath")!=null) {
        		dateDeath = object.get("dateOfDeath").toString();
        	}
        	String dynasty = null;
        	if(object.get("dynasty")!=null) {
        		dynasty = object.get("dynasty").toString();
        	}
        	String birthPlace = null;
        	if(object.get("birthPlace")!=null) {
        		birthPlace = object.get("birthPlace").toString();
        	}
        	String deathPlace = null;
        	if(object.get("deathPlace")!=null) {
        		deathPlace = object.get("deathPlace").toString();
        	}
        	String urlRef = object.get("urlRef").toString();
        	
        	HistoricalFigure historicalFigure = new HistoricalFigure(name);
        	historicalFigure.setDateOfBirth(dateBirth);
        	historicalFigure.setDateOfDeath(dateDeath);
        	historicalFigure.setDynasty(dynasty);
        	historicalFigure.setBirthPlace(birthPlace);
        	historicalFigure.setDeathPlace(deathPlace);
        	historicalFigure.setUrlRef(urlRef);
        	
        	historicalFigures.add(historicalFigure);
        }
        
		return historicalFigures;
	}
	
	public static List<AdministrativeDivision> getAdministrativeDivisionsFromFile(String url) {
		try {                                                                                                                                                                                                                        
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<AdministrativeDivision> listAdministrativeDivisions = new Gson().fromJson(reader,
					new TypeToken<List<AdministrativeDivision>>() {
					}.getType());
			reader.close();
			return listAdministrativeDivisions;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	public static String prettyfy(String string) {
		return string.replaceAll("https://www.culturaltourism.vn/ontologies#", "").replaceAll("_", " ").replaceAll("\\^\\^http://www.w3.org/2001/XMLSchema#date", "");
	}
	
	public static String prettyfy2(String string) {
		return string.replaceAll("https://www.culturaltourism.vn/ontologies#", "culturaltourism:");
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
		
//		String filename = "output.rdf";
//		OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_DL_MEM);
//		model.read(filename);
//		String queryString = "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#>"
//				+ "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"
//				+ "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
//				+ "PREFIX time: <http://www.w3.org/2006/time#>"
//				+ "SELECT ?property WHERE { ?object rdf:type culturaltourism:HistoricalFigure."
//				+ "?object culturaltourism:birthDate ?Statement."
//				+ "?Statement  culturaltourism:_birthDate ?timeInstant."
//				+ "?timeInstant time:inXSDDate ?property}"
//				+ "LIMIT 30";
//		Query query = QueryFactory.create(queryString);
//		QueryExecution qe = QueryExecutionFactory.create(query, model);
//		ResultSet results = qe.execSelect();
//		FileWriter writer = new FileWriter("file\\historicalFigureQ.txt", false);
//		while (results.hasNext()) {
//		    QuerySolution solution = results.nextSolution();
//		    RDFNode object = solution.get("property");
//		    writer.write("    - ["+datify(prettyfy(object.toString()))+"]" + "{\"entity\": \"object\"} thuộc [triều đại]{\"entity\": \"class\",\"value\": \"culturaltourism:Period\"} nào ?\n");
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
				+ "SELECT ?object ?label WHERE { ?object rdf:type culturaltourism:HistoricalFigure."
				+ "?object culturaltourism:birthPlace ?Statement."
				+ "?Statement  culturaltourism:_birthPlace ?admin."
				+ "?admin rdfs:label ?label."
				+ "FILTER (lang(?label) = 'en')}"
				+ "LIMIT 100";
		Query query = QueryFactory.create(queryString);
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		FileWriter writer = new FileWriter("file\\historicalFigureQ.txt", false);
		while (results.hasNext()) {
		    QuerySolution solution = results.nextSolution();
		    RDFNode object = solution.get("object");
//		    RDFNode label = solution.get("label");
		    writer.write("    - [Who]{\"entity\" : \"class\", \"value\": \"culturaltourism:AdministrativeDivision\"} was"
		    		+ " [" + prettyfy(object.toString()) + "]{" + "\"entity\": \"object\", \"value\": \"" + prettyfy2(object.toString())+ "\"}"
		    		+" [born]{\"entity\": \"predicate\", \"value\": \"culturualtourism:birthPlace\"}"	+ "?\n");
		}
		qe.close();
		writer.close();
	}
	
	public static void refineSitesFile() throws IOException, ParseException {
		List<Site> sites = new ArrayList<>();
		sites.addAll(readSFile("sites.json"));
		System.out.println(sites.size());
		List<String> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(readADFile());
		for(int i = 0; i<sites.size(); i++) {
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
					break;
				}
			}
		}
		SiteCrawler.writeDatatoFileJSON(sites, "betterSites.json");
	}
	
	public static String getDynasty(String firstString) {
		String string = null;
		if(firstString.contains("Dựng nước (2000 - 258 trCN)")) {
			string = "Thời kỳ dựng nước";
		}else if(firstString.contains("Nhà Thục (257- 208 trCN)")) {
			string = "Nhà Thục";
		}else if(firstString.contains("Bắc thuộc lần 1 (207 trCN - 39)")) {
			string = "Thời kỳ phong kiến phương Bắc đô hộ lần thứ nhất";
		}else if(firstString.contains("Trưng Nữ Vương (40-43)")) {
			string = "Trưng Nữ Vương";
		}else if(firstString.contains("Bắc thuộc lần 2 (43-542)")) {
			string = "Thời kỳ phong kiến phương Bắc đô hộ lần thứ hai";
		}else if(firstString.contains("Nhà Tiền Lý, Triệu (544-602)")) {
			string = "Nhà tiền Lý và nhà Triệu";
		}else if(firstString.contains("Bắc thuộc lần lần 3 (603-939)")) {
			string = "Thời kỳ phong kiến phương Bắc đô hộ lần thứ ba";
		}else if(firstString.contains("Xây nền tự chủ (905 - 938)")) {
			string = "Thời kỳ xây nền tự chủ";
		}else if(firstString.contains("Nhà Ngô (939-965)")) {
			string = "Nhà Ngô";
		}else if(firstString.contains("Nhà Đinh (968-980)")) {
			string = "Nhà Đinh";
		}else if(firstString.contains("Nhà Lý (1010-1225)")) {
			string = "Nhà Lý";
		}else if(firstString.contains("Nhà Trần (1225-1400)")) {
			string = "Nhà Trần";
		}else if(firstString.contains("Nhà Tiền Lê (980-1009)")) {
			string = "Nhà Tiền Lê";
		}else if(firstString.contains("Nhà Hồ (1400-1407)")) {
			string = "Nhà Hồ";
		}else if(firstString.contains("Hậu Trần (1407-1413)")) {
			string = "Hậu Trần";
		}else if(firstString.contains("Thuộc Minh (1414-1427)")) {
			string = "Thời kỳ thuộc Minh";
		}else if(firstString.contains("Triều Lê Sơ (1428-1527)")) {
			string = "Triều Lê Sơ";
		}else if(firstString.contains("Nam - Bắc Triều (1527-1592)")) {
			string = "Bắc Triều - Nam Triều";
		}else if(firstString.contains("Trịnh - Nguyễn (1533-1788)")) {
			string = "Thời Trịnh - Nguyễn phân tranh";
		}else if(firstString.contains("Nhà Nguyễn độc lập (1802-1883)")) {
			string = "Nhà Nguyễn thời kỳ độc lập";
		}else if(firstString.contains("Pháp đô hộ (1883-1945)")) {
			string = "Thời kì Pháp đô hộ";
		}else if(firstString.contains("Nhà Tây Sơn (1778-1802)")) {
			string = "Nhà Tây Sơn";
		}else if(firstString.contains("Nước Việt Nam mới")) {
			string = "Nước Việt Nam mới";
		}
		
		
		return string;
	}
	
	public static String getBirthDeathDate(String string) {
		StringBuffer stringBuffer = new StringBuffer("");
		
		String birthDate = string.split("-")[0].trim();
		String deathDate = string.split("-")[1].trim();
		
		StringBuffer dateBirth = new StringBuffer("");
		StringBuffer dateDeath = new StringBuffer("");
		
		Pattern pattern = Pattern.compile("\\d+(\\.\\d+)?");
		Matcher matcher = pattern.matcher(birthDate);
		
		if(matcher.find()) {
			dateBirth.append(refinedgYear(matcher.group()));
//			dateBirth.append("-01-01");
		}else {
			dateBirth.append("X");
		}
		
		matcher = pattern.matcher(deathDate);
		if(matcher.find()) {
			dateDeath.append(refinedgYear(matcher.group()));
//			dateDeath.append("-01-01");
		}else {
			dateDeath.append("X");
		}
		
		stringBuffer.append(dateBirth);
		stringBuffer.append("~");
		stringBuffer.append(dateDeath);
		
		return stringBuffer.toString();
	}
	
	public static void refineHistoricalFigureFromVanSu() throws IOException, ParseException {
		List<HistoricalFigure> historicalFigures = new ArrayList<>();
		
		historicalFigures.addAll(readHFFile("historicalFiguresFromVanSuVn.json"));
		
		for(int i = 0 ; i<historicalFigures.size(); i++) {
			String string = historicalFigures.get(i).getDateOfBirth();
			
			String firstString = string.split("~")[0];
			if(firstString.contains("Thời kì")) {
				historicalFigures.get(i).setDynasty(getDynasty(firstString));
				historicalFigures.get(i).setDateOfBirth(null);
			}else {
				String birth = getBirthDeathDate(firstString).split("~")[0];
				if(birth.equals("X")){
					historicalFigures.get(i).setDateOfBirth(null);
				}else {
					historicalFigures.get(i).setDateOfBirth(birth);;
				}
				
				String death = getBirthDeathDate(firstString).split("~")[1];
				if(death.equals("X")){
					historicalFigures.get(i).setDateOfDeath(null);
				}else {
					historicalFigures.get(i).setDateOfDeath(death);
				}
			}
			try{
				String secondString = string.split("~")[1];
				if(secondString.contains("Thời kì")) {
					historicalFigures.get(i).setDynasty(getDynasty(secondString));
					historicalFigures.get(i).setDateOfBirth(null);
				}else {
					String birth = getBirthDeathDate(secondString).split("~")[0];
					if(birth.equals("X")){
						historicalFigures.get(i).setDateOfBirth(null);
					}else {
						historicalFigures.get(i).setDateOfBirth(birth);;
					}
					
					String death = getBirthDeathDate(firstString).split("~")[1];
					if(death.equals("X")){
						historicalFigures.get(i).setDateOfDeath(null);
					}else {
						historicalFigures.get(i).setDateOfDeath(death);
					}
				}
			}catch (Exception e) {
				
			}
		}
		
		HistoricalFigureCrawler.writeDatatoFileJSON(historicalFigures, "refinedHFFromVanSuVn.json");
	}
	
	public static void refineSitesFromDiTichVn() throws IOException, ParseException {
		List<Site> sites = new ArrayList<>();
		sites.addAll(readSFile("sitesFromDiTichVn.json"));
		List<String> administrativeDivisions = new ArrayList<>();
		administrativeDivisions.addAll(readADFile());
		for(int i = 0; i<sites.size(); i++) {
			Boolean check = false;
			String str = sites.get(i).getName().substring(0, 1).toUpperCase() + sites.get(i).getName().substring(1);
			sites.get(i).setName(str);
			int length = sites.get(i).getLocation().split(",").length;
			String preciseLocation = sites.get(i).getLocation().split(",")[length-1].trim().toUpperCase();
			String location = preciseLocation.substring(preciseLocation.indexOf(" ") + 1);
			for(int j = 0; j<administrativeDivisions.size(); j++) {
				if(administrativeDivisions.get(j).toUpperCase().contains(preciseLocation)||administrativeDivisions.get(j).toUpperCase().contains(location)) {
					sites.get(i).setLocation(administrativeDivisions.get(j));
					check = true;
					break;
				}
			}
			if(check==false) {
				try {
					preciseLocation = sites.get(i).getLocation().split(",")[length-2].trim().toUpperCase();
					location = preciseLocation.substring(preciseLocation.indexOf(" ") + 1);
					for(int j = 0; j<administrativeDivisions.size(); j++) {
						if(administrativeDivisions.get(j).toUpperCase().contains(preciseLocation)||administrativeDivisions.get(j).toUpperCase().contains(location)) {
							sites.get(i).setLocation(administrativeDivisions.get(j));
							check = true;
							break;
						}
					}
					
				}catch (Exception e) {
					
				}
			}
			if(check==false) {
				preciseLocation = sites.get(i).getLocation().split(",")[0].trim().toUpperCase();
				location = preciseLocation.substring(preciseLocation.indexOf(" ") + 1);
				for(int j = 0; j<administrativeDivisions.size(); j++) {
					if(administrativeDivisions.get(j).toUpperCase().contains(preciseLocation)||administrativeDivisions.get(j).toUpperCase().contains(location)) {
						sites.get(i).setLocation(administrativeDivisions.get(j));
						check = true;
						break;
					}
				}
			}
		}
		SiteCrawler.writeDatatoFileJSON(sites, "betterSitesFromDiTichVn.json");
	}
	
	public static String engify(String string) {
		return string.replaceAll("[áàãảạăằắẳẵặâầấẩẫậ]", "a").replaceAll("[ÁÀÃẢẠĂẰẮẲẴẶÂẦẤẨẪẬ]", "A").
				replaceAll("[oòóỏõọôốồỗổộơờớởỡợ]", "o").replaceAll("[OÒÓỎÕỌÔỐỒỖỔỘƠỜỚỞỠỢ]", "O").
				replaceAll("[ìíỉĩị]", "i").replaceAll("[ÌÍỈĨỊ]", "I").
				replaceAll("[ỳýỷỹỵ]", "y").replaceAll("[ỲÝỶỸỴ]", "Y").
				replaceAll("[ùúủũụưừứửữự]", "u").replaceAll("[ÙÚỦŨỤƯỪỨỬỮỰ]", "U").
				replaceAll("[èéẻẽẹêềếểễệ]", "e").replaceAll("[ÈÉẺẼẸÊỀẾỂỄỆ]", "E").
				replaceAll("đ", "d").replaceAll("Đ", "D");
	}
	
	public static String vnToEnAd(String string) {
		StringBuffer strBuffer = new StringBuffer();
		
		if(string.toUpperCase().contains("THÀNH PHỐ")) {
			strBuffer.append(engify(string.replaceAll("Thành phố", "").replaceAll("Thành Phố", "").trim()));
			strBuffer.append(" city");
			return strBuffer.toString();
		}
		if(string.toUpperCase().contains("QUẬN")||string.toUpperCase().contains("HUYỆN")) {
			strBuffer.append(engify(string.replaceAll("Quận", "").replaceAll("Huyện", "").trim()));
			strBuffer.append(" district");
			return strBuffer.toString();
		}
		if(string.toUpperCase().contains("TỈNH")) {
			strBuffer.append(engify(string.replaceAll("Tỉnh", "").trim()));
			strBuffer.append(" province");
			return strBuffer.toString();
		}
		if(string.toUpperCase().contains("THỊ TRẤN")||string.toUpperCase().contains("THỊ XÃ")) {
			strBuffer.append(engify(string.replaceAll("Thị trấn", "").replaceAll("Thị Trấn", "").
					replaceAll("Thị xã", "").replaceAll("Thị Xã", "").trim()));
			strBuffer.append(" town");
			return strBuffer.toString();
		}
		if(string.toUpperCase().contains("PHƯỜNG")) {
			strBuffer.append(engify(string.replaceAll("Phường", "").trim()));
			strBuffer.append(" ward");
			return strBuffer.toString();
		}
		if(string.toUpperCase().contains("XÃ")) {
			strBuffer.append(engify(string.replaceAll("Xã", "").trim()));
			strBuffer.append(" commune");
			return strBuffer.toString();
		}
		return strBuffer.toString();
	}
	
	public static void translateAd() {
		List<AdministrativeDivision> list = new ArrayList<>();
		list.addAll(getAdministrativeDivisionsFromFile("testAd.json"));
		
		for (AdministrativeDivision administrativeDivision : list) {
			administrativeDivision.setEnName(vnToEnAd(administrativeDivision.getName()));
		}
		
		AdministrativeDivisionCrawler.writeDatatoFileJSON(list, "testAd.json");
	}
	
	public static void translateHF() {
		List<HistoricalFigure> list = new ArrayList<>();
		list.addAll(HistoricalFigureCrawler.getDataFromFile("refinedHFFromVanSuVn.json"));
		for (HistoricalFigure historicalFigure : list) {
//			historicalFigure.setEnName(engify(historicalFigure.getName()));
			if(historicalFigure.getOtherName()!=null) {
				List<String> otherEnName = new ArrayList<>();
				for(String otherName : historicalFigure.getOtherName()) {
					otherEnName.add(engify(otherName));
				}
				historicalFigure.setOtherNameEn(otherEnName);
			}
		}
		HistoricalFigureCrawler.writeDatatoFileJSON(list, "refinedHFFromVanSuVn.json");
	}
	
	public static void main(String[] args) throws IOException, ParseException {

		addDataToOntology();

//		questionGen();
		
		
	}

}















