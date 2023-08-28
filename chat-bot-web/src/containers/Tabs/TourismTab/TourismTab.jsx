import { useState, useEffect } from "react";
import { TourismTabContainer } from "./index.style";

const TourismTab = () => {
  const [cityList, setCityList] = useState([]);
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
          "SELECT DISTINCT ?name WHERE {?x a culturaltourism:Festival." +
          "?x culturaltourism:festivalPlace ?Statement." +
          "?Statement culturaltourism:_festivalPlace ?admin." +
          "?admin rdfs:label ?name." +
          "FILTER(lang(?name) = 'en')" +
          "}",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let list = [];
        data.results.bindings.forEach((current) => {
          list.push(current.name.value);
        });
        list.sort((a, b) => (a > b ? 1 : -1));
        setCityList(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <TourismTabContainer>
      <div className="banner">
        <div className="banner-title">TOURISM</div>
      </div>
      <div className="content">
        <div className="city-list">
          {cityList.map((current, index) => {
            return (
              <div className="city" key={index}>
                {current
                  .replace("province", "")
                  .replace("city", "")
                  .replace("commune", "")}
              </div>
            );
          })}
        </div>
        <div className="city-related-entity"></div>
      </div>
    </TourismTabContainer>
  );
};

export default TourismTab;
