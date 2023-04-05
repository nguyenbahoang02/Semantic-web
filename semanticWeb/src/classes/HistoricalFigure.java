package classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class HistoricalFigure {
	String name;
	String dateOfBirth;
	String dateOfDeath;
	String otherName;
	String dynasty;
	String homeTown;
	String role;
	String ethnic;
	String religion;
	String positionTitle;
	String[] historicEvent;
	String birthPlace;
	String deathPlace;
	String urlRef;
	
	
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
	
	
	
	public HistoricalFigure(String name, String dateOfBirth, String dateOfDeath, String birthPlace, String deathPlace, String urlRef) {
		super();
		this.name = name;
		this.dateOfBirth = dateOfBirth;
		this.dateOfDeath = dateOfDeath;
		this.birthPlace = birthPlace;
		this.deathPlace = deathPlace;
		this.urlRef = urlRef;
	}

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

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}


	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
	
	@Override
	public boolean equals(Object o) {
		HistoricalFigure oFigure = (HistoricalFigure) o;
		if(this.name.equals(oFigure.name)) {
			return true;
		}
		return false;
	}
}
