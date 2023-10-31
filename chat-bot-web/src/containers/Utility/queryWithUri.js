export function queryWithUri(uri) {
  return `SELECT * WHERE {
            OPTIONAL{
                <${uri}> rdf:type ?rdfType.
            }
            OPTIONAL{
                <${uri}> rdfs:label ?label.
                FILTER(lang(?label) = 'vn')
                <${uri}> a ?type.
            }
              OPTIONAL{
                <${uri}> ontologies:description ?Statement1.
                ?Statement1 ontologies:_description ?description.
              }
              OPTIONAL{
                <${uri}> ontologies:deathDate ?Statement2.
                ?Statement2 ontologies:_deathDate ?timeInstant1.
                ?timeInstant1 time:inDateTime ?des1.
                OPTIONAL{
                  ?des1 time:year ?yearDeath.
                }
                OPTIONAL{
                  ?des1 time:month ?monthDeath.
                }
                OPTIONAL{
                  ?des1 time:day ?dayDeath.
                }
                OPTIONAL{
                  ?Statement2 prov:wasDerivedFrom ?ref1.
                  ?ref1 ontologies:referenceURL ?urlDeathDate.
                }
              }
              OPTIONAL{
                <${uri}> ontologies:birthDate ?Statement3.
                ?Statement3 ontologies:_birthDate ?timeInstant2.
                ?timeInstant2 time:inDateTime ?des2.
                OPTIONAL{
                  ?des2 time:year ?yearBirth.
                }
                OPTIONAL{
                  ?des2 time:month ?monthBirth.
                }
                OPTIONAL{
                  ?des2 time:day ?dayBirth.
                }
                OPTIONAL{
                  ?Statement3 prov:wasDerivedFrom ?ref2.
                  ?ref2 ontologies:referenceURL ?urlBirthDate.
                }
              }
              OPTIONAL{
                <${uri}> ontologies:deathPlace ?Statement4.
                ?Statement4 ontologies:_deathPlace ?deathPlace. 
                ?deathPlace rdfs:label ?labelDeathPlace.
                FILTER(lang(?labelDeathPlace) = 'vn')
                OPTIONAL{
                  ?Statement4 prov:wasDerivedFrom ?ref3.
                  ?ref3 ontologies:referenceURL ?urlDeathPlace.
                }
              }
              OPTIONAL{
                <${uri}> ontologies:birthPlace ?Statement5.
                ?Statement5 ontologies:_birthPlace ?birthPlace.
                ?birthPlace rdfs:label ?labelBirthPlace.
                FILTER(lang(?labelBirthPlace) = 'vn')
                OPTIONAL{
                  ?Statement5 prov:wasDerivedFrom ?ref4.
                  ?ref4 ontologies:referenceURL ?urlBirthPlace.
                }
              }
              OPTIONAL{
                <${uri}> ontologies:festivalPlace ?Statement6.
                ?Statement6 ontologies:_festivalPlace ?fesPlace.
                ?fesPlace rdfs:label ?labelFesPlace.
                <${uri}> prov:wasDerivedFrom ?ref5.
                ?ref5 ontologies:referenceURL ?urlFestivalPlace.
                FILTER(lang(?labelFesPlace) = 'vn')
              }
              OPTIONAL{
                <${uri}> ontologies:sitePlace ?Statement7.
                ?Statement7 rdfs:label ?labelSitePlace.
                <${uri}> prov:wasDerivedFrom ?ref6.
                ?ref6 ontologies:referenceURL ?urlSitePlace.
                FILTER(lang(?labelSitePlace) = 'vn')
                OPTIONAL{
                  <${uri}> ontologies:memorizePerson ?Statement8.
                  ?Statement8 ontologies:_memorizePerson ?person.
                  ?person  rdfs:label ?labelMemorizedPerson.
                  FILTER(lang(?labelMemorizedPerson) = 'vn')
                }
              }
              OPTIONAL{
                <${uri}> dbo:thumbnail ?thumbnail.
              }
            }`;
}
