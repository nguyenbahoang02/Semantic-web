export function queryWithUri(uri) {
  return `SELECT * WHERE{
    <${uri}> ?Y ?Z.
    OPTIONAL{
      ?Z ?YZ ?ZZ.
      OPTIONAL{
        ?ZZ ontologies:inDateTime ?des1.
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
  }
  `;
}
