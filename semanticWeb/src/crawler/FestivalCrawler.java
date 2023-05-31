package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.AdministrativeDivision;
import classes.Festival;
import classes.HistoricalFigure;
import semanticWeb.Main;

public class FestivalCrawler {
	
	protected static JSONArray data = new JSONArray();
	public static JSONObject findObject(String name){
        for( int i = 0; i < data.size(); ++i){
            JSONObject obj = (JSONObject) data.get(i);
            if( ((String) obj.get("tên")).toLowerCase().equals( name.toLowerCase())){
                return obj;
            }
        }
        return null;
    }

    public static JSONArray getData() {
        return data;
    }
	
    public static void getDataFromLehoiInfo() throws IOException {
    	List<Festival> list = new ArrayList<>();
    	String base = "http://lehoi.info";
    	String baseUrl = "http://lehoi.info/";
    	String url = "http://lehoi.info/ha-noi";
    	Document document = Jsoup.connect(url).get();
    	Element element = document.selectFirst("#leftnav");
    	
    	List<String> urlList = new ArrayList<>();
    	List<String> nameList = new ArrayList<>();
    	for(int i = 0; i<63; i++) {
    		if(element.child(i).text().contains("-")) {
    			nameList.add(element.child(i).text());
    			urlList.add("ba-ria-vung-tau");
    		}else {
    			urlList.add(Main.engify(element.child(i).text().toLowerCase()).replaceAll(" ", "-").trim());
    			nameList.add(element.child(i).text());
    		}
    	}
    	int k = -1;
    	for(String nameString : urlList) {
    		k++;
    		try {
    			for(int i = 1; i<100;i++) {
    				Document doc = Jsoup.connect(baseUrl + nameString + "/page" + i).get();
    				Element ele = doc.selectFirst("#main > div.content > div.listview > ul");
    				try {
    					for(int j = 0; j<1000; j++) {
    						Festival festival = new Festival(ele.child(j).child(0).text());
    						festival.setUrlRef(base + ele.child(j).child(0).attr("href"));
    						festival.setFestivalPlace(nameList.get(k));
    						list.add(festival);
    					}	
    				} catch (Exception e) {
    					
    				}
    			}	
			} catch (Exception e) {
				
			}
    		
    	}
    	
    	writeDatatoFileJSON(list, "rawFestivalFromLehoiInfo.json");
    }
    
    public static void refineDataFromLehoiInfo() {
    	List<Festival> list = new ArrayList<>();
    	List<Festival> newList = new ArrayList<>();
    	list.addAll(readFestivalsFromFile("rawFestivalFromLehoiInfo.json"));
    	for (Festival festival : list) {
    		boolean check = true;
    		if(festival.getName().equals("")) {
				continue;
			}
    		for (Festival festival2 : newList) {
				if(festival2.getName().equals(festival.getName())) {
					check = false;
					break;
				}
			}
			if(check == true) {
				newList.add(festival);
			}
		}
    	
    	writeDatatoFileJSON(newList, "refinedFestivalFromLehoiInfo.json");
    }
    
	public static void get() {
		List<Festival> list = new ArrayList<>();
        String url = "https://vi.wikipedia.org/wiki/L%E1%BB%85_h%E1%BB%99i_Vi%E1%BB%87t_Nam#";
        try {
            Document document = Jsoup.connect(url).get();
            Elements table = document.getElementsByClass("prettytable wikitable");
            Elements elements = Objects.requireNonNull(table.first()).getElementsByTag("tr");
            for (int j = 1; j < elements.size(); j++) {
                try {
                    Elements d = elements.get(j).select("td");
                    String name = getName(d.get(2));
                    JSONObject tmp = findObject(name);
                    if (tmp == null) {
                    	Festival festival = new Festival(name);
                    	festival.setFestivalPlace(getLocation(d.get(1)));
                    	list.add(festival);
                    }
                    
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
        	e.printStackTrace();
        }
        writeDatatoFileJSON(list, "rawFestival.json");
    }

	public static void getMoreData() {
        String url = "https://vi.wikipedia.org/wiki/L%E1%BB%85_h%E1%BB%99i_Vi%E1%BB%87t_Nam#";
        List<Festival> listFestivals = new ArrayList<>();
        try {
            Document document = Jsoup.connect(url).get();
            Elements table2 = document.getElementsByClass("mw-parser-output");
            Elements tds = Objects.requireNonNull(table2.first()).getElementsByTag("ul");
            Elements td = tds.get(10).select("li");
            for (Element element : td) {
                //tach dia diem, le hoi
                List<String> list = new ArrayList<>();
                String a = element.select("li").text();
                Collections.addAll(list, a.split(": ", 0));
                String location = list.get(0);
                // tach le hoi
                List<String> listFes = new ArrayList<>();
                String tmp = list.get(1).replaceAll("\\(.*?\\)", "");
                Collections.addAll(listFes, tmp.split("[,\\;]", 0));
                // tach ngay
                for (int k = 0; k < listFes.size(); k++) {
                    String str = listFes.get(k).replaceAll("[^0-9/-]", " ");
                    List<String> m = new ArrayList<>();
                    Collections.addAll(m, str.split(" ", 0));
                    String name = listFes.get(k);
                    if (name == null) break;
                    JSONObject tp = findObject(name);
                    if (tp == null) {
                        Festival ctr = new Festival(name);
                        ctr.setName(name);
                        ctr.setFestivalPlace(location);
                        listFestivals.add(ctr);
                    }
                }

            }
        } catch (IOException e) {
            System.out.println("Error getData in DynastyWiki 2");
        }
        writeDatatoFileJSON(listFestivals, "rawFestival3.json");
    }
	
	public static List<Festival> readFestivalsFromFile(String url){
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Festival> listFestival = new Gson().fromJson(reader,
					new TypeToken<List<Festival>>() {
					}.getType());
			
			reader.close();
			return listFestival;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	public static void refineFestivals(List<Festival> list){
		List<AdministrativeDivision> list2 = Main.getAdministrativeDivisionsFromFile("testAd.json");
		for (Festival festival : list) {
			if (festival.getName().contains("\"")) {
				festival.setName(festival.getName().replaceAll("\"", ""));
			}
			if (festival.getName().contains("“")) {
				festival.setName(festival.getName().replaceAll("“", ""));
			}
			if (festival.getName().contains("”")) {
				festival.setName(festival.getName().replaceAll("”", ""));
			}
			boolean check = false;
			String location = festival.getFestivalPlace();
			if(location.equals("Đăk Lăk")) {
				festival.setFestivalPlace("Tỉnh Đắk Lắk");
				continue;
			}
			if(location.equals("Đăk Nông")) {
				festival.setFestivalPlace("Tỉnh Đắk Nông");
				continue;
			}
			if(location.equals("TP Hồ Chí Minh")) {
				festival.setFestivalPlace("Thành phố Hồ Chí Minh");
				continue;
			}
			for (AdministrativeDivision administrativeDivision : list2) {
				String adName = administrativeDivision.getName();
				if(adName.contains(location)) {
					festival.setFestivalPlace(adName);
					check = true;
					break;
				}
			}
			if(!check) System.out.println(location);
		}
		writeDatatoFileJSON(list, "refinedFestivalFromLehoiInfo.json");
	}
	
	public static void writeDatatoFileJSON(List<Festival> data, String url) {
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


    public static String getLocation(Element element) {
        return element.text();
    }

    private static String getName(Element element) {
        return element.text();
    }
}
