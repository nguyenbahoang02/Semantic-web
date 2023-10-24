import HomeTab from "../Tabs/HomeTab/HomeTab";
import HistoricalFigureTab from "../Tabs/HistoricalFigureTab/HistoricalFigureTab";
import HistoricalSiteTab from "../Tabs/HistoricalSiteTab/HistoricalSiteTab";
import FestivalTab from "../Tabs/FestivalTab/FestivalTab";
import ChatbotTab from "../Tabs/ChatbotTab/ChatbotTab";
import TourismTab from "../Tabs/TourismTab/TourismTab";
import { useParams } from "react-router-dom";

const Main = () => {
  const tab = useParams()?.tab;
  return (
    <div>
      {tab === undefined && <HomeTab />}
      {tab === "HistoricalFigure" && <HistoricalFigureTab />}
      {tab === "HistoricalSite" && <HistoricalSiteTab />}
      {tab === "Festival" && <FestivalTab />}
      {tab === "Tourism" && <TourismTab />}
      <ChatbotTab />
    </div>
  );
};

export default Main;
