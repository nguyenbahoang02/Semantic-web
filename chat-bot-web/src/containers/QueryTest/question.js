//eslint-disable-next-line
const questions = {
  en: [
    {
      question: "Who is Hoang Dao Thuy ?",
      query: `SELECT DISTINCT ?description WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Hoang Dao Thuy"@en.
          ?x ontologies:description ?Statement.
          ?Statement ontologies:_description ?description.
        }`,
    },
    {
      question: "Talented General Tran Khat Chan",
      query: `SELECT DISTINCT ?description WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Tran Khat Chan"@en.
          ?x ontologies:description ?Statement.
          ?Statement ontologies:_description ?description.
        }`,
    },
    {
      question: "Who is king Minh Mang ?",
      query: `SELECT DISTINCT ?description WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Minh Mang"@en.
          ?x ontologies:description ?Statement.
          ?Statement ontologies:_description ?description.
        }`,
    },
    {
      question: "Who is Cao Ba Quat ?",
      query: `SELECT DISTINCT ?description WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Cao Ba Quat"@en.
          ?x ontologies:description ?Statement.
          ?Statement ontologies:_description ?description.
        }`,
    },
    {
      question: "Who is Ho Han Thuong ?",
      query: `SELECT DISTINCT ?description WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Ho Han Thuong"@en.
          ?x ontologies:description ?Statement.
          ?Statement ontologies:_description ?description.
        }`,
    },
    {
      question: "Which historical figures passed away in 2000 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '2000'^^xsd:gYear)
        }`,
    },
    {
      question: "Who died in 1969 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1969'^^xsd:gYear)
        }`,
    },
    {
      question: "Who passed away in 1930 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1930'^^xsd:gYear)
        }`,
    },
    {
      question: "Who died on December 24, 1996 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          ?des time:month ?month.
          ?des time:day ?day.
          FILTER(lang(?label) = 'en'&&?year = '1996'^^xsd:gYear&&?day = '---24'^^xsd:gDay && ?month = '--12'^^xsd:gMonth)
        }`,
    },
    {
      question: "Which historical figures were born in 1921 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:birthDate ?Statement.
          ?Statement ontologies:_birthDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1921'^^xsd:gYear)
        }`,
    },
    {
      question: "Who were born in 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:birthDate ?Statement.
          ?Statement ontologies:_birthDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1910'^^xsd:gYear)
        }`,
    },
    {
      question: "Which historical figures passed away in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label "Thành phố Hà Nội"@vn.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Which historical figures died in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label "Thành phố Hồ Chí Minh"@vn.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Which historical figures passed away in Nha Trang ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label "Thành phố Nha Trang"@vn.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Which national hero were born in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:birthPlace ?Statement.
          ?Statement ontologies:_birthPlace ?birthPlace. 
          ?birthPlace rdfs:label "Thành phố Hà Nội"@vn.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Which historical figures were born in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:birthPlace ?Statement.
          ?Statement ontologies:_birthPlace ?birthPlace. 
          ?birthPlace rdfs:label "Thành phố Hồ Chí Minh"@vn.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "What year did Pham Van Dong die ?",
      query: `SELECT DISTINCT ?year WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Pham Van Dong"@en.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
        }`,
    },
    {
      question: "When did Nguyen Huu Tho die ?",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Nguyen Huu Tho"@en.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          ?des time:month ?month.
          ?des time:day ?day.
        }`,
    },
    {
      question: "What day did Ho Chi Minh die ?",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Ho Chi Minh"@en.
          ?x ontologies:deathDate ?Statement.
          ?Statement ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          ?des time:month ?month.
          ?des time:day ?day.
        }`,
    },
    {
      question: "What year was Hoang Minh Thao born ?",
      query: `SELECT DISTINCT ?year WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Hoang Minh Thao"@en.
          ?x ontologies:birthDate ?Statement.
          ?Statement ontologies:_birthDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
        }`,
    },
    {
      question: "When was Nguyen Van Linh born ?",
      query: `SELECT DISTINCT ?day ?month ?year WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Nguyen Van Linh"@en.
          ?x ontologies:birthDate ?Statement.
          ?Statement ontologies:_birthDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          ?des time:month ?month.
          ?des time:day ?day.
        }`,
    },
    {
      question: "Where did Tran Quoc Hoan die ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Tran Quoc Hoan"@en.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Where did Nguyen Chan passed away ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Nguyen Chan"@en.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Where was Tran Du Tong born in ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label "Tran Du Tong"@en.
          ?x ontologies:birthPlace ?Statement.
          ?Statement ontologies:_birthPlace ?birthPlace. 
          ?birthPlace rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        } `,
    },
    {
      question: "Who were born in Hanoi and died in 1995 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:deathDate ?Statement1.
          ?x ontologies:birthPlace ?Statement.
          ?Statement ontologies:_birthPlace ?deathPlace. 
          ?deathPlace rdfs:label "Ha Noi city"@en.
          ?Statement1 ontologies:_deathDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1995'^^xsd:gYear)
        }`,
    },
    {
      question: "Who died in Hanoi and were born in 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:HistoricalFigure.
          ?x rdfs:label ?label.
          ?x ontologies:birthDate ?Statement1.
          ?x ontologies:deathPlace ?Statement.
          ?Statement ontologies:_deathPlace ?deathPlace. 
          ?deathPlace rdfs:label "Ha Noi city"@en.
          ?Statement1 ontologies:_birthDate ?timeInstant.
          ?timeInstant time:inDateTime ?des.
          ?des time:year ?year.
          FILTER(lang(?label) = 'en'&&?year = '1910'^^xsd:gYear)
        }`,
    },
    {
      question: "What festivals are there in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Festival.
          ?x rdfs:label ?label.
          ?x ontologies:festivalPlace ?Statement.
          ?Statement ontologies:_festivalPlace ?place.
          ?place rdfs:label "Ha Noi city"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "Which festivals are held in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Festival.
          ?x rdfs:label ?label.
          ?x ontologies:festivalPlace ?Statement.
          ?Statement ontologies:_festivalPlace ?place.
          ?place rdfs:label "Ho Chi Minh city"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "Where is Ba Thien Hau pagoda festival held ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Festival.
          ?x rdfs:label "Lễ hội chùa Bà Thiên Hậu"@vn.
          ?x ontologies:festivalPlace ?Statement.
          ?Statement ontologies:_festivalPlace ?place.
          ?place rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Where does the Thuong Cat village festival take place ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Festival.
          ?x rdfs:label "Hội làng Thượng Cát"@vn.
          ?x ontologies:festivalPlace ?Statement.
          ?Statement ontologies:_festivalPlace ?place.
          ?place rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "What historical sites are there in Nha Trang ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:sitePlace ?Statement.
          ?Statement  rdfs:label "Nha Trang city"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "What historical sites are there in Son La ?",
      query: `SELECT DISTINCT ?label ?place WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:sitePlace ?Statement.
          ?Statement  rdfs:label "Son La province"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "Which monument commemorates Au Co ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label "Au Co"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "Which monument commemorates Ba Trieu ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label "Ba Trieu"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question:
        "Which historical site is related to the historical figure Khanh Long ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label "Khanh Long"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question: "Keo temple is dedicated to whom?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label "Chùa Keo"@vn.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Which historical figure is Du Le temple related to?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label "Chùa Du Lễ"@vn.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Who is commemorated at the Men shrine ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label "Miếu Mèn"@vn.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Where is the Hung Phuc temple located ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label "Nghè Hưng Phúc"@vn.
          ?x ontologies:sitePlace ?Statement.
          ?Statement rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question: "Where is the Luong Quan shrine located ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label  "Miếu Lưỡng Quán"@vn.
          ?x ontologies:sitePlace ?Statement.
          ?Statement rdfs:label ?label.
          FILTER(lang(?label) = 'en')
        }`,
    },
    {
      question:
        "Which historical site in Cam Thuong commune commemorates Man Thien ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label "Man Thien"@en.
          ?x ontologies:sitePlace ?Statement1.
          ?Statement1 rdfs:label "Cam Thuong commune"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
    {
      question:
        "Which historical relic in Sai Son commune was built to commemorate the historical figure Do Canh Thac ?",
      query: `SELECT DISTINCT ?label WHERE {
          ?x a ontologies:Site.
          ?x rdfs:label ?label.
          ?x ontologies:memorizePerson ?Statement.
          ?Statement ontologies:_memorizePerson ?person.
          ?person  rdfs:label "Do Canh Thac"@en.
          ?x ontologies:sitePlace ?Statement1.
          ?Statement1 rdfs:label "Sai Son commune"@en.
          FILTER(lang(?label) = 'vn')
        }`,
    },
  ],
  vn: [
    {
      question: "Hoàng Đạo Thúy là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hoàng Đạo Thúy"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Tướng tài Trần Khát Chân",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Khát Chân"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Vua Minh Mạng là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Minh Mạng"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Cao Bá Quát là ai ? ",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Cao Bá Quát"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Hồ Hán Thương là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hồ Hán Thương"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
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
    },
  ],
};

const questions2 = {
  en: [
    {
      question: "What kinds of Historical Site can be found in Vietnam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:Site.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='en')
      }`,
    },
    {
      question: "Where is the Hung Phuc temple located ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Nghè Hưng Phúc"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Keo temple is dedicated to whom ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Keo"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What kinds of religious architecture can we find in Vietnam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:ReligiousArchitecture.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='en')
      }`,
    },
    {
      question:
        "Which historical site in Cam Thuong commune commemorates Man Thien ?",
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
    },
    {
      question: "Which historical figure is Du Le temple related to ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Du Lễ"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What kinds of art architecture site can we find in Vietnam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:ArtArchitectureSite.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='en')
      }`,
    },
    {
      question: "Where is the Tu Quang temple located ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Từ Quang"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question:
        "Which historical site is related to the historical figure Khanh Long ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label "Khanh Long"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question:
        "What kinds of historical cultural site can we find in Vietnam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:HistoricalCulturalSite.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='en')
      }`,
    },
    {
      question: "Where is the Luong Quan shrine located ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label  "Miếu Lưỡng Quán"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What historical sites are there in Son La ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:sitePlace ?Statement.
        ?Statement  rdfs:label "Son La province"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Which historical figures died in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Ho Chi Minh city"@en.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Where did Tran Quoc Hoan die ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Quốc Hoàn"@vn.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Which national hero were born in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Ha Noi city"@en.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Where was Tran Du Tong born in ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Dụ Tông"@vn.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What festivals are there in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Ha Noi city"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Where does the Thuong Cat village festival take place ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Hội làng Thượng Cát"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Which festivals are held in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Ho Chi Minh city"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Where is Ba Thien Hau pagoda festival held ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Lễ hội chùa Bà Thiên Hậu"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What is the period of the Thuc dynasty ?",
      query: `SELECT DISTINCT ?start ?end WHERE {
      <https://tovie.vn/ontologies#Nhà_Thục> ontologies:end ?Statement1.
      <https://tovie.vn/ontologies#Nhà_Thục> ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
      }`,
    },
    {
      question: "What is the period of the Tay Son dynasty ?",
      query: `SELECT DISTINCT ?start ?end WHERE {
      <https://tovie.vn/ontologies#Nhà_Tây_Sơn> ontologies:end ?Statement1.
      <https://tovie.vn/ontologies#Nhà_Tây_Sơn> ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
      }`,
    },
    {
      question: "The year 1700 belongs to which period ?",
      query: `SELECT DISTINCT ?x WHERE {
        ?x ontologies:end ?Statement1.
        ?x ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
        FILTER(?end >= '1700'^^xsd:gYear && ?start <='1700'^^xsd:gYear)
      }`,
    },
    {
      question: "The year 961 belongs to which period ?",
      query: `SELECT DISTINCT ?x WHERE {
        ?x ontologies:end ?Statement1.
        ?x ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
        FILTER(?end >= '961'^^xsd:gYear && ?start <='961'^^xsd:gYear)
      }`,
    },
    {
      question: "Who is Hoang Dao Thuy ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hoang Dao Thuy"@en.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Talented General Tran Khat Chan",
      query: `SELECT DISTINCT ?description WHERE {
                ?x a ontologies:HistoricalFigure.
                ?x rdfs:label "Tran Khat Chan"@en.
                ?x ontologies:description ?Statement.
                ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Who is king Minh Mang ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Minh Mang"@en.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Which historical figures passed away in 2000 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathDate ?Statement.
        ?Statement ontologies:_deathDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'en'&&?year = '2000'^^xsd:gYear)
      }`,
    },
    {
      question: "Who were born in 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'en'&&?year = '1910'^^xsd:gYear)
      }`,
    },
    {
      question: "Which historical figures passed away in Nha Trang ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Nha Trang city"@en.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Which national hero were born in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Ha Noi city"@en.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Which historical figure is Du Le temple related to ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Du Lễ"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Keo temple is dedicated to whom ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Keo"@vn.
        ?x ontologies:memorizePerson ?Statement.
        ?Statement ontologies:_memorizePerson ?person.
        ?person  rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Where did Tran Quoc Hoan die ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Quốc Hoàn"@vn.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What festivals are there in Hanoi ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Ha Noi city"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Which festivals are held in Ho Chi Minh City ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label ?label.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label "Ho Chi Minh city"@en.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Where is Ba Thien Hau pagoda festival held ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Lễ hội chùa Bà Thiên Hậu"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Where does the Thuong Cat village festival take place ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Festival.
        ?x rdfs:label "Hội làng Thượng Cát"@vn.
        ?x ontologies:festivalPlace ?Statement.
        ?Statement ontologies:_festivalPlace ?place.
        ?place rdfs:label ?label.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "What kinds of festivals can be found in Vietnam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?label rdfs:subClassOf ontologies:Festival.
      }`,
    },
    {
      question:
        "Which historical figure participated in the historical event of the coastal rebellion ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:label ?label. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn <https://tovie.vn/ontologies#Bạo_loạn_ven_biển>.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question:
        "Which historical figure participated in the Ba Trieu's Rebellion?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:label ?label. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn <https://tovie.vn/ontologies#Khởi_nghĩa_Bà_Triệu>.
        FILTER(lang(?label) = 'en')
      }`,
    },
    {
      question: "Which historical events did Ho Chi Minh participate in ?",
      query: `SELECT DISTINCT ?event WHERE {
        ?x rdfs:label "Ho Chi Minh"@en. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn ?event.
      }`,
    },
    {
      question: "Which historical events did Phan Chau Trinh participate in ?",
      query: `SELECT DISTINCT ?event WHERE {
        ?x rdfs:label "Phan Chau Trinh"@en. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn ?event.
      }`,
    },
  ],
  vn: [
    {
      question:
        "Có những loại di tích lịch sử gì có thể tìm thấy được ở Việt Nam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:Site.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='vi')
      }`,
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
    },
    {
      question:
        "Ở Việt Nam có những loại kiến trúc văn hóa nghệ thuật lịch sử gì ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:ReligiousArchitecture.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='vi')
      }`,
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
    },
    {
      question: "Có những loại di tích kiến trúc nghệ thuật gì ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:ArtArchitectureSite.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='vi')
      }`,
    },
    {
      question: "Chùa Từ Quang nằm ở đâu ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label "Chùa Từ Quang"@vn.
        ?x ontologies:sitePlace ?Statement.
        ?Statement rdfs:label ?label.
        FILTER(lang(?label) = 'vn')
      }`,
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
    },
    {
      question: "Ở Việt Nam có những loại di tích lịch sử văn hóa nào ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:subClassOf ontologies:HistoricalCulturalSite.
        ?x rdfs:label ?label.
        FILTER(lang(?label)='vi')
      }`,
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
    },
    {
      question: "Có những di tích gì ở Sơn La ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:Site.
        ?x rdfs:label ?label.
        ?x ontologies:sitePlace ?Statement.
        ?Statement  rdfs:label "Tỉnh Sơn La"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Nhân vật lịch sử nào qua đời ở thành phố Hồ Chí Minh ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:deathPlace ?Statement.
        ?Statement ontologies:_deathPlace ?deathPlace. 
        ?deathPlace rdfs:label "Thành phố Hồ Chí Minh"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
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
    },
    {
      question: "Nhân vật lịch sử nào sinh ra và lớn lên ở Hà Nội ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Thành phố Hà Nội"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
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
      }`,
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
    },
    {
      question: "Thời kì nhà Thục nằm trong khoảng thời gian nào ?",
      query: `SELECT DISTINCT ?start ?end WHERE {
      <https://tovie.vn/ontologies#Nhà_Thục> ontologies:end ?Statement1.
      <https://tovie.vn/ontologies#Nhà_Thục> ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
      }`,
    },
    {
      question: "Thời kì nhà Tây Sơn nằm trong khoảng thời gian nào ?",
      query: `SELECT DISTINCT ?start ?end WHERE {
      <https://tovie.vn/ontologies#Nhà_Tây_Sơn> ontologies:end ?Statement1.
      <https://tovie.vn/ontologies#Nhà_Tây_Sơn> ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
      }`,
    },
    {
      question: "Năm 1700 là thuộc thời đại nào ? ",
      query: `SELECT DISTINCT ?x WHERE {
        ?x ontologies:end ?Statement1.
        ?x ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
        FILTER(?end >= '1700'^^xsd:gYear && ?start <='1700'^^xsd:gYear)
      }`,
    },
    {
      question: "Năm 961 là thuộc thời đại nào ? ",
      query: `SELECT DISTINCT ?x WHERE {
        ?x ontologies:end ?Statement1.
        ?x ontologies:start ?Statement2.
        ?Statement1 ontologies:_end ?timeInstant1.
        ?timeInstant1 time:inDateTime ?dateTimeDes1.
        ?dateTimeDes1 time:year ?end.
        ?Statement2 ontologies:_start ?timeInstant2.
        ?timeInstant2 time:inDateTime ?dateTimeDes2.
        ?dateTimeDes2 time:year ?start.
        FILTER(?end >= '961'^^xsd:gYear && ?start <='961'^^xsd:gYear)
      }`,
    },
    {
      question: "Hoàng Đạo Thúy là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Hoàng Đạo Thúy"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Tướng tài Trần Khát Chân",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Trần Khát Chân"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
    },
    {
      question: "Vua Minh Mạng là ai ?",
      query: `SELECT DISTINCT ?description WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label "Minh Mạng"@vn.
        ?x ontologies:description ?Statement.
        ?Statement ontologies:_description ?description.
      }`,
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
    },
    {
      question: "Ai sinh vào năm 1910 ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthDate ?Statement.
        ?Statement ontologies:_birthDate ?timeInstant.
        ?timeInstant time:inDateTime ?des.
        ?des time:year ?year.
        FILTER(lang(?label) = 'vn'&&?year = '1910'^^xsd:gYear)
      }`,
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
    },
    {
      question: "Anh hùng dân tộc nào ra đời ở Hà Nội ? ",
      query: `SELECT DISTINCT ?label WHERE {
        ?x a ontologies:HistoricalFigure.
        ?x rdfs:label ?label.
        ?x ontologies:birthPlace ?Statement.
        ?Statement ontologies:_birthPlace ?birthPlace. 
        ?birthPlace rdfs:label "Thành phố Hà Nội"@vn.
        FILTER(lang(?label) = 'vn')
      }`,
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
    },
    {
      question: "Có những loại lễ hội nào ở Việt Nam ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?label rdfs:subClassOf ontologies:Festival.
      }`,
    },
    {
      question:
        "Nhân vật lịch sử nào đã tham gia vào sự kiện lịch sử bạo loạn ven biển ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:label ?label. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn <https://tovie.vn/ontologies#Bạo_loạn_ven_biển>.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Nhân vật lịch sử nào đã tham gia vào khởi nghĩa Bà Triệu ?",
      query: `SELECT DISTINCT ?label WHERE {
        ?x rdfs:label ?label. 
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn <https://tovie.vn/ontologies#Khởi_nghĩa_Bà_Triệu>.
        FILTER(lang(?label) = 'vn')
      }`,
    },
    {
      question: "Hồ Chí Minh đã tham gia vào những sự kiện lịch sử nào ?",
      query: `SELECT DISTINCT ?event WHERE {
        ?x rdfs:label "Hồ Chí Minh"@vn.
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn ?event.
      }`,
    },
    {
      question: "Phan Châu Trinh đã tham gia vào những sự kiện lịch sử nào ?",
      query: `SELECT DISTINCT ?event WHERE {
        ?x rdfs:label "Phan Châu Trinh"@vn.
        ?x ontologies:takePartIn ?Statement.
        ?Statement ontologies:_takePartIn ?event.
      }`,
    },
  ],
};

export default questions2;
