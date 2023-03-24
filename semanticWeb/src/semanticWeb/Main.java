package semanticWeb;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.ontology.Ontology;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.util.iterator.ExtendedIterator;

public class Main {

	public static void main(String[] args) throws IOException {
		OntModel model = ModelFactory.createOntologyModel();
		String base = "http://www.co-ode.org/ontologies/ont.owl#";
		String baseClass = "http://example.com/ontology#";
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
		OntProperty hasName = model.getOntProperty(base + "hasName");
		OntProperty hasAge = model.getOntProperty(base + "hasAge");
		OntProperty hasFather = model.getOntProperty(base + "hasFather");
		OntClass man = model.getOntClass(baseClass + "Man");
		Resource person = model.createResource("http://example.com/ontology#Hoang");
		Resource father = model.createResource("http://example.com/ontology#Hung", man);
		father.addProperty(hasName, "Ba Hung");
        person.addProperty(hasName, "Ba Hoang");
        person.addProperty(hasAge, model.createTypedLiteral(35));
        person.addProperty(hasFather, father);
//        System.out.println(person.getProperty(hasFather));
        System.out.println(father instanceof man);
        
	}

}
