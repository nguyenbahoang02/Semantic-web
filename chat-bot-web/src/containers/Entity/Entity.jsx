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
  return link.replace("http://localhost:3000/", "https://chevie.vn/");
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
  PREFIX ontologies: <https://CHeVIE.vn/ontologies/>
  PREFIX dbo: <http://dbpedia.org/ontology/> 
  PREFIX time:<http://www.w3.org/2006/time#> `;

  const isALink = (input) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(input);
  };

  const linker = (inputString) => {
    return inputString?.replace(
      "https://chevie.vn/ontologies#",
      "https://chevie.vn/ontologies/"
    );
  };

  const getUri = () => {
    return decodeURIComponent(localDevToPro(window.location.href));
  };
  const func1 = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query:
          prefix +
          queryWithUri(
            getUri().replace(
              "https://chevie.vn/ontologies/",
              "https://CHeVIE.vn/ontologies/"
            )
          ),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = data.results.bindings;
        // console.log(result);
        var tmp = [];
        result.forEach((current, index) => {
          if (current.year !== undefined) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.Z.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: datilizer(
                      current.year.value,
                      current?.month?.value,
                      current?.day?.value
                    ),
                    valueRef: undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: datilizer(
                      current.year.value,
                      current?.month?.value,
                      current?.day?.value
                    ),
                    valueRef: undefined,
                  },
                ],
              });
          } else if (current.Z.type !== "bnode") {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.Z.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.Z.value),
                    valueRef: isALink(current.Z.value)
                      ? linker(current.Z.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.Z.value),
                    valueRef: isALink(current.Z.value)
                      ? linker(current.Z.value)
                      : undefined,
                  },
                ],
              });
          } else if (
            current.Z.type === "bnode" &&
            current.ZZ.type === "literal"
          ) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.ZZ.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  },
                ],
              });
          } else if (
            current.Z.type === "bnode" &&
            current.ZZ.type === "uri" &&
            getPrefix(current.ZZ.value) !== "ontologies:Statement"
          ) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1 &&
              !(
                getPrefix(current.Y.value) === "prov:wasDerivedFrom" &&
                getPrefix(current.ZZ.value) === "ontologies:Reference"
              )
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.ZZ.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else if (
              !(
                getPrefix(current.Y.value) === "prov:wasDerivedFrom" &&
                getPrefix(current.ZZ.value) === "ontologies:Reference"
              )
            )
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  },
                ],
              });
          }
        });
        // console.log(tmp);
        setEntity(tmp);
        setIsExisted(true);
        setIsLoading(false);
      })
      .catch((err) => {
        func2();
        console.log(err);
      });
  };
  const func2 = async () => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: prefix + queryWithLabel(decodeURIComponent(name)),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = data.results.bindings;
        console.log(result);
        var tmp = [];
        result.forEach((current, index) => {
          if (current.year !== undefined) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.Z.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: datilizer(
                      current.year.value,
                      current?.month?.value,
                      current?.day?.value
                    ),
                    valueRef: undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: datilizer(
                      current.year.value,
                      current?.month?.value,
                      current?.day?.value
                    ),
                    valueRef: undefined,
                  },
                ],
              });
          } else if (current.Z.type !== "bnode") {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.Z.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.Z.value),
                    valueRef: isALink(current.Z.value)
                      ? linker(current.Z.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.Z.value),
                    valueRef: isALink(current.Z.value)
                      ? linker(current.Z.value)
                      : undefined,
                  },
                ],
              });
          } else if (
            current.Z.type === "bnode" &&
            current.ZZ.type === "literal"
          ) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.ZZ.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  },
                ],
              });
          } else if (
            current.Z.type === "bnode" &&
            current.ZZ.type === "uri" &&
            getPrefix(current.ZZ.value) !== "ontologies:Statement"
          ) {
            if (
              index >= 1 &&
              tmp.findIndex((item) => {
                return item.property === getPrefix(current.Y.value);
              }) !== -1
            ) {
              tmp.filter((item) => {
                if (
                  item.property === getPrefix(current.Y.value) &&
                  item.value.findIndex(
                    (item) => item.value === getPrefix(current.ZZ.value)
                  ) === -1
                ) {
                  return item.value.push({
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  });
                }
                return item;
              });
            } else
              tmp.push({
                property: getPrefix(current.Y.value),
                propertyRef: linker(current.Y.value),
                value: [
                  {
                    value: getPrefix(current.ZZ.value),
                    valueRef: isALink(current.ZZ.value)
                      ? linker(current.ZZ.value)
                      : undefined,
                  },
                ],
              });
          }
        });
        console.log(tmp);
        setEntity(tmp);
        setIsExisted(true);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    func1();
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
                <div className="label">
                  About:{" "}
                  {
                    entity[
                      entity.findIndex(
                        (item) =>
                          item.property === "rdfs:label" ||
                          item.property === "rdf:label"
                      )
                    ]?.value[0].value
                  }
                </div>
                <div className="description-picture">
                  <div className="description">
                    {
                      entity[
                        entity.findIndex(
                          (item) => item.property === "ontologies:description"
                        )
                      ]?.value[0].value
                    }
                  </div>
                  <div className="picture">
                    <img
                      src={
                        entity[
                          entity.findIndex(
                            (item) => item.property === "dbo:thumbnail"
                          )
                        ]?.value[0].value
                      }
                      alt=""
                    ></img>
                  </div>
                </div>
                <div className="table">
                  <div className="row">
                    <div className="property-col">Property</div>
                    <div className="value-col">Value</div>
                  </div>
                  {/* eslint-disable-next-line */}
                  {entity.map((current, index) => {
                    if (
                      current.value !== undefined &&
                      current.property !== "dbo:thumbnail"
                    )
                      return (
                        <div className="row" key={index}>
                          <div
                            className={
                              current.propertyRef !== undefined
                                ? "url property-col"
                                : "property-col"
                            }
                          >
                            <span
                              onClick={() => {
                                if (current.propertyRef !== undefined) {
                                  window.open(current.propertyRef, "_blank");
                                }
                              }}
                            >
                              {current.property}
                            </span>
                          </div>
                          <ul className="value-col">
                            {current.value.map((current, index) => {
                              return (
                                <li key={index + 1000}>
                                  <div
                                    className={
                                      current.valueRef !== undefined
                                        ? "url"
                                        : ""
                                    }
                                  >
                                    <span
                                      onClick={() => {
                                        if (current.valueRef !== undefined) {
                                          window.open(
                                            current.valueRef,
                                            "_blank"
                                          );
                                        }
                                      }}
                                    >
                                      {current.value}
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
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
