package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import classes.Dynasty;

public class DynastyCrawler {
	
	public static void getDynastyData() throws IOException{
		List<Dynasty> dynasties = new ArrayList<Dynasty>();
		String url = "https://vansu.vn/viet-nam/nien-bieu-lich-su";
		Document document = Jsoup.connect(url).get();
		Elements elements = document.select("a[href]");
		int i = 0;
		for(Element element : elements) {
			i++;
			if(i<7) continue;
			if(i%2==1) continue;
			Dynasty dynasty = new Dynasty(element.text().split("\\(")[0].trim());
			String date = element.text().split("\\(")[1].trim();
			String startingDate = date.split("-")[0].trim();
			try {
			String endingDate = date.split("-")[1].trim();
			int intStartingDate;
			int intEndingDate;
			if(endingDate.contains("trCN")) {
				intEndingDate = Integer.parseInt(endingDate.split("trCN")[0].trim());
				intEndingDate = intEndingDate*(-1);
				intStartingDate = Integer.parseInt(startingDate);
				intStartingDate = intStartingDate*(-1);
			}else if(startingDate.contains("trCN")) {
				intEndingDate = Integer.parseInt(endingDate.split("\\)")[0]);
				intStartingDate = Integer.parseInt(startingDate.split("trCN")[0].trim());
				intStartingDate = intStartingDate*(-1);
			}else if(endingDate.contains("đến nay")) {
				intStartingDate = Integer.parseInt(startingDate);
				intEndingDate = 2023;
			}else {
				intStartingDate = Integer.parseInt(startingDate);
				intEndingDate = Integer.parseInt(endingDate.split("\\)")[0]);
			}
			dynasty.setStartingTime(intStartingDate);
			dynasty.setEndingTime(intEndingDate);
			dynasties.add(dynasty);
			System.out.println(dynasty);
			}catch (Exception e) {
				e.printStackTrace();
			}
		}
		writeDatatoFileJSON(dynasties);
	}
	
	public static void writeDatatoFileJSON(List<Dynasty> data) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + "dynasties.json");
			fw.write("[\n");
			for (int i = 0; i < data.size(); i++) {
				fw.write(data.get(i).toString());
				if (i != data.size() - 1)
					fw.write(",\n");
				else
					fw.write("\n");
			}
			fw.write("\n]");
			fw.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
