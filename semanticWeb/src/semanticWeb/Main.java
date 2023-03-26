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
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class Main {
	
	private static OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM, null);
	private static OntModel model = ModelFactory.createOntologyModel();
	private static String base = "http://www.semanticweb.org/admin/ontologies/2023/2/test#";

	public static void main(String[] args) throws IOException, ParseException {
		
		try (InputStream in = new FileInputStream("ontology.owl")) {
		    RDFDataMgr.read(model, in, Lang.RDFXML);
		} catch (IOException e) {
		    e.printStackTrace();
		}
		
//		model.write(System.out);
//		ExtendedIterator<OntProperty> ontProperties = model.listAllOntProperties();
//		while (ontProperties.hasNext()) {
//		    OntProperty property = ontProperties.next();
//		    System.out.println(property.getURI());
//		}
//		ExtendedIterator<OntClass> ontClasses = model.listClasses();
//		while (ontClasses.hasNext()) {
//		    OntClass ontClass = ontClasses.next();
//		    System.out.println(ontClass.getURI());
//		}
		
		ontModel.setNsPrefix("test", base);
		
		Person person1 = new Person("Hoang", 21);
		Person person2 = new Person("Tung", 19);
		Person person3 = new Person("Hung", 54);
		Person person4 = new Person("Ngan", 51);
		Person person5 = new Person("Bao", 77);
		Person person6 = new Person("Son", 75);
		person1.hasFather = person3.hasName;
		person1.hasMother = person4.hasName;
		person2.hasFather = person3.hasName;
		person2.hasMother = person4.hasName;
		String array[] = {person1.hasName, person2.hasName};
		String array1[] = {person3.hasName};
		person3.hasSon = array; 
		person4.hasSon = array;
		person3.hasFather = person5.hasName;
		person3.hasMother = person6.hasName;
		person5.hasSon = array1;
		person6.hasSon = array1;
		List<Person> data = new ArrayList<Person>();
		data.add(person1);
		data.add(person2);
		data.add(person3);
		data.add(person4);
		data.add(person5);
		data.add(person6);
		
		try {
			FileWriter fw = new FileWriter("test.json");
			fw.write("[\n");
			for (int i = 0; i < data.size(); i++) {
				fw.write(data.get(i).toString());
				if (i != data.size() - 1)
					fw.write(",\n");
				else
					fw.write("\n");
			}
			fw.write("\n]");
			fw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader("test.json");
        JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
        
        for(int i =0;i<objectArray.size();i++){
        	JSONObject object = (JSONObject) objectArray.get(i);
        	Resource person = model.createResource(base + object.get("hasName"));
        	ontModel.add(person, model.getOntProperty(base+"hasName"), object.get("hasName").toString());
        	Set<String> set = (Set<String>) object.keySet();
            Iterator<String> iterator = set.iterator();
            while(iterator.hasNext()) {
            	String key = iterator.next();
            	if(key.equals("hasName")) continue;
            	try {
					int value = Integer.parseInt(object.get(key).toString());
					ontModel.add(person, model.getOntProperty(base + key), model.createTypedLiteral(value));
				} catch (NumberFormatException e) {
					String value = object.get(key).toString();
					if(value.charAt(0)=='[') {
						String parts[] = value.replaceAll("\\[|\\]|\"", "").split(",\\s*");;
						for (String part : parts) {
							Resource obj = model.createResource(base + part, model.getOntClass(base + "Person"));
							ontModel.add(person, model.getOntProperty(base + key), obj);
						}
						continue;
					}
					Resource obj = model.createResource(base + value, model.getOntClass(base + "Person"));
					ontModel.add(person, model.getOntProperty(base + key), obj);
				}
            }
        }
        OutputStream out = new FileOutputStream("output.rdf");
        ontModel.write(out, "RDF/XML");
	}

}
