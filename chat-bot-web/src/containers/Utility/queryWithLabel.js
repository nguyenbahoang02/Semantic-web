export function queryWithLabel(name) {
  // return `SELECT * WHERE {
  //           ?x rdfs:label ?label.
  //           ?x rdfs:label ?labelTmp.
  //           FILTER (LCASE(?labelTmp) = LCASE("${name}"@en) ||LCASE(?labelTmp) = LCASE("${name}"@vn))
  //           FILTER(lang(?label) = 'vn')
  //           OPTIONAL{
  //               ?x a ?type.
  //           }
  //           OPTIONAL{
  //               ?x rdf:type ?rdfType.
  //           }
  //           OPTIONAL{
  //               ?x ontologies:description ?Statement1.
  //               ?Statement1 ontologies:_description ?description.
  //             }
  //           OPTIONAL{
  //             ?x ontologies:description ?Statement1.
  //             ?Statement1 ontologies:_description ?description.
  //           }
  //           OPTIONAL{
  //             ?x ontologies:deathDate ?Statement2.
  //             ?Statement2 ontologies:_deathDate ?timeInstant1.
  //             ?timeInstant1 time:inDateTime ?des1.
  //             OPTIONAL{
  //               ?des1 time:year ?yearDeath.
  //             }
  //             OPTIONAL{
  //               ?des1 time:month ?monthDeath.
  //             }
  //             OPTIONAL{
  //               ?des1 time:day ?dayDeath.
  //             }
  //             OPTIONAL{
  //               ?Statement2 prov:wasDerivedFrom ?ref1.
  //               ?ref1 ontologies:referenceURL ?urlDeathDate.
  //             }
  //           }
  //           OPTIONAL{
  //             ?x ontologies:birthDate ?Statement3.
  //             ?Statement3 ontologies:_birthDate ?timeInstant2.
  //             ?timeInstant2 time:inDateTime ?des2.
  //             OPTIONAL{
  //               ?des2 time:year ?yearBirth.
  //             }
  //             OPTIONAL{
  //               ?des2 time:month ?monthBirth.
  //             }
  //             OPTIONAL{
  //               ?des2 time:day ?dayBirth.
  //             }
  //             OPTIONAL{
  //               ?Statement3 prov:wasDerivedFrom ?ref2.
  //               ?ref2 ontologies:referenceURL ?urlBirthDate.
  //             }
  //           }
  //           OPTIONAL{
  //             ?x ontologies:deathPlace ?Statement4.
  //             ?Statement4 ontologies:_deathPlace ?deathPlace.
  //             ?deathPlace rdfs:label ?labelDeathPlace.
  //             FILTER(lang(?labelDeathPlace) = 'vn')
  //             OPTIONAL{
  //               ?Statement4 prov:wasDerivedFrom ?ref3.
  //               ?ref3 ontologies:referenceURL ?urlDeathPlace.
  //             }
  //           }
  //           OPTIONAL{
  //             ?x ontologies:birthPlace ?Statement5.
  //             ?Statement5 ontologies:_birthPlace ?birthPlace.
  //             ?birthPlace rdfs:label ?labelBirthPlace.
  //             FILTER(lang(?labelBirthPlace) = 'vn')
  //             OPTIONAL{
  //               ?Statement5 prov:wasDerivedFrom ?ref4.
  //               ?ref4 ontologies:referenceURL ?urlBirthPlace.
  //             }
  //           }
  //           OPTIONAL{
  //             ?x ontologies:festivalPlace ?Statement6.
  //             ?Statement6 ontologies:_festivalPlace ?fesPlace.
  //             ?fesPlace rdfs:label ?labelFesPlace.
  //             ?x prov:wasDerivedFrom ?ref5.
  //             ?ref5 ontologies:referenceURL ?urlFestivalPlace.
  //             FILTER(lang(?labelFesPlace) = 'vn')
  //           }
  //           OPTIONAL{
  //             ?x ontologies:sitePlace ?Statement7.
  //             ?Statement7 rdfs:label ?labelSitePlace.
  //             ?x prov:wasDerivedFrom ?ref6.
  //             ?ref6 ontologies:referenceURL ?urlSitePlace.
  //             FILTER(lang(?labelSitePlace) = 'vn')
  //             OPTIONAL{
  //               ?x ontologies:memorizePerson ?Statement8.
  //               ?Statement8 ontologies:_memorizePerson ?person.
  //               ?person  rdfs:label ?labelMemorizedPerson.
  //               FILTER(lang(?labelMemorizedPerson) = 'vn')
  //             }
  //           }
  //           OPTIONAL{
  //             ?x dbo:thumbnail ?thumbnail.
  //           }
  //         }`;
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
