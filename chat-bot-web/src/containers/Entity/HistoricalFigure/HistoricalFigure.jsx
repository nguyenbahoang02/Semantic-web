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
  console.log(name);
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
            ?x rdfs:label ?label.
            FILTER (LCASE(?label) = LCASE("${name}"@vn))
            ?x a ?type.
            OPTIONAL{
              ?x ontologies:description ?Statement1.
              ?Statement1 ontologies:_description ?description.
            }
            OPTIONAL{
              ?x ontologies:deathDate ?Statement2.
              ?Statement2 ontologies:_deathDate ?timeInstant1.
              ?timeInstant1 time:inDateTime ?des1.
              OPTIONAL{
                ?des1 time:year ?yearDeath.
              }
              OPTIONAL{
                ?des1 time:month ?monthDeath.
              }
              OPTIONAL{
                ?des1 time:day ?dayDeath.
              }
              OPTIONAL{
                ?Statement2 prov:wasDerivedFrom ?ref1.
                ?ref1 ontologies:referenceURL ?urlDeathDate.
              }
            }
            OPTIONAL{
              ?x ontologies:birthDate ?Statement3.
              ?Statement3 ontologies:_birthDate ?timeInstant2.
              ?timeInstant2 time:inDateTime ?des2.
              OPTIONAL{
                ?des2 time:year ?yearBirth.
              }
              OPTIONAL{
                ?des2 time:month ?monthBirth.
              }
              OPTIONAL{
                ?des2 time:day ?dayBirth.
              }
              OPTIONAL{
                ?Statement3 prov:wasDerivedFrom ?ref2.
                ?ref2 ontologies:referenceURL ?urlBirthDate.
              }
            }
            OPTIONAL{
              ?x ontologies:deathPlace ?Statement4.
              ?Statement4 ontologies:_deathPlace ?deathPlace. 
              ?deathPlace rdfs:label ?labelDeathPlace.
              FILTER(lang(?labelDeathPlace) = 'vn')
              OPTIONAL{
                ?Statement4 prov:wasDerivedFrom ?ref3.
                ?ref3 ontologies:referenceURL ?urlDeathPlace.
              }
            }
            OPTIONAL{
              ?x ontologies:birthPlace ?Statement5.
              ?Statement5 ontologies:_birthPlace ?birthPlace.
              ?birthPlace rdfs:label ?labelBirthPlace.
              FILTER(lang(?labelBirthPlace) = 'vn')
              OPTIONAL{
                ?Statement5 prov:wasDerivedFrom ?ref4.
                ?ref4 ontologies:referenceURL ?urlBirthPlace.
              }
            }
            OPTIONAL{
              ?x ontologies:festivalPlace ?Statement6.
              ?Statement6 ontologies:_festivalPlace ?fesPlace.
              ?fesPlace rdfs:label ?labelFesPlace.
              ?x prov:wasDerivedFrom ?ref5.
              ?ref5 ontologies:referenceURL ?urlFestivalPlace.
              FILTER(lang(?labelFesPlace) = 'vn')
            }
            OPTIONAL{
              ?x ontologies:sitePlace ?Statement7.
              ?Statement7 rdfs:label ?labelSitePlace.
              ?x prov:wasDerivedFrom ?ref6.
              ?ref6 ontologies:referenceURL ?urlSitePlace.
              FILTER(lang(?labelSitePlace) = 'vn')
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
                {/* {console.log(entity)} */}
              </div>
            )}
          </div>
        )}
      </HistoricalFigurePage>
    </LayOut>
  );
};

export default HistoricalFigure;
