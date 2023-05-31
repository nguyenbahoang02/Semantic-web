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

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import classes.Country;

public class CountryCrawler {
	
	public static void getDataFromHTML() throws IOException {
		
		List<Country> countries = new ArrayList<>();
		String url = "https://vi.wikipedia.org/wiki/T%C3%AAn_g%E1%BB%8Di_Vi%E1%BB%87t_Nam";
		
		Document document = Jsoup.connect(url).get();
		Element element = document.selectFirst("#mw-content-text > div.mw-parser-output > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody");
		for(int i = 2 ; i<24; i++) {
			Country country = new Country();
			country.setName(element.child(i).child(1).text());
			country.setUrlRef(url);
			country.setTime(element.child(i).child(0).text());
			countries.add(country);
		}
		
		writeDatatoFileJSON(countries, "rawCountryFromWiki.json");
	}
	
	public static void setDynasty() {
		List<Country> countries = new ArrayList<>();
		countries.addAll(getDataFromFile("rawCountryFromWiki.json"));
		
		for(Country country : countries) {
			String name = country.getName();
			String time = country.getTime();
			if(name.equals("Văn Lang")) {
				country.setDynasty("Thời kỳ dựng nước");
			}
			if(name.equals("Âu Lạc")) {
				country.setDynasty("Nhà Thục");
			}
			if(name.equals("Nam Việt")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ nhất");
			}
			if(name.equals("Giao Chỉ")&&time.equals("111 TCN–40 CN")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ nhất");
			}
			if(name.equals("Lĩnh Nam")) {
				country.setDynasty("Trưng Nữ Vương");
			}
			if(name.equals("Giao Chỉ")&&time.equals("43–203")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ hai");
			}
			if(name.equals("Giao Châu")&&time.equals("203–544")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ hai");
			}
			if(name.equals("Vạn Xuân")) {
				country.setDynasty("Nhà tiền Lý và nhà Triệu");
			}
			if(name.equals("Giao Châu")&&time.equals("602–679")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ ba");
			}
			if(name.equals("An Nam")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ ba");
			}
			if(name.equals("Trấn Nam")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ ba");
			}
			if(name.equals("Tĩnh Hải quân")) {
				country.setDynasty("Thời kỳ phong kiến phương Bắc đô hộ lần thứ ba");
			}
			if(name.equals("Đại Cồ Việt")) {
				country.setDynasty("Nhà Đinh");
			}
			if(name.equals("Đại Ngu")) {
				country.setDynasty("Nhà Hồ");
			}
			if(name.equals("Giao Chỉ")&&time.equals("1407–1427")) {
				country.setDynasty("Hậu Trần");
			}
			if(name.equals("Đại Việt")) {
				country.setDynasty("Triều Lê Sơ");
			}
			if(name.equals("Việt Nam")&&time.equals("1804–1839")) {
				country.setDynasty("Nhà Nguyễn thời kỳ độc lập");
			}
			if(name.equals("Đại Nam")) {
				country.setDynasty("Nhà Nguyễn thời kỳ độc lập");
			}
			if(name.equals("Đông Dương (Bắc/Trung/Nam Kỳ)")) {
				country.setDynasty("Thời kì Pháp đô hộ");
			}
			if(name.equals("Việt Nam")&&time.equals("từ 1945")) {
				country.setDynasty("Nước Việt Nam mới");
			}
		}
		
		writeDatatoFileJSON(countries, "refinedCountryFromWiki.json");
	}
	
	public static List<Country> getDataFromFile(String url) {
		try {
			Reader reader = Files.newBufferedReader(Paths.get(Config.PATH_FILE + url));
			List<Country> list = new Gson().fromJson(reader,
					new TypeToken<List<Country>>() {
					}.getType());
			
			reader.close();
			return list;

		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	public static void writeDatatoFileJSON(List<Country> data, String url) {
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
