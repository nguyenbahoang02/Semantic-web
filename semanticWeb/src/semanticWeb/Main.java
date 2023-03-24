package semanticWeb;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Iterator;

import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.ontology.Ontology;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.RDFNode;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.util.iterator.ExtendedIterator;

public class Main {
	
	private static OntModel ontModel = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM, null);
	private static OntModel model = ModelFactory.createOntologyModel();
	private static String base = "http://www.co-ode.org/ontologies/ont.owl#";
	private static String baseClass = "http://example.com/ontology#";

	public static void main(String[] args) throws IOException {
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
		Resource person = model.createResource(base + "Hoang");
		Resource father = model.createResource(base + "Hung", man);
		ontModel.add(father, hasName, "Bá Hùng");
        ontModel.add(person, hasName,"Bá Hoàng");
        ontModel.add(person, hasAge, model.createTypedLiteral(21));
        ontModel.add(person, hasFather, father);
        OutputStream out = new FileOutputStream("output.rdf");
        ontModel.write(out, "RDF/XML");
//        System.out.println(person.getProperty(hasFather));
        
	}

}
