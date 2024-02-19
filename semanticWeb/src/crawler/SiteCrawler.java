package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.net.ConnectException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.compress.harmony.pack200.NewAttribute;
import org.apache.jena.rdf.model.NsIterator;
import org.apache.jena.sparql.function.library.e;
import org.apache.jena.sparql.syntax.syntaxtransform.ElementTransformSubst;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.HistoricalFigure;
import classes.Site;

public class SiteCrawler {

    public static void wikiCrawl() throws IOException {
    	String url = "https://vi.wikipedia.org/wiki/Danh_s%C3%A1ch_Di_t%C3%ADch_qu%E1%BB%91c_gia_Vi%E1%BB%87t_Nam";
        Document doc = Jsoup.connect(url).get();

        doc.select("span.mw-editsection").remove();

        List<Site> sites = new ArrayList<>();
        Elements tbodies = doc.select("tbody");
        int j = 0;
        for(Element tbody : tbodies) {
            if(j == 0) {
                j = 1;
                continue;
            }
            Element parent = tbody.parent();
            Element h3 = parent.previousElementSibling();
            Element than = h3.getElementsByClass("mw-headline").first();
            Elements trs = tbody.getElementsByTag("tr");
            for(Element tr : trs) {
                Elements tds = tr.getElementsByTag("td");
                Site site = new Site();
                site.setLocation(h3.text());
                int i = 0;
                for(Element td : tds){

                    if(i == 0) site.setName(td.text());
                    if(i == 2) {
                    	if(td.text().contains("hóa")) {
                    		site.setType("HistoricalCulturalSite");
                    	}
                    	else if(td.text().contains("nghệ thuật")||td.text().contains("trúc")) {
                    		site.setType("ArtArchitectureSite");
                    	}else if(td.text().contains("cổ")) {
                    		site.setType("ArchaeologicalSite");
                    	}else if(td.text().contains("thắng")) {
                    		site.setType("LandscapeSite");
                    	}else if(td.text().contains("mạng")) {
                    		site.setType("RevolutionarySite");
                    	}else
                    		site.setType("VietnamSite");
                    }
                    
                    i ++;
                }
                if(site.getName() != null) {
                	sites.add(site);
                }
            }
            
        }
        
        writeDatatoFileJSON(sites);
    }
    
    public static void crawlFromDiTichVn() throws IOException {
    	String baseUrl = "http://ditich.vn/FrontEnd/DiTich/Form?do=&ItemId=";
    	List<Site> sites = new ArrayList<>();
    	
    	for(int i = 1865; i<6194; i++) {
    		try {
    			String url = baseUrl + i;
    			Document document = Jsoup.connect(url).get();
    			System.out.println(i);
    			StringBuilder type = new StringBuilder();
    			String name = document.select("#block-harvard-content > article > div > section > div > div.hl__library-info__features > section > h2").text();
    			String address = document.select("#block-harvard-content > article > div > section > div > div.hl__library-info__sidebar > div:nth-child(1) > section > div > div > div.hl__contact-info__address > span").text();
    			Elements info = document.select("#block-harvard-content > article > div > section > div > div.hl__library-info__features > section  div > span:nth-child(2)");
    			Elements pic = document.select("#block-harvard-content > article > div > section > div > div.hl__library-info__hours > section > div > img");
    			Elements coordinate = document.select("#accordion1 > div > div:nth-child(7) > span:nth-child(2)");
    		for (Element e: info) {
    			if (e.text() != "") {
    				if (e.text().contains("Loại hình di tích")) {
    					type.append(e.text());
    				}
    			}
    		}
    		if(name.equals("")) {
    			continue;
    		}
    		Site site = new Site(name, type.toString(), address);
    		site.setRefUrl(url);
    		site.setImgUrl("http://ditich.vn" + pic.attr("src").replaceAll("\\\\", "/"));
    		site.setCoordinate(coordinate.text().replaceAll("Tọa độ: ", "").trim());
    		sites.add(site);
    		
    		}catch (ConnectException e) {

			}
    	}
    	writeDatatoFileJSON(sites, "sitesFromDiTichVn.json");
    }
    
    public static void getHistoricalFigure() throws IOException {
    	List<Site> list = getDataFromFile("refinedSitesFromDiTichVn.json");
    	List<HistoricalFigure> list2 = HistoricalFigureCrawler.getDataFromFile("HFFromWikidataWithTitle2.json");
    	
    	for (Site site : list) {
    		System.out.println(site.getName());
			if (site.getRefUrl()!=null) {
				Document document = Jsoup.connect(site.getRefUrl()).get();
				Element element = document.selectFirst("#block-harvard-content > article > div > section > div > div.hl__library-info__features > section");
				boolean check=false;
				for (HistoricalFigure historicalFigure : list2) {
					if(element.toString().contains(historicalFigure.getName())) {
						site.setMemorizePerson(historicalFigure.getName());
						check=true;
						break;
					}
				}
				if(!check) {
					site.setMemorizePerson(null);
				}
			}
		}
    	
    	writeDatatoFileJSON(list, "refinedSitesFromDiTichVn.json");
    }
    
    public static void addLinkToData() {
    	List<Site> baseList = getDataFromFile("betterSitesFromDiTichVn.json");
    	List<Site> addList = getDataFromFile("rawSitesFromDiTichVn.json");
    	
    	for (Site site : baseList) {
    		String name = site.getName();
			for (Site site2 : addList) {
				String nameString = site2.getName();
				if(name.equals(nameString)) {
					site.setImgUrl(site2.getImgUrl());
					site.setRefUrl(site2.getRefUrl());
					break;
				}
			}
		}
    	
    	writeDatatoFileJSON(baseList, "refinedSitesFromDiTichVn.json");
    }
    
    public static void addCorToData() {
    	List<Site> baseList = getDataFromFile("refinedSitesFromDiTichVn.json");
    	List<Site> addList = getDataFromFile("sitesFromDiTichVn.json");
    	
    	for (Site site : baseList) {
    		String name = site.getName();
			for (Site site2 : addList) {
				String nameString = site2.getName();
				if(name.equals(nameString)) {
					site.setCoordinate(site2.getCoordinate());
					break;
				}
			}
		}
    	
    	writeDatatoFileJSON(baseList, "refinedSitesFromDiTichVn.json");
    } 
    
    public static void writeDatatoFileJSON(List<Site> data) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + "sites.json");
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
    
    public static void writeDatatoFileJSON(List<Site> data, String name) {
		try {
			FileWriter fw = new FileWriter(Config.PATH_FILE + name);
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
    
    public static void changeDegreeToDecimal() {
    	List<Site> baseList = getDataFromFile("refinedSitesFromDiTichVn.json");
    	
    	for (Site site : baseList) {
			if(site.getCoordinate()!=null) {
				
				Pattern pattern = Pattern.compile("\\d+(\\.\\d+)?");
				Matcher matcher = pattern.matcher(site.getCoordinate());
				
				StringBuffer stringBuffer = new StringBuffer("");
				while(matcher.find()) {
					stringBuffer.append(matcher.group());
					stringBuffer.append("~");
				}
				
				String coor = stringBuffer.toString();
				
				double northDegree = Double.parseDouble(coor.split("~")[0]);
				double northMinutes = Double.parseDouble(coor.split("~")[1]);
				double northSeconds = Double.parseDouble(coor.split("~")[2]);
				double eastDegree = Double.parseDouble(coor.split("~")[3]);
				double eastMinutes = Double.parseDouble(coor.split("~")[4]);
				double eastSeconds = Double.parseDouble(coor.split("~")[5]);
				
				double latitude = northDegree + northMinutes/60 + northSeconds/3600;
				double longitude = eastDegree + eastMinutes/60 + eastSeconds/3600;
				
				site.setCoordinate(latitude + "~" + longitude);
				
				System.out.println(site.getImgUrl());
				System.out.println(stringBuffer);
			}
		}
    	
    	writeDatatoFileJSON(baseList, "refinedSitesFromDiTichVn.json");
    }
    
	public static void getImage() {
		List<Site> baseList = getDataFromFile("refinedSitesFromDiTichVn.json");
		for(Site site : baseList) {
			StringBuffer searchParameters = new StringBuffer("Di tích ");
			searchParameters.append(site.getName());
			searchParameters.append(" ");
			searchParameters.append(site.getLocation());
			String result = "";
	        try {
	            String googleUrl = "https://www.google.com/search?tbm=isch&q=" + searchParameters;
	            Document doc1 = Jsoup.connect(googleUrl).get();
	            Element media = doc1.select("[data-src]").first();
	            String sourceUrl = media.attr("abs:data-src");

	            result = "http://images.google.com/search?tbm=isch&q=" + searchParameters + " image source= " + sourceUrl.replace("&quot", "");
	            site.setImgUrl(sourceUrl.replace("&quot", ""));
	            System.out.println(searchParameters);
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
		}
		writeDatatoFileJSON(baseList, "refinedSitesFromDiTichVn_1.json");
	}
    
    public static List<Site> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Site> listSites = new Gson().fromJson(reader,
					new TypeToken<List<Site>>() {
					}.getType());
			
			reader.close();
			return listSites;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
    

}
