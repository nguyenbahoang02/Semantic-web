package classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Festival {
	String name;
	String relatedToReligion;
	String festivalPlace;
	String relatedToEthnic;
	String festivalMemorizeEvent;
	
	public Festival(String name) {
		super();
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRelatedToReligion() {
		return relatedToReligion;
	}
	public void setRelatedToReligion(String relatedToReligion) {
		this.relatedToReligion = relatedToReligion;
	}
	public String getFestivalPlace() {
		return festivalPlace;
	}
	public void setFestivalPlace(String festivalPlace) {
		this.festivalPlace = festivalPlace;
	}
	public String getRelatedToEthnic() {
		return relatedToEthnic;
	}
	public void setRelatedToEthnic(String relatedToEthnic) {
		this.relatedToEthnic = relatedToEthnic;
	}
	public String getFestivalMemorizeEvent() {
		return festivalMemorizeEvent;
	}
	public void setFestivalMemorizeEvent(String festivalMemorizeEvent) {
		this.festivalMemorizeEvent = festivalMemorizeEvent;
	}
	
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
