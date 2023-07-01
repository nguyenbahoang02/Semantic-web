import { useState, useEffect } from "react";
import { HomeTabContainer } from "./index.style";

const HomeTab = () => {
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
        console.log(url);
      })
      .catch((err) => {
        console.log(err);
      });
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
          "SELECT * WHERE {?x a culturaltourism:Festival." +
          "?x rdfs:label ?name." +
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
        setDisplayContent((prevState) => {
          return [
            ...prevState,
            {
              type: "Festival",
              name: name,
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
    <HomeTabContainer>
      <div className="content">
        {displayContent.map((content, index) => {
          if (index % 2 === 0)
            return (
              <div key={index} className="section">
                <div className="sectionContent">
                  <div className="title">{content.type}</div>
                  <div className="name">{content.name}</div>
                  {content.type !== "Historical Site" && (
                    <div className="description">{content.description}</div>
                  )}

                  {content.type === "Historical Site" && (
                    <img className="thumbnail" src={content.thumbnail} alt="" />
                  )}
                </div>
                <div
                  className="button"
                  onClick={() => {
                    window.open(content.url, "_blank");
                  }}
                >
                  <div className="buttonText">See more</div>
                </div>
              </div>
            );
        })}
      </div>
      <div className="footer">
        <div className="about">
          About this project
          <div className="text">
            This project aims to create a chatbot website focused on Vietnamese
            history. The chatbot will serve as a virtual guide, providing users
            with interactive and informative conversations about various aspects
            of Vietnamese history.
          </div>
        </div>
        <div className="contact">Contact us</div>
      </div>
    </HomeTabContainer>
  );
};

export default HomeTab;
