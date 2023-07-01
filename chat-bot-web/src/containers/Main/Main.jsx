import HomeTab from "../Tabs/HomeTab/HomeTab";
import HistoricalFigureTab from "../Tabs/HistoricalFigureTab/HistoricalFigureTab";
import HistoricalSiteTab from "../Tabs/HistoricalSiteTab/HistoricalSiteTab";
import FestivalTab from "../Tabs/FestivalTab/FestivalTab";
import ChatbotTab from "../Tabs/ChatbotTab/ChatbotTab";

const Main = ({ tab }) => {
  return (
    <div>
      {tab === "homepage" && <HomeTab />}
      {tab === "historicalFigure" && <HistoricalFigureTab />}
      {tab === "historicalSite" && <HistoricalSiteTab />}
      {tab === "festival" && <FestivalTab />}
      {tab === "chatbot" && <ChatbotTab />}
    </div>
  );
};

export default Main;
