package classes;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class HistoricalFigure {
	String name;
	String dateOfBirth;
	String dateOfDeath;
	String otherName;
	String dynasty;
	String homeTown;
//	List<Integer> historicalSitesId = new ArrayList<>();
//	List<Integer> eventsId = new ArrayList<>();
	String role;

	public HistoricalFigure(String name, String homeTown, String dateOfBirth, String dateOfDeath, String otherName,
			String dynasty, String role) {
		this.name = name;
		this.homeTown = homeTown;
		this.dateOfBirth = dateOfBirth;
		this.dateOfDeath = dateOfDeath;
		this.otherName = otherName;
		this.dynasty = dynasty;
		this.role = role;
	}

	public HistoricalFigure(String name) {
		this.name = name;
	}
	
	public HistoricalFigure(String name, String dateOfBirth, String dateOfDeath) {
		this.name = name;
		this.dateOfBirth = dateOfBirth;
		this.dateOfDeath = dateOfDeath;
	}
	
//	public HistoricalFigure(String name, String homeTown, String dateOfBirth, String dateOfDeath, String otherName,
//			String dynasty, List<Integer> historicalSitesId, List<Integer> eventsId, String role) {
//		this.dateOfBirth = dateOfBirth;
//		this.dateOfDeath = dateOfDeath;
//		this.otherName = otherName;
//		this.dynasty = dynasty;
////		this.historicalSitesId = historicalSitesId;
////		this.eventsId = eventsId;
//		this.role = role;
//	}
	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getHomeTown() {
		return homeTown;
	}


	public void setHomeTown(String homeTown) {
		this.homeTown = homeTown;
	}
	
	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getDateOfDeath() {
		return dateOfDeath;
	}

	public void setDateOfDeath(String dateOfDeath) {
		this.dateOfDeath = dateOfDeath;
	}

	public String getOtherName() {
		return otherName;
	}

	public void setOtherName(String otherName) {
		this.otherName = otherName;
	}

	public String getDynasty() {
		return dynasty;
	}

	public void setDynasty(String dynasty) {
		this.dynasty = dynasty;
	}

//	public List<Integer> getHistoricalSitesId() {
//		return historicalSitesId;
//	}
//
//	public void setHistoricalSitesId(List<Integer> historicalSitesId) {
//		this.historicalSitesId = historicalSitesId;
//	}
//
//	public List<Integer> getEventsId() {
//		return eventsId;
//	}
//
//	public void setEventsId(List<Integer> eventsId) {
//		this.eventsId = eventsId;
//	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

//	public void addHistoricalSiteId(int historicalSiteId) {
//		this.historicalSitesId.add(historicalSiteId);
//	}
//
//	public void addEventId(int eventId) {
//		this.eventsId.add(eventId);
//	}

	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
