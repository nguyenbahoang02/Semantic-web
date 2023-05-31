package classes;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class Country {
	String name;
	String urlRef;
	String dynasty;
	String time;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrlRef() {
		return urlRef;
	}
	public void setUrlRef(String urlRef) {
		this.urlRef = urlRef;
	}
	public String getDynasty() {
		return dynasty;
	}
	public void setDynasty(String dynasty) {
		this.dynasty = dynasty;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	@Override
	public String toString() {
		Gson gson = new GsonBuilder().setPrettyPrinting().create();
		return gson.toJson(this);
	}
}
