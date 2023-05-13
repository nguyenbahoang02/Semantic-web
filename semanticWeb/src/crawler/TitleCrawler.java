package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.HistoricalFigure;
import classes.Title;

public class TitleCrawler {
	
	public static void crawlTitle() throws IOException {
		List<Title> titles = new ArrayList<>();
		
		String url = "http://hotovietnam.org/Tin-tuc-va-Su-kien/Khoa-hoc--Lich-su/175-Bang-tra-Cac-chuc-quan-pham-tuoc-hoc-vi-thoi-phong-kien-Viet-Nam";
		Document document = Jsoup.connect(url).get();
		Elements elements = document.select("#wrap > div.main > div.left > div.phathoc > div.frame_title > div.detail > div.noidung");
		
		for(int i = 0; i<163;i++) {
			if(elements.get(0).child(i).text().contains(":")) {
				if(elements.get(0).child(i).text().split(":")[0].trim().equals("Ví dụ")) continue;
				if(elements.get(0).child(i).text().split(":")[0].trim().length()>20) continue;
				Title title = new Title(elements.get(0).child(i).text().split(":")[0].trim());
				title.setDescription(elements.get(0).child(i).text().split(":")[1].trim());
				
				titles.add(title);
			}
		}
		
		writeDatatoFileJSON(titles, "titles.json");
	}
	
	public static void writeDatatoFileJSON(List<Title> data, String url) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + url);
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
	
	public static List<Title> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Title> list = new Gson().fromJson(reader,
					new TypeToken<List<Title>>() {
					}.getType());
			
			reader.close();
			return list;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
