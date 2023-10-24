import { useParams } from "react-router-dom";
import { capitalizeWords } from "../../Utility/CapitalizeWord";
import { getPrefix } from "../../Utility/PrefixGetter";
import { useEffect, useState } from "react";
import { HistoricalFigurePage } from "./index.style";
import TopNav from "../../TopNav/TopNav";
import { LayOut } from "../../Layout/index.style";

const HistoricalFigure = ({ tab }) => {
  const [isLoading, setIsLoading] = useState(true);
  const param = useParams();
  const name = capitalizeWords(param.name);
  const [isExisted, setIsExisted] = useState(false);
  const [entity, setEntity] = useState({});
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
            ?x rdfs:label "${name}"@en.
            OPTIONAL{
              ?x a ?type.
            }
            }`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.results.bindings.length !== 0) {
          const result = data.results.bindings[0];
          setEntity({
            type: {
              prefix: getPrefix(result.type.value),
              label: result.type?.label,
            },
          });
          setIsExisted(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    //eslint-disable-next-line
  }, []);

  return (
    <LayOut>
      <TopNav tab={tab} />
      <HistoricalFigurePage>
        {isLoading && <div className="loader" />}
        {!isLoading && (
          <div>
            {!isExisted && <div className="not-found">Page not found</div>}
            {isExisted && (
              <div>
                Loaded
                {console.log(entity)}
              </div>
            )}
          </div>
        )}
      </HistoricalFigurePage>
    </LayOut>
  );
};

export default HistoricalFigure;
