import { useState, useEffect } from "react";
import { HistoricalFigureContainer } from "./index.style";

const HistoricalFigure = () => {
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
          "PREFIX prov: <http://www.w3.org/ns/prov#> " +
          "SELECT * WHERE {?x a culturaltourism:HistoricalFigure." +
          "?x rdfs:label ?name." +
          "?x culturaltourism:description ?Statement." +
          "?Statement culturaltourism:_description ?description." +
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
        const description =
          data.results.bindings[randomIndex].description.value;
        const url = data.results.bindings[randomIndex].url.value;
        setDisplayContent((prevState) => {
          return [
            ...prevState,
            {
              type: "Historical Figure",
              name: name,
              description: description,
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
    <HistoricalFigureContainer>
      <div className="banner">
        <div className="banner-title">HISTORICAL FIGURE</div>
      </div>
      <div className="content">
        {displayContent.map((item, index) => {
          return (
            <div className="historical-figure-parent">
              <div className="historical-figure" key={index}>
                <div className="figure-name">
                  <div>{item.name}</div>
                </div>
                <div className="figure-content">
                  <div className="figure-img">1</div>
                  <div className="figure-text">
                    <div className="figure-description">{item.description}</div>
                    <div className="figure-more-button-area">
                      <div
                        className="figure-more-button"
                        onClick={() => {
                          window.open(item.url, "_blank");
                        }}
                      >
                        MORE DETAILS
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {index <= displayContent.length && <div className="rectangle" />}
            </div>
          );
        })}
      </div>
    </HistoricalFigureContainer>
  );
};

export default HistoricalFigure;
