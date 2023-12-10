import { useState } from "react";
import { QueryTestContainer } from "./index.style.js";
import questions from "./question";
import { getLabel } from "../Utility/getLabelFromQuery.js";

function QueryTest() {
  const [result, setResult] = useState();
  const [language, setLanguage] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [queryText, setQueryText] = useState("");

  const prefix = `  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  PREFIX owl: <http://www.w3.org/2002/07/owl#>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX prov: <http://www.w3.org/ns/prov#>
  PREFIX ontologies: <https://tovie.vn/ontologies#>
  PREFIX time:<http://www.w3.org/2006/time#>
  `;
  const execQuery = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/culturaltourism/sparql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        query: queryText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let tmp = [];
        getLabel(queryText).forEach((element) => {
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const chooseQuestion = (current) => {
    setCurrentQuestion(current);
    setQueryText(prefix + current.query);
  };
  return (
    <QueryTestContainer>
      <div className="query-test">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <div className="title">SPARQL Query Editor</div>
        <div className="content">
          <div className="question">
            <span>Current question</span>
            <div className="text-box">{currentQuestion?.question}</div>
          </div>
          <div className="query">
            <span>Query text</span>
            <textarea
              className="query-text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
            <div className="run-btn-toggle">
              <div className="run-btn" onClick={execQuery}>
                Execute Query
              </div>
              <span className="toggle" onClick={() => setLanguage(!language)}>
                {language ? "Tiếng Việt" : "English"}
              </span>
            </div>
          </div>
          <div className="result">
            <div className="result-title">
              Result
            </div>
            <div className="result-table">
              {result?.map((current) => {
                return (
                  <div className="column">
                    <div className="column-label cell">{current.label}</div>
                    {current.value.map((currentLabel) => {
                      return <div className="cell">{currentLabel}</div>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="question-list">
            <div className="question-list-title">Example questions</div>
            <div className="question-grid">
              <div className="column">
                <div className="column-label cell">
                  {language
                    ? "Câu hỏi liên quan đến di tích lịch sử"
                    : "Questions related to historical site"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index <= 9)
                    return (
                      <div className="cell-index" key={index}>
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
                    ? "Câu hỏi liên quan đến đơn vị hành chính"
                    : "Questions related to administrative areas"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 9 && index <= 19)
                    return (
                      <div className="cell-index" key={index}>
                        <div className="cell index">{index - 9}</div>
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
                    ? "Câu hỏi liên quan đến triều đại lịch sử"
                    : "Questions related to dynasty"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 19 && index <= 29)
                    return (
                      <div className="cell-index" key={index}>
                        <div className="cell index">{index - 19}</div>
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
                    ? "Câu hỏi liên quan đến nhân vật lịch sử"
                    : "Questions related to historical figure"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 29 && index <= 39)
                    return (
                      <div className="cell-index" key={index}>
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
              <div className="column">
                <div className="column-label cell">
                  {language
                    ? "Câu hỏi liên quan đến lễ hội"
                    : "Questions related to festival"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 39 && index <= 49)
                    return (
                      <div className="cell-index" key={index}>
                        <div className="cell index">{index - 39}</div>
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
                    ? "Câu hỏi liên quan đến sự kiện lịch sử"
                    : "Questions related to historical event"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 49)
                    return (
                      <div className="cell-index" key={index}>
                        <div className="cell index">{index - 49}</div>
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
    </QueryTestContainer>
  );
}

export default QueryTest;
