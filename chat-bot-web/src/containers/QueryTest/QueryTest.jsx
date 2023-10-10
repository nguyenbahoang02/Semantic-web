import { useState } from "react";
import "./index.css";

function QueryTest() {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState();
  const [result, setResult] = useState();
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
  const questions = [
    {
      question: "Hoàng Đạo Thúy là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hoàng Đạo Thúy"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
      result: ["description"],
    },
    {
      question: "Tướng tài Trần Khát Chân",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Khát Chân"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
      result: ["description"],
    },
    {
      question: "Vua Minh Mạng là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Minh Mạng"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
      result: ["description"],
    },
    {
      question: "Cao Bá Quát là ai ? ",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Cao Bá Quát"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
      result: ["description"],
    },
    {
      question: "Hồ Hán Thương là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hồ Hán Thương"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
      result: ["description"],
    },
    {
      question: "Nhân vật lịch sử nào mất vào năm 2000 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '2000'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai đã hi sinh vào năm 1969 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1969'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai đã ra đi năm 1930 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1930'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai qua đời vào ngày 24/12/1996 ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        ?des time:month ?month.
        ?des time:day ?day.
        FILTER(lang(?label) = 'vn'&&?year = '1996'^^xsd:gYear&&?day = '---24'^^xsd:gDay && ?month = '--12'^^xsd:gMonth)
      }`,
      result: ["label"],
    },
    {
      question: "Nhân vật lịch sử nào sinh vào năm 1921 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1921'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai đã ra đời vào năm 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1910'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai mất ở Hà Nội ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Hà Nội"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Ai qua đời ở thành phố Hồ Chí Minh ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Hồ Chí Minh"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Nhân vật lịch sử nào mất ở Nha Trang ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Nha Trang"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Ai ra đời ở Hà Nội ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Thành phố Hà Nội"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Nhân vật lịch sử nào sinh ra ở thành phố Hồ Chí Minh ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Thành phố Hồ Chí Minh"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Phạm Văn Đồng mất vào năm nào ?",
      query: `SELECT DISTINCT ?year WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Phạm Văn Đồng"@vn.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
      }`,
      result: ["year"],
    },
    {
      question: "Nguyễn Hữu Thọ chết vào ngày nào ? ",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Nguyễn Hữu Thọ"@vn.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        ?des time:month ?month.
        ?des time:day ?day.
      }`,
      result: ["day", "month", "year"],
    },
    {
      question: "Hồ Chí Minh qua đời vào ngày nào ? ",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hồ Chí Minh"@vn.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        ?des time:month ?month.
        ?des time:day ?day.
      }`,
      result: ["day", "month", "year"],
    },
    {
      question: "Hoàng Minh Thảo sinh vào năm nào ?",
      query: `SELECT DISTINCT ?year WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hoàng Minh Thảo"@vn.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
      }`,
      result: ["year"],
    },
    {
      question: "Nguyễn Văn Linh sinh vào ngày nào ?",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Nguyễn Văn Linh"@vn.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        ?des time:month ?month.
        ?des time:day ?day.
      }`,
      result: ["day", "month", "year"],
    },
    {
      question: "Trần Quốc Hoàn mất ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Quốc Hoàn"@vn.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Nguyễn Chấn qua đời ở đâu ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Nguyễn Chấn"@vn.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Trần Dụ Tông sinh ra ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Dụ Tông"@vn.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      } `,
      result: ["label"],
    },
    {
      question: "Ai sinh ra ở Hà Nội và mất vào năm 1995 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement1.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Hà Nội"@vn.
        ?Statement1 ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1995'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ai mất ở Hà Nội và sinh vào năm 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthDate ?Statement1.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Hà Nội"@vn.
        ?Statement1 ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1910'^^xsd:gYear)
      }`,
      result: ["label"],
    },
    {
      question: "Ở Hà Nội có lễ hội gì ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Thành phố Hà Nội"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Lễ hội nào được tổ chức ở thành phố Hồ Chí Minh ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Thành phố Hồ Chí Minh"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Lễ hội chùa Bà Thiên Hậu được tổ chức ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Lễ hội chùa Bà Thiên Hậu"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Hội làng Thượng Cát diễn ra ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Hội làng Thượng Cát"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Ở Nha Trang có di tích gì ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:sitePlace ?Statement.
        ?Statement  rdfs:label "Thành phố Nha Trang"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Có những di tích gì ở Sơn La ? ",
      query: `SELECT DISTINCT ?label ?place WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:sitePlace ?Statement.
        ?Statement  rdfs:label "Tỉnh Sơn La"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Di tích nào tưởng nhớ Âu Cơ ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Âu Cơ"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Di tích nào tưởng niệm Bà Triệu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Bà Triệu"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Di tích nào liên quan đến nhân vật lịch sử Khánh Long ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Khánh Long"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Chùa Keo tưởng nhớ ai ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Keo"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Chùa Du Lễ liên quan đến nhân vật lịch sử nào ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Du Lễ"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Miếu Mèn tưởng niệm ai ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Miếu Mèn"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Nghè Hưng Phúc nằm ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Nghè Hưng Phúc"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Miếu Lưỡng Quán ở đâu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label  "Miếu Lưỡng Quán"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question: "Di tích nào nằm ở xã Cam Thượng và tưởng nhớ Man Thiện ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Man Thiện"@vn.
        ?x ontologies:sitePlace ?Statement1.
        ?Statement1 rdfs:label "Xã Cam Thượng"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
    {
      question:
        "Di tích lịch sử nào ở Xã Sài Sơn được xây để tưởng niệm nhân vật lịch sử Đỗ Cảnh Thạc ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Đỗ Cảnh Thạc"@vn.
        ?x ontologies:sitePlace ?Statement1.
        ?Statement1 rdfs:label "Xã Sài Sơn"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
      result: ["label"],
    },
  ];
  return (
    <div className="app">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />
      <div className="title">Query test</div>
      <div className="content">
        <div className="question-list">
          QUESTIONS LIST
          <div className="big box">
            {questions.map((current, index) => {
              return (
                <div
                  className="small box"
                  key={index}
                  onClick={() => {
                    setResultQuery(current.result);
                    setQuery(current.query);
                    setCurrentQuestion(current.question);
                  }}
                >
                  {current.question}
                </div>
              );
            })}
          </div>
        </div>
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
        {result !== undefined && (
          <div className="result">
            RESULT
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
          </div>
        )}
      </div>
    </div>
  );
}

export default QueryTest;
