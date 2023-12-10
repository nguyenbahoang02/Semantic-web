import { useState, useEffect } from "react";
import { HistoricalFigureContainer } from "./index.style";

const linker = (inputString) => {
  return inputString?.replace(
    "https://tovie.vn/ontologies#",
    "https://tovie.vn/ontologies/"
  );
};

const HistoricalFigure = () => {
  const [displayContent, setDisplayContent] = useState([]);
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
          "SELECT * WHERE {?x a ontologies:HistoricalFigure." +
          "?x rdfs:label ?name." +
          "?x ontologies:description ?Statement." +
          "?x dbo:thumbnail ?thumbnail." +
          "?Statement ontologies:_description ?description." +
          "?x prov:wasDerivedFrom ?ref." +
          "?ref ontologies:referenceURL ?url." +
          "FILTER(lang(?name) = 'vn')" +
          "}",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < 3; i++) {
          const randomIndex = Math.floor(
            Math.random() * data.results.bindings.length
          );
          const name = data.results.bindings[randomIndex].name.value;
          const description =
            data.results.bindings[randomIndex].description.value;
          const url = linker(data.results.bindings[randomIndex].x.value);
          const thumbnail = data.results.bindings[randomIndex].thumbnail.value;
          setDisplayContent((prevState) => {
            return [
              ...prevState,
              {
                type: "Historical Figure",
                name: name,
                description: description,
                thumbnail: thumbnail,
                url: url,
              },
            ];
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <HistoricalFigureContainer>
      <div className="banner">
        <div className="banner-title">HISTORICAL FIGURE</div>
      </div>
      <div className="content">
        <div className="content-grid">
          {displayContent.map((item, index) => {
            return (
              <div className="historical-figure-parent" key={index}>
                <div className="figure-img">
                  <img src={item.thumbnail} alt="Ảnh" />
                </div>
                <div className="content-type">Historical Figure</div>
                <div className="name">{item.name}</div>
                <div className="description">{item.description}</div>
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
    </HistoricalFigureContainer>
  );
};

export default HistoricalFigure;
