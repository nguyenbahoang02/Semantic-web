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
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.HistoricalFigure;
import classes.Title;

public class TitleCrawler {
	
	public static void crawlTitleFromWiki() throws IOException {
		List<Title> titles = new ArrayList<>();
		
		String url = "https://vi.wikipedia.org/wiki/Quan_ch%E1%BA%BF_c%C3%A1c_tri%E1%BB%81u_%C4%91%E1%BA%A1i_qu%C3%A2n_ch%E1%BB%A7_Vi%E1%BB%87t_Nam";
		Document document = Jsoup.connect(url).get();
		Element element = document.selectFirst("#mw-content-text > div.mw-parser-output");
		
		for(int i = 5; i < 319; i++) {
//			System.out.println(element.child(i).text());
			if(element.child(i).text().contains(":")) {
				String string = element.child(i).text().split(":")[1].trim();
				String result = null;
				if(string.contains("(")) {
					int index = string.indexOf("(");
					result = string.substring(0, index);
				}else {
					result = string;
				}
				String[] parts = result.split(",");
				for (String part : parts) {
					Title title = new Title(part.trim());
					titles.add(title);
				}
			}else if(element.child(i).text().contains("-")){
				String string = element.child(i).text().replaceAll("-", "").trim();
				if(string.contains(",")) {
					String result = null;
					if(string.contains("(")) {
						int index = string.indexOf("(");
						result = string.substring(0, index);
					}else {
						result = string;
					}
					String[] parts = result.split(",");
					for (String part : parts) {
						Title title = new Title(part.trim());
						titles.add(title);
					}
				}else {
					if(string.contains("Tả & hữu")){
						String result = string.split("hữu")[1].trim();
						Title title1 = new Title("Tả " + result);
						titles.add(title1);
						Title title2 = new Title("Hữu " + result);
						titles.add(title2);
					}else if(string.contains("tả & hữu")) {
						String result1 = string.split("tả & hữu")[0].trim();
						Title title = new Title(result1);
						titles.add(title);
						String result2 = string.split("tả & hữu")[1].trim();
						Title title1 = new Title("Tả " + result2);
						titles.add(title1);
						Title title2 = new Title("Hữu " + result2);
						titles.add(title2);
					}else {
						String result = null;
						if(string.contains("(")) {
							int index = string.indexOf("(");
							result = string.substring(0, index);
						}else {
							result = string;
						}
						Title title = new Title(result.trim());
						titles.add(title);
					}
				}
			}
		}
		for (Title title : titles) {
			title.setRefUrl(url);
		}
//		System.out.println(titles);
		writeDatatoFileJSON(titles, "titlesFromWiki.json");
	}
	
	public static void crawlTitleFromChinhPhuVn() throws IOException {
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
