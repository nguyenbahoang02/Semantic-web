package classes;

import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Event {
	String name;
	String time;
	String urlRef;
	ArrayList<String> relatedHF = new ArrayList<>();
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}
	
	public ArrayList<String> getRelatedHF() {
		return relatedHF;
	}

	public void setRelatedHF(ArrayList<String> relatedHF) {
		this.relatedHF = relatedHF;
	}

	public String getUrlRef() {
		return urlRef;
	}

	public void setUrlRef(String urlRef) {
		this.urlRef = urlRef;
	}

	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
