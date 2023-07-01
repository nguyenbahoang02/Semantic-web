import { TopNavContainer } from "./index.style";

const TopNav = ({ tab, setTab }) => {
  return (
    <TopNavContainer>
      <div
        className={tab === "homepage" ? "homepage tab active" : "homepage tab"}
        onClick={() => setTab("homepage")}
      >
        Homepage
      </div>
      <div
        className={tab === "historicalFigure" ? "tab active" : "tab"}
        onClick={() => setTab("historicalFigure")}
      >
        Historical Figure
      </div>
      <div
        className={tab === "historicalSite" ? "tab active" : "tab"}
        onClick={() => setTab("historicalSite")}
      >
        Historical Site
      </div>
      <div
        className={tab === "festival" ? "tab active" : "tab"}
        onClick={() => setTab("festival")}
      >
        Festival
      </div>
      <div
        className={tab === "chatbot" ? "tab active" : "tab"}
        onClick={() => setTab("chatbot")}
      >
        Chatbot
      </div>
    </TopNavContainer>
  );
};

export default TopNav;
