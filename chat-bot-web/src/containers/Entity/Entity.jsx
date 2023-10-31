import { useParams } from "react-router-dom";
import { capitalizeWords } from "../Utility/CapitalizeWord";
import { getPrefix } from "../Utility/PrefixGetter";
import { useEffect, useState } from "react";
import { HistoricalFigurePage } from "./index.style";
import TopNav from "../TopNav/TopNav";
import { LayOut } from "../Layout/index.style";
import { datilizer } from "../Utility/datilizer";
import { queryWithLabel } from "../Utility/queryWithLabel";
import { queryWithUri } from "../Utility/queryWithUri";

const localDevToPro = (link) => {
  return link.replace("http://localhost:3000/", "https://tovie.vn/");
};

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

  function getUri() {
    return localDevToPro(window.location.href).replace(
      "ontologies/",
      "ontologies#"
    );
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: prefix + queryWithUri(getUri()),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results.bindings.length !== 0) {
          const result = data.results.bindings[0];
          setEntity([
            {
              value: result?.label?.value,
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
              value: getPrefix(result?.type?.value),
              property: "rdfs:type",
            },
            {
              value: getPrefix(result?.rdfType?.value),
              valueRef: result?.rdfType?.value,
              property: "rdf:type",
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
    if (isExisted) return;
    fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: prefix + queryWithLabel(name),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.results.bindings.length !== 0) {
          const result = data.results.bindings[0];
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
