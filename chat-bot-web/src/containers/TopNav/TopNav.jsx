import { Link, useNavigate, useParams } from "react-router-dom";
import { TopNavContainer } from "./index.style";

const TopNav = () => {
  const navigate = useNavigate();
  const tab = useParams()?.tab;
  const param = useParams();
  return (
    <TopNavContainer>
      <div className="web-title">Cultural Tourism</div>
      <div
        className={
          param.name === undefined && tab === undefined
            ? "homepage tab active"
            : "homepage tab"
        }
        onClick={() => navigate("/")}
      >
        <Link to="/">Homepage</Link>
      </div>
      <div
        className={tab === "HistoricalFigure" ? "tab active" : "tab"}
        onClick={() => navigate("/HistoricalFigure")}
      >
        <Link to="/HistoricalFigure">Historical Figure</Link>
      </div>
      <div
        className={tab === "HistoricalSite" ? "tab active" : "tab"}
        onClick={() => navigate("/HistoricalSite")}
      >
        <Link to="/HistoricalSite">Historical Site</Link>
      </div>
      <div
        className={tab === "Festival" ? "tab active" : "tab"}
        onClick={() => navigate("/Festival")}
      >
        <Link to="/Festival">Festival</Link>
      </div>
      <div
        className={tab === "sparql" ? "tab active" : "tab"}
        onClick={() => navigate("/sparql")}
      >
        <Link to="/sparql">SPARQL</Link>
      </div>
      {/* <div
        className={tab === "Tourism" ? "tab active" : "tab"}
        onClick={() => setTab("Tourism")}
      >
        Tourism
      </div> */}
    </TopNavContainer>
  );
};

export default TopNav;
