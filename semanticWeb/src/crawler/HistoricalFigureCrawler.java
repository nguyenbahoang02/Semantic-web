package crawler;

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

import classes.AdministrativeDivision;
import classes.Dynasty;
import classes.Event;
import classes.HistoricalFigure;
import classes.Title;

public class HistoricalFigureCrawler{
	
	
//	 public static void getPositionTitleFromWikipedia2() throws IOException {
//		
//		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
//		listHistoricalFigures.addAll(getDataFromFile("refinedHFFromWikidata.json"));
//		listHistoricalFigures.addAll(getDataFromFile("refinedHFFromVanSuVn.json"));
//		
//		
//		List<Title> listTitles = new ArrayList<>();
//		listTitles.addAll(TitleCrawler.getDataFromFile("titles.json"));
//		listTitles.addAll(TitleCrawler.getDataFromFile("titlesFromWiki.json"));
//		
//		String url = "https://vi.wikipedia.org/wiki/";
//		for (HistoricalFigure historicalFigure : listHistoricalFigures) {
//			try {
//				Document docHistoricalFigureHome = Jsoup.connect(url+historicalFigure.getName()).get();
//				Element docElement = docHistoricalFigureHome.selectFirst("#mw-content-text > div.mw-parser-output > p:nth-child(2)");
//				for(Title title : listTitles) {
//					if(docElement.toString().contains(title.getName())) {
//						historicalFigure.setPositionTitle(title.getName());
//						break;
//					}
//				}
//			
//			}
//			catch (Exception e) {
//				
//			}
//		}
//		
//		HistoricalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures, "HFFromWikidataWithTitle2.json");
//	}
	 
	public static void getImg() {
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		listHistoricalFigures.addAll(getDataFromFile("HFFromWikipedia.json"));
		int i=0;
		String url = "https://vi.wikipedia.org/wiki/";
		for (HistoricalFigure historicalFigure : listHistoricalFigures) {
			try {
				Document document = Jsoup.connect(url+historicalFigure.getName()).get();
				Elements elements = document.select("img");
				try {
					Element element = document.selectFirst("td > span > a > img");
					if(!element.attr("src").contains("static")
							&&!element.attr("src").contains("svg")
							&&!element.attr("src").toUpperCase().contains("VIETNAM")
							&&!element.attr("src").contains("raw")
							&&!element.attr("src").contains("Manager")
							&&!element.attr("src").toUpperCase().contains("ICON")
							&&!element.attr("src").toUpperCase().contains("SPACE")
							&&!element.attr("src").toUpperCase().contains("TIMELINE")
							&&!element.attr("src").toUpperCase().contains("MAP")
							&&!element.attr("src").toUpperCase().contains("VIET_NAM")
							&&!element.attr("src").toUpperCase().contains("TODA")
							&&!element.attr("src").toUpperCase().contains("ISLAND")) {
						Pattern pattern = Pattern.compile("(\\d+)px");
						Matcher matcher = pattern.matcher(element.attr("src"));
						if (matcher.find()) {
				            String numberString = matcher.group(1); 
				            int number = Integer.parseInt(numberString); // Convert it to an integer
				            if(number>200) {
				            	System.out.println(element.attr("src").replaceAll("\\\\", "/"));
					        	System.out.println(i++);
					        	historicalFigure.setImgRef("https:" + element.attr("src").replaceAll("\\\\", "/"));
					        	continue;
				            }
				        }else {
				        	System.out.println(element.attr("src").replaceAll("\\\\", "/"));
				        	System.out.println(i++);
				        	historicalFigure.setImgRef("https:" + element.attr("src").replaceAll("\\\\", "/"));
				        	continue;
				        }
					}
				} catch (Exception e) {
					
				}
				for (Element element : elements) {
					if(!element.attr("src").contains("static")
							&&!element.attr("src").contains("svg")
							&&!element.attr("src").toUpperCase().contains("VIETNAM")
							&&!element.attr("src").contains("raw")
							&&!element.attr("src").contains("Manager")
							&&!element.attr("src").toUpperCase().contains("ICON")
							&&!element.attr("src").toUpperCase().contains("SPACE")
							&&!element.attr("src").toUpperCase().contains("LOGIN")
							&&!element.attr("src").toUpperCase().contains("TIMELINE")
							&&!element.attr("src").toUpperCase().contains("MAP")
							&&!element.attr("src").toUpperCase().contains("VIET_NAM")
							&&!element.attr("src").toUpperCase().contains("TODA")
							&&!element.attr("src").toUpperCase().contains("ISLAND")) {
						Pattern pattern = Pattern.compile("(\\d+)px");
						Matcher matcher = pattern.matcher(element.attr("src"));
						if (matcher.find()) {
				            String numberString = matcher.group(1); 
				            int number = Integer.parseInt(numberString); // Convert it to an integer
				            if(number>200) {
				            	System.out.println(element.attr("src").replaceAll("\\\\", "/"));
					        	System.out.println(i++);
					        	historicalFigure.setImgRef("https:" + element.attr("src").replaceAll("\\\\", "/"));
					        	break;
				            }
				        }else {
				        	System.out.println(element.attr("src").replaceAll("\\\\", "/"));
				        	System.out.println(i++);
				        	historicalFigure.setImgRef("https:" + element.attr("src").replaceAll("\\\\", "/"));
				        	break;
				        }
					}
				}
			
			}
			catch (Exception e) {
				
			}
		}
		
		HistoricalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures, "HFFromWikipedia_2.json");
	}
	 
	public static void getDescriptionFromWikipedia() throws IOException {
			
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		listHistoricalFigures.addAll(getDataFromFile("HFFromWikidataWithTitle2.json"));
		
			
		String url = "https://vi.wikipedia.org/wiki/";
		for (HistoricalFigure historicalFigure : listHistoricalFigures) {
			try {
				Document docHistoricalFigureHome = Jsoup.connect(url+historicalFigure.getName()).get();
				Element docElement = docHistoricalFigureHome.selectFirst("#mw-content-text > div.mw-parser-output > p:nth-child(2)");
				historicalFigure.setDescription(docElement.text());
				
			}
			catch (Exception e) {
					
			}
		}
			
		HistoricalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures, "HFFromWikipedia.json");
	}
	
//	public static void getPositionTitleFromWikipedia() throws IOException {
//		
//		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
//		listHistoricalFigures.addAll(getDataFromFile("refinedHFFromWikidata.json"));
//		listHistoricalFigures.addAll(getDataFromFile("refinedHFFromVanSuVn.json"));
//		
//		
//		List<Title> listTitles = new ArrayList<>();
//		listTitles.addAll(TitleCrawler.getDataFromFile("titles.json"));
//		listTitles.addAll(TitleCrawler.getDataFromFile("titlesFromWiki.json"));
//		
//		String url = "https://vi.wikipedia.org/wiki/";
//		for (HistoricalFigure historicalFigure : listHistoricalFigures) {
//			try {
//				Document docHistoricalFigureHome = Jsoup.connect(url+historicalFigure.getName()).get();
//				Element docElement = docHistoricalFigureHome.selectFirst("#mw-content-text > div.mw-parser-output > table");
//				for(int i = 0; i < docElement.childrenSize();i++) {
//					for(int j = 0; j < docElement.child(i).childrenSize(); j++) {
//						if(docElement.child(i).child(j).toString().contains("Nghề nghiệp")) {
//							for(Title title : listTitles) {
//								if(docElement.child(i).child(j).toString().contains(title.getName())) {
//									historicalFigure.setPositionTitle(title.getName());
//									break;
//								}
//							}
//							break;
//						}
//					}
//				}
//			
//			}
//			catch (Exception e) {
//				
//			}
//		}
//		
//		HistoricalFigureCrawler.writeDatatoFileJSON(listHistoricalFigures, "HFFromWikidataWithTitle.json");
//	}
	
	public static List<HistoricalFigure> getDataFromHTML() {
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

	public static List<HistoricalFigure> getDataFromDbpedia(String filePath) throws IOException, ParseException{
		JSONParser jsonParser = new JSONParser();
		FileReader reader = new FileReader(filePath);
		JSONArray objectArray = (JSONArray) jsonParser.parse(reader);
		String crawlBase = "https://dbpedia.org/page/";
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		
		for(int i = 0;	i < objectArray.size(); i++) {
			JSONObject object = (JSONObject) objectArray.get(i);
			String birthDate = null;
			String deathDate = null;
			String birthPlace = null;
			String deathPlace = null;
			try {
				Document document = Jsoup.connect(crawlBase+object.get("name").toString().replaceAll(" ", "_")).get();
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
	
	public static void getTakePartInEvent() {
		List<HistoricalFigure> list = HistoricalFigureCrawler.getDataFromFile("HFFromWikipedia.json");
		List<Event> list2 = EventCrawler.getDataFromFile("rawEventsFromWikipedia.json");
		
		for (Event event : list2) {
			if (event.getRelatedHF()!=null) {
				for (String hfString : event.getRelatedHF()) {
					for(HistoricalFigure historicalFigure : list) {
						if(hfString.toUpperCase().contains(historicalFigure.getName().toUpperCase())) {
							historicalFigure.addTakePartInEvents(event.getName());
						}
					}
				}
			}
		}
		
		writeDatatoFileJSON(list,"HFFromWikipedia.json");
	}
	
	public static void refineDescription() {
		List<HistoricalFigure> list = HistoricalFigureCrawler.getDataFromFile("HFFromWikipedia.json");
		
		for (HistoricalFigure historicalFigure : list) {
			if (historicalFigure.getDescription()!=null) {
				String output = historicalFigure.getDescription().replaceAll("\\[\\d+\\]", "");
				historicalFigure.setDescription(output);
			}
		}
		
		writeDatatoFileJSON(list,"HFFromWikipedia.json");
	}
	
	public static void getDataFromVanSu() throws IOException{
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		
		String url = "https://vansu.vn/viet-nam/viet-nam-nhan-vat?page=";
		String baseUrl = "https://vansu.vn";
		List<String> urlList = new ArrayList<>();
		for(int i=0;i<120;i++) {
			Document document = Jsoup.connect(url + i).get();
			Element prevElement = null;
			Elements elements = document.select("a[href]");
			for(Element element : elements) {
				if(prevElement == null) {
					prevElement = element;
					continue;
				}
				if(element.attr("href").equals(prevElement.attr("href"))){
					urlList.add(element.attr("href"));
				}
				prevElement = element;
			}
		}

		for(int i = 0; i<urlList.size(); i++) {
			Document document = Jsoup.connect(baseUrl + urlList.get(i)).get();
			Elements elements = document.select("body > div.ui.container > table > tbody > tr");
			StringBuffer stringBuffer = new StringBuffer("");
			stringBuffer.append(document.select("body > div.ui.container > div > div.active.section").text());
			stringBuffer.append("~");
			for(Element element : elements) {
				if(element.children().text().contains("Năm sinh")||element.children().text().contains("Thời kì")) {
					System.out.println(element.children().text());
					stringBuffer.append(element.children().text());
					stringBuffer.append("~");
				}
			}
			
			String name = stringBuffer.toString().split("~")[0];
			String urlRef = baseUrl + urlList.get(i);
			String dateBirth = stringBuffer.toString().substring(stringBuffer.toString().indexOf("~")+1);
			
			HistoricalFigure historicalFigure = new HistoricalFigure(name);
			historicalFigure.setUrlRef(urlRef);
			historicalFigure.setDateOfBirth(dateBirth);
			listHistoricalFigures.add(historicalFigure);
		}
		
		
		
		writeDatatoFileJSON(listHistoricalFigures, "historicalFiguresFromVanSuVn.json");
		
	}
	
	public static void getOtherNamesFromVanSu() throws IOException{
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		
		String url = "https://vansu.vn/viet-nam/viet-nam-nhan-vat?page=";
		String baseUrl = "https://vansu.vn";
		List<String> urlList = new ArrayList<>();
		for(int i=0;i<120;i++) {
			System.out.println(i);
			Document document = Jsoup.connect(url + i).get();
			Element prevElement = null;
			Elements elements = document.select("a[href]");
			for(Element element : elements) {
				if(prevElement == null) {
					prevElement = element;
					continue;
				}
				if(element.attr("href").equals(prevElement.attr("href"))){
					urlList.add(element.attr("href"));
				}
				prevElement = element;
			}
		}

		for(int i = 0; i<urlList.size(); i++) {
			Document document = Jsoup.connect(baseUrl + urlList.get(i)).get();
			Elements elements = document.select("body > div.ui.container > table > tbody > tr");
			StringBuffer stringBuffer = new StringBuffer("");
			stringBuffer.append(document.select("body > div.ui.container > div > div.active.section").text());
			stringBuffer.append("~");
			String otherName = null;
			for(Element element : elements) {
				if(element.children().text().contains("Tên khác")) {
					otherName = element.children().text().replaceAll("Tên khác", "").trim();
					break;
				}
			}
			
			String name = stringBuffer.toString().split("~")[0];
			
			List<String> otherNames = new ArrayList<>();
			if(otherName!=null) {
				for (String string : otherName.split("-")) {
					otherNames.add(string.trim());
				}
				System.out.println(otherNames);
			}
			
			HistoricalFigure historicalFigure = new HistoricalFigure(name);
			historicalFigure.setOtherName(otherNames);
			listHistoricalFigures.add(historicalFigure);
		}
		
		
		
		writeDatatoFileJSON(listHistoricalFigures, "otherNamesOfHistoricalFiguresFromVanSuVn.json");
		
	}
	
	public static void addDynasty() throws IOException, ParseException {
		List<HistoricalFigure> historicalFigures = getDataFromFile("evenBetterHistoricalFigures.json");
		List<Dynasty> dynasties = semanticWeb.Main.readDFile();
		for(int i = 0; i<historicalFigures.size(); i++) {
			try {
				String birthYearString = historicalFigures.get(i).getDateOfBirth().split("-")[0];
				int birthYear = Integer.parseInt(birthYearString);
				for(int j = 0; j<dynasties.size(); j++) {
					if(birthYear>=dynasties.get(j).getStartingTime()&&birthYear<=dynasties.get(j).getEndingTime()) {
						historicalFigures.get(i).setDynasty(dynasties.get(j).getName());
						break;
					}
				}
			
			}
			catch(Exception e) {
				String birthYearString = historicalFigures.get(i).getDateOfBirth().split("-")[1];
				int birthYear = Integer.parseInt("-" + birthYearString);
				for(int j = 0; j<dynasties.size(); j++) {
					if(birthYear>=dynasties.get(j).getStartingTime()&&birthYear<=dynasties.get(j).getEndingTime()) {
						historicalFigures.get(i).setDynasty(dynasties.get(j).getName());
						break;
					}
				}
			}
		}
		
		writeDatatoFileJSON(historicalFigures);
	}
	
	public static void addOtherNames() {
		List<HistoricalFigure> historicalFigures = getDataFromFile("refinedHFFromVanSuVn.json");
		List<HistoricalFigure> otherNames = getDataFromFile("otherNamesOfHistoricalFiguresFromVanSuVn.json");
		
		for (HistoricalFigure historicalFigure : historicalFigures) {
			String name = historicalFigure.getName();
			for (HistoricalFigure historicalFigure2 : otherNames) {
				if(historicalFigure2.getOtherName().size()!=0) {
					if(name.equals(historicalFigure2.getName())) {
						historicalFigure.setOtherName(historicalFigure2.getOtherName());
						break;
					}else {
						List<String> otherNameStrings = historicalFigure2.getOtherName();
						for(String nameString : historicalFigure2.getOtherName()) {
							if(nameString.equals(name)) {
								otherNames.remove(nameString);
								otherNameStrings.add(historicalFigure2.getName());
								historicalFigure.setOtherName(otherNameStrings);
								break;
							}
						}
					}
				}
			}
		}
		
		writeDatatoFileJSON(historicalFigures, "refinedHFFromVanSuVn.json");
	}
	
	public static List<HistoricalFigure> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<HistoricalFigure> listHistoricalFigures = new Gson().fromJson(reader,
					new TypeToken<List<HistoricalFigure>>() {
					}.getType());
			
			reader.close();
			return listHistoricalFigures;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	public static void writeDatatoFileJSON(List<HistoricalFigure> data, String url) {
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
	
	public static void writeDatatoFileJSON(List<HistoricalFigure> data) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + "evenBetterHistoricalFigures.json");
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
	
	
	public static List<HistoricalFigure> historicalFiguresFilter(JSONArray unfilteredList, List<String> list) {
		List<HistoricalFigure> listHistoricalFigures = new ArrayList<>();
		for(int i=0; i<unfilteredList.size(); i++) {
			JSONObject object = (JSONObject) unfilteredList.get(i);
			if(list.contains(object.get("wikidataIDLabel").toString())) {
				String name = object.get("wikidataIDLabel").toString();
				String dateOfBirth = null;
				String dateOfDeath = null;
				String birthPlace = null;
				String deathPlace = null;
				try {
					dateOfBirth = object.get("birthDate").toString();
				} catch (Exception e) {
					
				}
				try {
					dateOfDeath = object.get("deathDate").toString();
				} catch (Exception e) {
					
				}
				try {
					birthPlace = object.get("birthPlaceLabel").toString();
				} catch (Exception e) {
					
				}
				try {
					deathPlace = object.get("deathPlaceLabel").toString();
				} catch (Exception e) {
					
				}
				HistoricalFigure historicalFigure = new HistoricalFigure(name, dateOfBirth, dateOfDeath, birthPlace, deathPlace, object.get("wikidataID").toString());
				if(!listHistoricalFigures.contains(historicalFigure))
					listHistoricalFigures.add(historicalFigure);
			}
		}
		
		return listHistoricalFigures;
	}
}










