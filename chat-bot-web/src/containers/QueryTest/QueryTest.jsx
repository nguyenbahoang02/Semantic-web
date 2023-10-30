import { useState } from "react";
import { QueryTestContainer } from "./index.style.js";
import questions from "./question";

function QueryTest() {
  const [result, setResult] = useState();
  const [language, setLanguage] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [queryText, setQueryText] = useState("");
  const handleTextChange = (e) => {
    
  }
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
        query: prefix + currentQuestion.query,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let tmp = [];
        currentQuestion.result.forEach((element) => {
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
  };
  return (
    <QueryTestContainer>
      <div className="query-test">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <div className="title">SPARQL Query Editor</div>
        <span className="toggle" onClick={() => setLanguage(!language)}>
          {language ? "Tiếng Việt" : "English"}
        </span>
        <div className="content">
          <div className="question">
            <span>Current question</span>
            <div className="text-box">{currentQuestion?.question}</div>
          </div>
          <div className="query-result">
            <div className="query">
              <span>Query text</span>
              <textarea
                className="query-text"
                value={prefix + currentQuestion.query}
                onChange={(e) => chooseQuestion(e.target.value)}
              />
              {currentQuestion?.query !== undefined && (
                <div className="run-btn" onClick={execQuery}>
                  Execute Query
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
                        <div className="column-label cell">{current.label}</div>
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
                    ? "Câu hỏi liên quan đến di tích lịch sử"
                    : "Questions related to historical site"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index <= 9)
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
                    ? "Câu hỏi liên quan đến đơn vị hành chính"
                    : "Questions related to administrative areas"}
                </div>
                {/* eslint-disable-next-line */}
                {questions[language ? "vn" : "en"].map((current, index) => {
                  if (index > 9 && index <= 19)
                    return (
                      <div className="cell-index">
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
                  if (index > 19 && index <= 23)
                    return (
                      <div className="cell-index">
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
                  if (index > 23 && index <= 33)
                    return (
                      <div className="cell-index">
                        <div className="cell index">{index - 23}</div>
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
                  if (index > 33 && index <= 38)
                    return (
                      <div className="cell-index">
                        <div className="cell index">{index - 33}</div>
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
                  if (index > 38)
                    return (
                      <div className="cell-index">
                        <div className="cell index">{index - 38}</div>
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
