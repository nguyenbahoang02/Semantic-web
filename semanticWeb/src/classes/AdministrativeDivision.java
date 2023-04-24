package classes;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class AdministrativeDivision {
	String enName;
	String name;
	String boarderDivision;
	List<String> narrowerDivision = new ArrayList<>();
	
	public AdministrativeDivision(String name) {
		this.name = name;
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

	public String getBoarderDivision() {
		return boarderDivision;
	}

	public void setBoarderDivision(String boarderDivision) {
		this.boarderDivision = boarderDivision;
	}

	
	public List<String> getNarrowerDivision() {
		return narrowerDivision;
	}

	public void setNarrowerDivision(List<String> narrowerDivision) {
		this.narrowerDivision = narrowerDivision;
	}

	public void addNarrowerDivision(String narrowerDivision) {
		this.narrowerDivision.add(narrowerDivision);
	}
	
	@Override
	public boolean equals(Object o) {
		AdministrativeDivision oAD = (AdministrativeDivision) o;
		if(this.name.equals(oAD.name)) {
			return true;
		}
		return false;
	}
	
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
