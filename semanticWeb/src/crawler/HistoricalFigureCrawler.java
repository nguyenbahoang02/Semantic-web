package crawler;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.HistoricalFigure;

public class HistoricalFigureCrawler{
	
	public List<HistoricalFigure> getDataFromHTML() {
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		String urlSource = "https://nguoikesu.com";
		String url = "https://nguoikesu.com/nhan-vat";
		while (!url.equals("")) {
			try {

				Document docHistoricalFigureHome = Jsoup.connect(url).get();
				Elements eListHistoricalFigures = docHistoricalFigureHome
						.select(".item-content > .page-header > h2 > a ");
				for (Element eHistoricalFigure : eListHistoricalFigures) {
					String name = null;
					name = eHistoricalFigure.text();
					HistoricalFigure historicalFigure = new HistoricalFigure(name);
					listHistoricalFigures.add(historicalFigure);
					System.out.println(historicalFigure);
				}
				Element eNextPage = docHistoricalFigureHome
						.selectFirst(".page-item > a[aria-label=\"Đi tới tiếp tục trang\"]");
				if (eNextPage != null)
					url = urlSource + eNextPage.attr("href");
				else
					url = "";
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return listHistoricalFigures;
	}

	public List<HistoricalFigure> getMoreData(String filePath) throws IOException, ParseException{
		JSONParser jsonParser = new JSONParser();
		FileReader reader = new FileReader(filePath);
		JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
		String crawlBase = "https://dbpedia.org/page/";
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		
		for(int i = 0;	i < objectArray.size(); i++) {
			JSONObject object = (JSONObject) objectArray.get(i);
			String birthDate = null;
			String deathDate = null;
			try {
				Document document = Jsoup.connect(crawlBase+object.get("name").toString().replaceAll(" ", "_")).get();
//			Element element = document.selectFirst("a[href=\"http://dbpedia.org/property/birthDate\"]");
				Element element = document.selectFirst("span[property=\"dbp:birthDate\"]");
				if(element!=null) {
					birthDate = element.text();
				}
				element = document.selectFirst("span[property=\"dbp:deathDate\"]");
				if(element!=null) {
					deathDate = element.text();
				}
			} catch (Exception e) {
				
			}
			HistoricalFigure historicalFigure = new HistoricalFigure(object.get("name").toString(), birthDate, deathDate);
			listHistoricalFigures.add(historicalFigure);
			System.out.println(historicalFigure);
		}
		return listHistoricalFigures;
	}
	
	
	public void writeDatatoFileJSON(List<HistoricalFigure> data) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + "historicalFigures.json");
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