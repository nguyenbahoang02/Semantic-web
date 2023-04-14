package classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Dynasty {
	public String name;
	public int startingTime;
	public int endingTime;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getStartingTime() {
		return startingTime;
	}
	public void setStartingTime(int startingTime) {
		this.startingTime = startingTime;
	}
	public int getEndingTime() {
		return endingTime;
	}
	public void setEndingTime(int endingTime) {
		this.endingTime = endingTime;
	}
	
	public Dynasty(String name, int startingTime, int endingTime) {
		super();
		this.name = name;
		this.startingTime = startingTime;
		this.endingTime = endingTime;
	}
	
	
	public Dynasty(String name) {
		super();
		this.name = name;
	}
	
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
