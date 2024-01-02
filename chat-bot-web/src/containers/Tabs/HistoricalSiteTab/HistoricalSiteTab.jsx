import { useState, useEffect } from "react";
import { HistoricalSiteContainer } from "./index.style";

const linker = (inputString) => {
  return inputString?.replace(
    "https://tovie.vn/ontologies#",
    "https://tovie.vn/ontologies/"
  );
};

const HistoricalSiteTab = () => {
  const [displayContent, setDisplayContent] = useState([]);
  const [itemNumber, setItemNumber] = useState(6);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query:
          "PREFIX ontologies: <https://tovie.vn/ontologies#> " +
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
          "PREFIX dbo: <http://dbpedia.org/ontology/> " +
          "PREFIX prov: <http://www.w3.org/ns/prov#> " +
          "SELECT * WHERE {?x a ontologies:Site." +
          "?x rdfs:label ?name." +
          "?x dbo:thumbnail ?thumbnail." +
          "?x prov:wasDerivedFrom ?ref." +
          "?ref ontologies:referenceURL ?url." +
          "FILTER(lang(?name) = 'vn')" +
          "}",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let tmpData = [];
        data.results.bindings.forEach((data) => {
          const name = data.name.value;
          const url = linker(data.x.value);
          const thumbnail = data.thumbnail.value;
          if (!tmpData.some((obj) => obj.name === name)) {
            tmpData.push({
              type: "Historical Site",
              name: name,
              thumbnail: thumbnail,
              url: url,
            });
          }
        });
        setDisplayContent(tmpData);
      })
      .catch((err) => {
        console.log(err);
      });
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement || document.body;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      if (isAtBottom) {
        setItemNumber((current) => (current += 3));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <HistoricalSiteContainer>
      <div className="banner">
        <div className="banner-title">HISTORICAL SITE</div>
        <img src={require("../../../img/banner/quoc_tu_giam.jpg")} alt="" />
      </div>
      <div className="content">
        <div className="content-grid">
          {displayContent.slice(0, itemNumber).map((item, index) => {
            return (
              <div className="historical-site-parent" key={index}>
                <div className="site-img">
                  <img src={item.thumbnail} alt="Ảnh" />
                </div>
                <div className="content-type">Historical Site</div>
                <div className="name">{item.name}</div>
                <div className="button-area">
                  <div
                    className="read-more"
                    onClick={() => {
                      window.open(item.url, "_blank");
                    }}
                  >
                    READ MORE
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </HistoricalSiteContainer>
  );
};

export default HistoricalSiteTab;
