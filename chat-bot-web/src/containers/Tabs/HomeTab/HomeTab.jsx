import { HomeTabContainer } from "./index.style";

const HomeTab = ({ setTab }) => {
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
      <div className="rectangle" />

      {/* <div className="footer">
        <div className="about">
          About this project
          <div className="text">
            This project aims to create a chatbot website focused on Vietnamese
            history. The chatbot will serve as a virtual guide, providing users
            with interactive and informative conversations about various aspects
            of Vietnamese history.
          </div>
        </div>
        <div className="contact">Contact us</div>
      </div> */}
    </HomeTabContainer>
  );
};

export default HomeTab;
