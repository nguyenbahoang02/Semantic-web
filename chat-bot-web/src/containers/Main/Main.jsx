import HomeTab from "../Tabs/HomeTab/HomeTab";
import HistoricalFigureTab from "../Tabs/HistoricalFigureTab/HistoricalFigureTab";
import HistoricalSiteTab from "../Tabs/HistoricalSiteTab/HistoricalSiteTab";
import FestivalTab from "../Tabs/FestivalTab/FestivalTab";
import ChatbotTab from "../Tabs/ChatbotTab/ChatbotTab";
import TourismTab from "../Tabs/TourismTab/TourismTab";
import QueryTest from "../QueryTest/QueryTest";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Main = () => {
  const tab = useParams()?.tab;
  const [show, setShow] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  return (
    <div>
      {tab === undefined && (
        <HomeTab setShow={setShow} setChatMessage={setChatMessage} />
      )}
      {tab === "HistoricalFigure" && <HistoricalFigureTab />}
      {tab === "HistoricalSite" && <HistoricalSiteTab />}
      {tab === "Festival" && <FestivalTab />}
      {tab === "Tourism" && <TourismTab />}
      {tab === "sparql" && <QueryTest />}
      <ChatbotTab
        show={show}
        setShow={setShow}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
      />
    </div>
  );
};

export default Main;
