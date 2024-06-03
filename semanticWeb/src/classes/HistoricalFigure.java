package classes;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class HistoricalFigure { 
	List<String> otherNameEn = new ArrayList<>();
	String enName;
	String name;
	String dateOfBirth;
	String dateOfDeath;
	List<String> otherName = new ArrayList<>();
	String dynasty;
	String homeTown;
	String role;
	String ethnic;
	String religion;
	String[] positionTitle;
	String[] historicEvent;
	String[] cha;
	String[] anh;
	String[] chị;
	String[] chồng;
	String[] con;
	public String[] getCon() {
		return con;
	}

	public void setCon(String[] con) {
		this.con = con;
	}

	public String[] getCha() {
		return cha;
	}

	public void setCha(String[] cha) {
		this.cha = cha;
	}

	public String[] getAnh() {
		return anh;
	}

	public void setAnh(String[] anh) {
		this.anh = anh;
	}

	public String[] getChị() {
		return chị;
	}

	public void setChị(String[] chị) {
		this.chị = chị;
	}

	public String[] getChồng() {
		return chồng;
	}

	public void setChồng(String[] chồng) {
		this.chồng = chồng;
	}

	public String[] getEmTrai() {
		return emTrai;
	}

	public void setEmTrai(String[] emTrai) {
		this.emTrai = emTrai;
	}

	String[] emTrai;
	String birthPlace;
	String deathPlace;
	String urlRef;
	String description;
	String imgRef;
	List<String> takePartInEvents = new ArrayList<>();
	
	
	public String getImgRef() {
		return imgRef;
	}

	public void setImgRef(String imgRef) {
		this.imgRef = imgRef;
	}

	public HistoricalFigure(String name, String homeTown, String dateOfBirth, String dateOfDeath, List<String> otherName,
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
	
	public List<String> getTakePartInEvents() {
		return takePartInEvents;
	}

	public void setTakePartInEvents(List<String> takePartInEvents) {
		this.takePartInEvents = takePartInEvents;
	}

	public void addTakePartInEvents(String takePartInEvents) {
		if(this.takePartInEvents==null) {
			this.takePartInEvents = new ArrayList<>();
		}
		this.takePartInEvents.add(takePartInEvents);
	}
	
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String[] getPositionTitle() {
		return positionTitle;
	}

	public void setPositionTitle(String[] positionTitle) {
		this.positionTitle = positionTitle;
	}

	public List<String> getOtherNameEn() {
		return otherNameEn;
	}

	public void setOtherNameEn(List<String> otherNameEn) {
		this.otherNameEn = otherNameEn;
	}

	public List<String> getOtherName() {
		return otherName;
	}

	public void setOtherName(List<String> otherName) {
		this.otherName = otherName;
	}

	public String getEnName() {
		return enName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
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

	
	
	public String getBirthPlace() {
		return birthPlace;
	}

	public void setBirthPlace(String birthPlace) {
		this.birthPlace = birthPlace;
	}

	public String getDeathPlace() {
		return deathPlace;
	}

	public void setDeathPlace(String deathPlace) {
		this.deathPlace = deathPlace;
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
	
	@Override
	public boolean equals(Object o) {
		HistoricalFigure oFigure = (HistoricalFigure) o;
		if(this.name.equals(oFigure.name)) {
			return true;
		}
		return false;
	}
}
