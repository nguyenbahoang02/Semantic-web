package crawler;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import classes.AdministrativeDivision;

public class AdministrativeDivisionCrawler {

	public static void writeDatatoFileJSON(List<AdministrativeDivision> data, String url) {
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
