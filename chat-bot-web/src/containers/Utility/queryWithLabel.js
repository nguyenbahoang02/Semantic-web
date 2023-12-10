export function queryWithLabel(name) {
  return `SELECT * WHERE {
    ?X rdfs:label ?labelTmp.
    FILTER (LCASE(?labelTmp) = LCASE("${name}"@en) ||LCASE(?labelTmp) = LCASE("${name}"@vn))
    ?X ?Y ?Z.
    OPTIONAL{
      ?Z ?YZ ?ZZ.
      OPTIONAL{
        ?ZZ time:inDateTime ?des1.
        OPTIONAL{
          ?des1 time:year ?year.
        }
        OPTIONAL{
          ?des1 time:month ?month.
        }
        OPTIONAL{
          ?des1 time:day ?day.
        }
      }
    }
  }`;
}
