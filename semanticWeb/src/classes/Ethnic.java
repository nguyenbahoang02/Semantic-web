package classes;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Ethnic {
	String name;
	List<String> otherName = new ArrayList<>();
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<String> getOtherName() {
		return otherName;
	}
	public void setOtherName(List<String> otherName) {
		this.otherName = otherName;
	}
	public Ethnic(String name) {
		super();
		this.name = name;
	}
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().disableHtmlEscaping().create();
		return gson.toJson(this);
	}
}
