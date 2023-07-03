import HomeTab from "../Tabs/HomeTab/HomeTab";
import HistoricalFigureTab from "../Tabs/HistoricalFigureTab/HistoricalFigureTab";
import HistoricalSiteTab from "../Tabs/HistoricalSiteTab/HistoricalSiteTab";
import FestivalTab from "../Tabs/FestivalTab/FestivalTab";
import ChatbotTab from "../Tabs/ChatbotTab/ChatbotTab";

const Main = ({ tab, setTab }) => {
  return (
    <div>
      {tab === "homepage" && <HomeTab setTab={setTab} />}
      {tab === "Historical Figure" && <HistoricalFigureTab />}
      {tab === "Historical Site" && <HistoricalSiteTab />}
      {tab === "Festival" && <FestivalTab />}
      {tab === "Chatbot" && <ChatbotTab />}
    </div>
  );
};

export default Main;
