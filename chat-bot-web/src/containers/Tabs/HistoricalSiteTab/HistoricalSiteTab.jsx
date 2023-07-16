import { useState, useEffect } from "react";
import { HistoricalSiteContainer } from "./index.style";

const HistoricalSiteTab = () => {
  const [displayContent, setDisplayContent] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3030/culturaltourism/sparql", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query:
          "PREFIX culturaltourism: <https://www.culturaltourism.vn/ontologies#> " +
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
          "PREFIX dbo: <http://dbpedia.org/ontology/> " +
          "PREFIX prov: <http://www.w3.org/ns/prov#> " +
          "SELECT * WHERE {?x a culturaltourism:Site." +
          "?x rdfs:label ?name." +
          "?x dbo:thumbnail ?thumbnail." +
          "?x prov:wasDerivedFrom ?ref." +
          "?ref culturaltourism:referenceURL ?url." +
          "FILTER(lang(?name) = 'vn')" +
          "}",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const randomIndex = Math.floor(
          Math.random() * data.results.bindings.length
        );
        const name = data.results.bindings[randomIndex].name.value;
        const url = data.results.bindings[randomIndex].url.value;
        const thumbnail = data.results.bindings[randomIndex].thumbnail.value;
        setDisplayContent((prevState) => {
          return [
            ...prevState,
            {
              type: "Historical Site",
              name: name,
              thumbnail: thumbnail,
              url: url,
            },
          ];
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <HistoricalSiteContainer>
      <div className="banner">
        <div className="banner-title">HISTORICAL SITE</div>
        <img src={require("../../../img/banner/quoc_tu_giam.jpg")} alt="" />
      </div>
      <div className="content">
        {displayContent.map((item, index) => {
          return (
            <div className="historical-site-parent">
              <div className="historical-site" key={index}>
                <div className="site-name">
                  <div>{item.name}</div>
                </div>
                <div className="site-content">
                  <div className="site-img">
                    <img className="thumbnail" src={item.thumbnail} alt="" />
                  </div>
                </div>
                <div className="site-more-button-area">
                  <div
                    className="site-more-button"
                    onClick={() => {
                      window.open(item.url, "_blank");
                    }}
                  >
                    MORE DETAILS
                  </div>
                </div>
              </div>
              {index <= displayContent.length && <div className="rectangle" />}
            </div>
          );
        })}
      </div>
    </HistoricalSiteContainer>
  );
};

export default HistoricalSiteTab;
