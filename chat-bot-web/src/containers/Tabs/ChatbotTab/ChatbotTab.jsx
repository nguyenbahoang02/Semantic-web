import { ChatbotContainer } from "./index.style";
import { useState } from "react";

const ChatbotTab = ({ show, setShow, chatMessage, setChatMessage }) => {
  const [messages, setMessages] = useState([]);

  function addZero(num) {
    return num < 10 ? "0" + num : num;
  }

  function sendToRasaServer(text) {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "user",
        message: text,
      }),
    };
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/rasa/webhooks/rest/webhook`,
      request
    )
      .then((response) => response.json())
      .then((data) => {
        setBotReply(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function setBotReply(reply) {
    reply.forEach((current) => {
      const today = new Date();
      setMessages((currentMessages) => {
        return [
          {
            sender: "bot",
            content: current.attachment
              ? current.attachment.text
              : current.text,
            time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
            url: current.attachment ? current.attachment.url : "",
          },
          ...currentMessages,
        ];
      });
    });
  }

  const handleChatMessage = () => {
    if (chatMessage === "") return;
    sendToRasaServer(chatMessage);
    const today = new Date();
    setMessages((currentMessages) => {
      return [
        {
          sender: "user",
          content: chatMessage,
          time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
        },
        ...currentMessages,
      ];
    });
    setChatMessage("");
  };
  return (
    <ChatbotContainer>
      {/* <div
        className={!show ? "background-filter" : "background-filter filter"}
      ></div> */}
      <div className={!show ? "message-wrapper" : "message-wrapper show"}>
        <div
          className="bot-icon"
          style={{ flex: messages.length === 0 ? 1 : 0.2 }}
        >
          <img
            src={require("../../../img/chatbot-logo.png")}
            alt=""
            className="chatbox-message-image"
          />
        </div>
        {messages.length === 0 && <div className="welcome">WELCOME!!!</div>}
        {messages.length !== 0 && (
          <div className="messages">
            {messages.map((current, index) => {
              return (
                <div
                  className={
                    current.sender === "user" ? "message user" : "message bot"
                  }
                  key={index}
                >
                  {current.sender === "bot" && (
                    <div className="message-time">
                      <div className="name">Bot</div>
                      <div>{current.time}</div>
                    </div>
                  )}
                  <div className="message-background">
                    <div
                      className={
                        current.sender === "bot" && current.url !== ""
                          ? "message-content url"
                          : "message-content"
                      }
                      onClick={() => {
                        if (current.sender === "user") return;

                        window.open(current.url, "_blank");
                      }}
                    >
                      {current.content}
                    </div>
                  </div>
                  {current.sender === "user" && (
                    <div className="message-time">
                      <div className="name">You</div>
                      <div>{current.time}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="chatbox">
          <div className="chat-wrapper">
            <div className="chat">
              <input
                value={chatMessage}
                type="text"
                name=""
                id=""
                placeholder="Enter your message..."
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleChatMessage();
                }}
              />
            </div>
          </div>
          <div className="icon" onClick={handleChatMessage}>
            <span className="material-symbols-outlined">send</span>
          </div>
        </div>
      </div>
      <div
        className={!show ? "chatIcon" : "chatIcon open"}
        onClick={() => {
          setShow((state) => !state);
        }}
      >
        <span className="material-symbols-outlined">chat</span>
      </div>
    </ChatbotContainer>
  );
};

export default ChatbotTab;
