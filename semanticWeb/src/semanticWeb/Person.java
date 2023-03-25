package semanticWeb;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Person {
	public String hasName;
	public int hasAge;
	public String hasSon[];
	public String hasDaughter[];
	public String hasWife;
	public String hasHusband;
	public String getHasName() {
		return hasName;
	}
	public void setHasName(String hasName) {
		this.hasName = hasName;
	}
	public int getHasAge() {
		return hasAge;
	}
	public void setHasAge(int hasAge) {
		this.hasAge = hasAge;
	}
	public String[] getHasSon() {
		return hasSon;
	}
	public void setHasSon(String[] hasSon) {
		this.hasSon = hasSon;
	}
	public String[] getHasDaughter() {
		return hasDaughter;
	}
	public void setHasDaughter(String[] hasDaughter) {
		this.hasDaughter = hasDaughter;
	}
	public String getHasWife() {
		return hasWife;
	}
	public void setHasWife(String hasWife) {
		this.hasWife = hasWife;
	}
	public String getHasHusband() {
		return hasHusband;
	}
	public void setHasHusband(String hasHusband) {
		this.hasHusband = hasHusband;
	}
	public String getHasMother() {
		return hasMother;
	}
	public void setHasMother(String hasMother) {
		this.hasMother = hasMother;
	}
	public String getHasFather() {
		return hasFather;
	}
	public void setHasFather(String hasFather) {
		this.hasFather = hasFather;
	}
	public String hasMother;
	public String hasFather;
	public Person(String name, int age) {
		this.hasName = name;
		this.hasAge = age;
	}
	
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
