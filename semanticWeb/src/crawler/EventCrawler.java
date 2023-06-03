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

import classes.Event;
import classes.HistoricalFigure;

public class EventCrawler {
	
	private static String getDateFromHtml(String html) {
		if (html.contains("</b>")) {
			int indexEnd;
			int indexStart = 999;
			String dateToHtml = html;
			for (int i = 0; i < html.length(); i++) {
				if (html.charAt(i) == '<' && html.charAt(i + 1) == 'b')
					indexStart = i + 3;
				if (i > indexStart && html.charAt(i) == '<' && html.charAt(i + 1) == '/') {
					indexEnd = i;
					dateToHtml = html.substring(indexStart, indexEnd);
					break;
				}
			}
			return dateToHtml.trim();
		}
		return null;
	}
	
	private static String getEventFromHtml(String html) {
		if (html.contains("</a>")) {
			if (html.contains("</b>")) {
				html = html.replace(getDateFromHtml(html), "");
				html = html.replace("<b>", "");
				html = html.replace("</b>", "");
			}
			while (html.contains("<a")) {
				int indexStart = 999;
				int indexEnd;
				for (int i = 0; i < html.length(); i++) {
					if (html.charAt(i) == '<' && html.charAt(i + 1) == 'a') {
						indexStart = i;
					}
					if (i > indexStart && html.charAt(i) == '>') {
						indexEnd = i + 1;
						String subString = html.substring(indexStart, indexEnd);
						html = html.replace(subString, "");
						indexStart = 999;
					}
				}
			}
			return html.replace("</a>", "").trim();
		}
		return null;
	}
	
	public static void getDataFromWiki() throws IOException {
		List<Event> list = new ArrayList<>();
		String url = "https://vi.wikipedia.org/wiki/Ni%C3%AAn_bi%E1%BB%83u_l%E1%BB%8Bch_s%E1%BB%AD_Vi%E1%BB%87t_Nam";
		Document document = Jsoup.connect(url).get();
		
		Elements data1 = document.select(".mw-parser-output > p");
		Elements data2 = document.select(".mw-parser-output > p+dl > dd");
		
		for (Element i : data1) {
			String date;
			String nameEvent;
			if (i.html().contains("</a>")) {
				date = "năm " + getDateFromHtml(i.html());
				nameEvent = getEventFromHtml(i.html());

				Event event = new Event();
				event.setTime(date);
				event.setName(nameEvent);
				list.add(event);
				System.out.println(event);
			}
		}
		
		for (Element i : data2) {
			String date;
			String nameEvent;

			Element parentOfData2 = i.parent().previousElementSibling();
			String yearData = parentOfData2.html();

			if (getDateFromHtml(i.html()) != null)
				date = getDateFromHtml(i.html()) + " năm " + getDateFromHtml(yearData);
			else
				date = "năm " + getDateFromHtml(yearData);
			nameEvent = getEventFromHtml(i.html());
			Event event = new Event();

			event.setTime(date);
			event.setName(nameEvent);
			list.add(event);
			System.out.println(event);
		}

		writeDatatoFileJSON(list, "rawEventsFromWikipedia.json");
	}
	
	public static List<Event> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Event> listEvent = new Gson().fromJson(reader,
					new TypeToken<List<HistoricalFigure>>() {
					}.getType());
			
			reader.close();
			return listEvent;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	public static void writeDatatoFileJSON(List<Event> data, String url) {
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
}
