import { useState } from "react";
import { QueryTestContainer } from "./index.style.js";
import questions from "./question";

function QueryTest() {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState();
  const [result, setResult] = useState();
  const [language, setLanguage] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const prefix = `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX ontologies: <https://tovie.vn/ontologies#>
  PREFIX time:<http://www.w3.org/2006/time#> `;
  const execQuery = () => {
    fetch("http://34.81.37.126:3030/culturaltourism/sparql", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: prefix + query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let tmp = [];
        resultQuery.forEach((element) => {
          const resultColumn = data.results.bindings.map((current) => {
            return current[element].value;
          });
          tmp = [
            ...tmp,
            {
              label: element,
              value: resultColumn,
            },
          ];
        });
        setResult(tmp);
      });
  };
  const chooseQuestion = (current) => {
    setResultQuery(current.result);
    setQuery(current.query);
    setCurrentQuestion(current.question);
  };
  return (
    <QueryTestContainer>
      <div className="query-test">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <div className="title">Query test</div>

        <div className="content">
          <div className="toggle" onClick={() => setLanguage(!language)}>
            {language ? "Tiếng Việt" : "English"}
          </div>
          <div className="content-body">
            <div className="query-result">
              <div className="query">
                QUERY
                <div className="big box query-box">
                  {"PREFIX xsd: <http://www.w3.org/2001/XMLSchema#"}
                  <br />
                  {"PREFIX owl: <http://www.w3.org/2002/07/owl#>"}
                  <br />
                  {"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"}
                  <br />
                  {"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"}
                  <br />
                  {"PREFIX prov: <http://www.w3.org/ns/prov#>"}
                  <br />
                  {"PREFIX ontologies: <https://tovie.vn/ontologies#>"}
                  <br />
                  {query}
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  Current question:
                  <br />
                  <br />
                  {currentQuestion}
                </div>
                {query !== "" && (
                  <div className="run-btn" onClick={execQuery}>
                    RUN QUERY
                  </div>
                )}
              </div>
              <div className="result">
                RESULT
                {result !== undefined && (
                  <div className="big box">
                    {result.map((current) => {
                      return (
                        <div className="column">
                          <div className="column-label cell">
                            {current.label}
                          </div>
                          {current.value.map((currentLabel) => {
                            return <div className="cell">{currentLabel}</div>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="question-list">
              QUESTIONS LIST
              <div className="question-grid">
                <div className="column">
                  <div className="column-label cell">
                    {language
                      ? "Câu hỏi liên quan đến nhân vật lịch sử"
                      : "Questions related to historical figure"}
                  </div>
                  {questions[language ? "vn" : "en"].map((current, index) => {
                    if (index <= 25)
                      return (
                        <div className="cell-index">
                          <div className="cell index">{index + 1}</div>
                          <div
                            className="cell"
                            key={index}
                            onClick={() => chooseQuestion(current)}
                          >
                            {current.question}
                          </div>
                        </div>
                      );
                  })}
                </div>
                <div className="column">
                  <div className="column-label cell">
                    {language
                      ? "Câu hỏi liên quan đến lễ hội"
                      : "Questions related to festival"}
                  </div>
                  {questions[language ? "vn" : "en"].map((current, index) => {
                    if (index > 25 && index <= 29)
                      return (
                        <div className="cell-index">
                          <div className="cell index">{index - 25}</div>
                          <div
                            className="cell"
                            key={index}
                            onClick={() => chooseQuestion(current)}
                          >
                            {current.question}
                          </div>
                        </div>
                      );
                  })}
                </div>
                <div className="column">
                  <div className="column-label cell">
                    {language
                      ? "Câu hỏi liên quan đến di tích lịch sử"
                      : "Questions related to historical site"}
                  </div>
                  {questions[language ? "vn" : "en"].map((current, index) => {
                    if (index > 29)
                      return (
                        <div className="cell-index">
                          <div className="cell index">{index - 29}</div>
                          <div
                            className="cell"
                            key={index}
                            onClick={() => chooseQuestion(current)}
                          >
                            {current.question}
                          </div>
                        </div>
                      );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryTestContainer>
  );
}

export default QueryTest;
