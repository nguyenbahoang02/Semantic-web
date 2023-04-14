package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

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
}
