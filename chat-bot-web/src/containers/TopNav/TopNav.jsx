import { useNavigate, useParams } from "react-router-dom";
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
        <a href="/">Homepage</a>
      </div>
      <div
        className={tab === "HistoricalFigure" ? "tab active" : "tab"}
        onClick={() => navigate("/HistoricalFigure")}
      >
        <a href="/HistoricalFigure">Historical Figure</a>
      </div>
      <div
        className={tab === "HistoricalSite" ? "tab active" : "tab"}
        onClick={() => navigate("/HistoricalSite")}
      >
        <a href="/HistoricalSite">Historical Site</a>
      </div>
      <div
        className={tab === "Festival" ? "tab active" : "tab"}
        onClick={() => navigate("/Festival")}
      >
        <a href="/Festival">Festival</a>
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
