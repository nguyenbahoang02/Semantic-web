import { useState, useEffect } from "react";
import { FestivalContainer } from "./index.style.js";

const FestivalTab = () => {
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
          "SELECT * WHERE {?x a culturaltourism:Festival." +
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
        for (let i = 0; i < 3; i++) {
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
                type: "Festival",
                name: name,
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
    <FestivalContainer>
      <div className="banner">
        <div className="banner-title">FESTIVAL</div>
      </div>
      <div className="content">
        <div className="content-grid">
          {displayContent.map((item, index) => {
            return (
              <div className="historical-festival-parent" key={index}>
                <div className="festival-img">
                  <img src={item.thumbnail} alt="Ảnh" />
                </div>
                <div className="content-type">Historical Figure</div>
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
    </FestivalContainer>
  );
};

export default FestivalTab;
