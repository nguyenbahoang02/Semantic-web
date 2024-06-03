import { HomeTabContainer } from "./index.style";

const HomeTab = ({ setShow, setChatMessage }) => {
  const questions = [
    "Tell me about Mac Kinh Vu",
    "Who is Le Trong Thu ?",
    "When did Tran Quoc Hoan die ?",
    "Where was Ly Anh Tong born?",
    "When was Tran Quy Cap born?",
    "Where did Pham Ngoc Thach die?",
    "Where is Đình Yên Mỹ ?",
    "Who does Chùa Nốt memorize ?",
    "Who died in Ha Noi city ?",
    "Who was born in Ho Chi Minh city ?",
  ];
  return (
    <HomeTabContainer>
      <div className="banner">
        <div className="welcome-text">
          WELCOME TO <br /> CULTURAL TOURISM
        </div>
      </div>
      <div className="about-this-website">
        <div className="about-this-website-content">
          <div className="about-text-content">
            <div className="about-tag">
              <div>ABOUT THIS WEBSITE</div>
            </div>
            <div className="about-title">History of Vietnam</div>
            <div className="about-abstract">
              Cultural tourism with built-in chatbot
            </div>
            <div className="about-text">
              This project aims to create a chatbot website focused on
              Vietnamese history. The chatbot will serve as a virtual guide,
              providing users with interactive and informative conversations
              about various aspects of Vietnamese history.
            </div>
          </div>
          <div className="about-img-content"></div>
        </div>
      </div>
      {/* <div className="rectangle" /> */}
      {/* <div className="example-questions-div">
        <div className="questions-tag">
          <div className="questions-title">
            <div>EXAMPLE QUESTIONS</div>
          </div>
        </div>
        <div className="example-questions">
          {questions.map((question, index) => {
            return (
              <div
                className="question"
                key={index}
                onClick={() => {
                  setShow(true);
                  setChatMessage(question);
                }}
              >
                {question}
              </div>
            );
          })}
        </div>
      </div> */}
      <div className="rectangle" />
    </HomeTabContainer>
  );
};

export default HomeTab;
