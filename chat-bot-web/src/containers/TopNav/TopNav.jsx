import { TopNavContainer } from "./index.style";

const TopNav = ({ tab, setTab }) => {
  return (
    <TopNavContainer>
      <div className="web-title">Cultural Tourism</div>
      <div
        className={tab === "homepage" ? "homepage tab active" : "homepage tab"}
        onClick={() => setTab("homepage")}
      >
        Homepage
      </div>
      <div
        className={tab === "Historical Figure" ? "tab active" : "tab"}
        onClick={() => setTab("Historical Figure")}
      >
        Historical Figure
      </div>
      <div
        className={tab === "Historical Site" ? "tab active" : "tab"}
        onClick={() => setTab("Historical Site")}
      >
        Historical Site
      </div>
      <div
        className={tab === "Festival" ? "tab active" : "tab"}
        onClick={() => setTab("Festival")}
      >
        Festival
      </div>
      <div
        className={tab === "Tourism" ? "tab active" : "tab"}
        onClick={() => setTab("Tourism")}
      >
        Tourism
      </div>
    </TopNavContainer>
  );
};

export default TopNav;
