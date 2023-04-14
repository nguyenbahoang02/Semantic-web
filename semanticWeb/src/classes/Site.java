package classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Site {
	public String name;
	public String type;
	public String location;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
	public Site() {
		
	}
	
	
	public Site(String name, String type, String location) {
		super();
		this.name = name;
		this.type = type;
		this.location = location;
	}
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
