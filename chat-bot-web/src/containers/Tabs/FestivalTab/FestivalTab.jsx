import { useState, useEffect } from "react";
import { FestivalContainer } from "./index.style.js";

const linker = (inputString) => {
  return inputString?.replace(
    "https://chevie.vn/ontologies#",
    "https://chevie.vn/ontologies/"
  );
};

const FestivalTab = () => {
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
          "PREFIX ontologies: <https://chevie.vn/ontologies#> " +
          "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
          "PREFIX dbo: <http://dbpedia.org/ontology/> " +
          "PREFIX prov: <http://www.w3.org/ns/prov#> " +
          "SELECT * WHERE {?x a ontologies:Festival." +
          "?x rdfs:label ?name." +
          "?x dbo:thumbnail ?thumbnail." +
          "?x prov:wasDerivedFrom ?ref." +
          "?ref ontologies:referenceURL ?url." +
          "FILTER(lang(?name) = 'vi')" +
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
              type: "Festival",
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
    <FestivalContainer>
      <div className="banner">
        <div className="banner-title">FESTIVAL</div>
      </div>
      <div className="content">
        <div className="content-grid">
          {displayContent.slice(0, itemNumber).map((item, index) => {
            return (
              <div className="historical-festival-parent" key={index}>
                <div className="festival-img">
                  <img src={item.thumbnail} alt="Ảnh" />
                </div>
                <div className="content-type">Festival</div>
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
