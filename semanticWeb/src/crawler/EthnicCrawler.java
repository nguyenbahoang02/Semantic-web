package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.Ethnic;
import classes.HistoricalFigure;

public class EthnicCrawler {
	
	public static ArrayList<String> getOtherName(String string){
		if(string.length()==0) return null;
		ArrayList<String> list = new ArrayList<>(Arrays.asList(string.split(",")));
		
		for(int i = 0; i<list.size(); i++) {
			list.set(i, list.get(i).trim());
		}
		
		return list;
	}
	
	public static void crawlEthnic() throws IOException {
		List<Ethnic> ethnics = new ArrayList<>();
		
		String url = "https://chinhphu.vn/dan-toc/danh-sach-cac-dan-toc-viet-nam-10000494";
		Document document = Jsoup.connect(url).get();
		Elements elements = document.select("#ctrl_190584_22_ArticleDetailControl > div.ArticleContent > div > table > tbody");
		for(int i = 1; i<55; i++) {
			String name = null;

			if(elements.get(0).child(i).child(1).text().trim().contains("(")) {
				name = elements.get(0).child(i).child(1).text().trim().split("\\(")[0].trim();
			}else name = elements.get(0).child(i).child(1).text().trim();
			
			Ethnic ethnic = new Ethnic(name);
			ethnic.setOtherName(getOtherName(elements.get(0).child(i).child(2).text()));
			
			ethnics.add(ethnic);
		}
		
		writeDatatoFileJSON(ethnics, "ethnics.json");
	}
	
	public static void writeDatatoFileJSON(List<Ethnic> data, String url) {
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
	
	public static List<Ethnic> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Ethnic> list = new Gson().fromJson(reader,
					new TypeToken<List<Ethnic>>() {
					}.getType());
			
			reader.close();
			return list;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
