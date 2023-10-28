import { useParams } from "react-router-dom";
import { capitalizeWords } from "../Utility/CapitalizeWord";
import { getPrefix } from "../Utility/PrefixGetter";
import { useEffect, useState } from "react";
import { HistoricalFigurePage } from "./index.style";
import TopNav from "../TopNav/TopNav";
import { LayOut } from "../Layout/index.style";
import { datilizer } from "../Utility/datilizer";

const HistoricalFigure = ({ tab }) => {
  const [isLoading, setIsLoading] = useState(true);
  const param = useParams();
  const name = capitalizeWords(param.name);
  const [isExisted, setIsExisted] = useState(false);
  const [entity, setEntity] = useState();
  const prefix = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX ontologies: <https://tovie.vn/ontologies#>
  PREFIX dbo: <http://dbpedia.org/ontology/> 
  PREFIX time:<http://www.w3.org/2006/time#> `;
  function linker(inputString) {
    return inputString?.replace(/#/g, "/");
  }

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
            ?x rdfs:label ?labelTmp.
            FILTER (LCASE(?labelTmp) = LCASE("${name}"@en) ||LCASE(?labelTmp) = LCASE("${name}"@vn))
            FILTER(lang(?label) = 'vn')
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
              OPTIONAL{
                ?x ontologies:memorizePerson ?Statement8.
                ?Statement8 ontologies:_memorizePerson ?person.
                ?person  rdfs:label ?labelMemorizedPerson.
                FILTER(lang(?labelMemorizedPerson) = 'vn')
              }
            }
            OPTIONAL{
              ?x dbo:thumbnail ?thumbnail.
            }
          }`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results.bindings.length !== 0) {
          const result = data.results.bindings[0];
          console.log(result);
          setEntity([
            {
              value: result.label.value,
              property: "rdfs:label",
            },
            {
              value: result?.thumbnail?.value,
            },
            {
              value: result?.description?.value,
              property: "ontologies:description",
            },
            {
              value: getPrefix(result.type.value),
              property: "rdfs:type",
            },
            {
              value: datilizer(
                result?.yearDeath?.value,
                result?.monthDeath?.value,
                result?.dayDeath?.value
              ),
              property: "ontologies:deathDate",
              valueRef: result?.urlDeathDate?.value,
            },
            {
              value: datilizer(
                result?.yearBirth?.value,
                result?.monthBirth?.value,
                result?.dayBirth?.value
              ),
              property: "ontologies:birthDate",
              valueRef: result?.urlBirthDate?.value,
            },
            {
              value: result?.labelDeathPlace?.value,
              property: "ontologies:deathPlace",
              valueRef: linker(result?.deathPlace?.value),
              ref: result?.urlDeathPlace?.value,
            },
            {
              value: result?.labelBirthPlace?.value,
              property: "ontologies:birthPlace",
              valueRef: linker(result?.birthPlace?.value),
              ref: result?.urlBirthPlace?.value,
            },
            {
              value: result?.labelFesPlace?.value,
              property: "ontologies:festivalPlace",
              valueRef: linker(result?.fesPlace?.value),
              ref: result?.urlFestivalPlace?.value,
            },
            {
              value: result?.labelSitePlace?.value,
              property: "ontologies:sitePlace",
              valueRef: linker(result?.Statement7?.value),
              ref: result?.urlSitePlace?.value,
            },
            {
              value: result?.labelMemorizedPerson?.value,
              property: "ontologies:memorizePerson",
              valueRef: linker(result?.person?.value),
              ref: result?.urlSitePlace?.value,
            },
          ]);
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
              <div className="content">
                <div className="label">About: {entity[0].value}</div>
                <div className="description-picture">
                  <div className="description">{entity[2].value}</div>
                  <div className="picture">
                    <img src={entity[1].value} alt=""></img>
                  </div>
                </div>
                <div className="table">
                  <div className="row">
                    <div className="property-col">Property</div>
                    <div className="value-col">Value</div>
                  </div>
                  {/* eslint-disable-next-line */}
                  {entity.slice(3).map((current, index) => {
                    if (current.value !== undefined)
                      return (
                        <div className="row" key={index}>
                          <div className="property-col">{current.property}</div>
                          <div
                            className={
                              current.valueRef !== undefined
                                ? "url value-col"
                                : "value-col"
                            }
                          >
                            <div
                              onClick={() => {
                                if (current.valueRef !== undefined) {
                                  window.open(current.valueRef, "_blank");
                                }
                              }}
                            >
                              {current.value}
                            </div>
                          </div>
                        </div>
                      );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </HistoricalFigurePage>
    </LayOut>
  );
};

export default HistoricalFigure;
