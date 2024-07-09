import { ChatbotContainer } from "./index.style";
import { useState } from "react";

// const Linkify = ({ children }) => {
//   function isValidUrl(string) {
//     const regex = /https:\/\/CHeVIE\.vn\/ontologies\/\w+/g;
//     return regex.test(string);
//   }
//   const addMarkup = (word) => {
//     console.log(word);
//     console.log(isValidUrl(word));
//     return isValidUrl(word) ? `<a href="${word}" target="_blank">${word}</a>` : word;
//   };

//   const words = children.split(" ");
//   const formatedWords = words.map((w, i) => addMarkup(w));
//   const html = formatedWords.join(" ");
//   return <span dangerouslySetInnerHTML={{ __html: html }} />;
// };

const ChatbotTab = ({ show, setShow, chatMessage, setChatMessage }) => {
  const [messages, setMessages] = useState([
    // {
    //   sender: "bot",
    //   content:
    //     "Trần Thừa là tên húy của Trần Thái Tổ, hay còn gọi là Trần Huy Tông, là Thái thượng hoàng đầu tiên của nhà Trần trong lịch sử Việt Nam. Ông nắm giữ vai trò Thái thượng hoàng trong thời gian con trai ông Trần Thái Tông trở thành hoàng đế. Ông cai trị từ năm 1225 đến khi qua đời, tổng cộng 9 năm. Để biết thêm thông tin chi tiết, bạn có thể tham khảo tại đường link [Trần Thừa - CHeVIE.vn]( https://CHeVIE.vn/ontologies/Trần_Thừa ).",
    //   time: "00:00",
    // },
    // {
    //   sender: "user",
    //   content:
    //     "Trần Thừa là tên húy của Trần Thái Tổ, hay còn gọi là Trần Huy Tông, là Thái thượng hoàng đầu tiên của nhà Trần trong lịch sử Việt Nam. Ông nắm giữ vai trò Thái thượng hoàng trong thời gian con trai ông Trần Thái Tông trở thành hoàng đế. Ông cai trị từ năm 1225 đến khi qua đời, tổng cộng 9 năm. Để biết thêm thông tin chi tiết, bạn có thể tham khảo tại đường link [Trần Thừa - CHeVIE.vn]( https://CHeVIE.vn/ontologies/Trần_Thừa ).",
    //   time: "00:00",
    // },
  ]);
  const [botReplyPlaceholder, setBotReplyPlaceholder] = useState(false);
  function addZero(num) {
    return num < 10 ? "0" + num : num;
  }

  function sendToChatbotServer(text) {
    setBotReplyPlaceholder(true);
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: text,
      }),
    };
    fetch(`${process.env.REACT_APP_CHATBOT_URL}`, request)
      .then((response) => response.json())
      .then((data) => {
        setBotReply(data);
        setBotReplyPlaceholder(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function setBotReply(reply) {
    const today = new Date();
    setMessages((currentMessages) => {
      return [
        {
          sender: "bot",
          content: reply.response,
          time: `${addZero(today.getHours())}:${addZero(today.getMinutes())}`,
          url: "",
        },
        ...currentMessages,
      ];
    });
  }

  const handleChatMessage = () => {
    if (chatMessage.trim() === "") return;
    sendToChatbotServer(chatMessage);
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
            {botReplyPlaceholder && (
              <div className="dots-container message">
                <div className="message-time">
                  <div className="name">Bot</div>
                </div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            )}
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
                        // window.open(current.url, "_blank");
                      }}
                    >
                      {/* <Linkify> */}
                      {current.content}
                      {/* </Linkify> */}
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
