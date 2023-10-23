import { useParams } from "react-router-dom";
import { capitalizeWords } from "../../Utility/CapitalizeWord";
import { useEffect, useState } from "react";
import { HistoricalFigurePage } from "./index.style";

const HistoricalFigure = () => {
  const [isLoading, setIsLoading] = useState(true);
  const param = useParams();
  const name = capitalizeWords(param.name);

  const prefix = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX ontologies: <https://tovie.vn/ontologies#>
  PREFIX time:<http://www.w3.org/2006/time#> `;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query:
          prefix +
          `SELECT * WHERE { 
          ?x a ontologies:HistoricalFigure. 
          ?x rdfs:label "${name}"@en. 
          }`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    //eslint-disable-next-line
  }, []);

  return (
    <HistoricalFigurePage>
      {isLoading && <div>Loading</div>}
      {!isLoading && <div>Loaded</div>}
    </HistoricalFigurePage>
  );
};

export default HistoricalFigure;
