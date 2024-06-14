import { useEffect } from "react";

const Ontology = () => {
  useEffect(() => {
    window.location.href =
      "http://150.146.207.114/lode/extract?url=https%3A%2F%2Fraw.githubusercontent.com%2Fnguyenbahoang02%2FSemantic-web%2Fmain%2FTourism_Ontology.owl&lang=en";
  });
  return <div></div>;
};

export default Ontology;
