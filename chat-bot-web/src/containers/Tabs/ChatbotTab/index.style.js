import styled from "styled-components";

const ChatbotContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  --btnHoverColor: #302e2f;
  --borderColor: #e4e4e4;
  position: fixed;
  bottom: 2vh;
  right: 1vw;
  background-color: var(--btnC);
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s ease;
  &:hover {
    background-color: var(--fC);
    span {
      color: var(--btnC);
    }
  }
  span {
    font-size: clamp(1rem, 2vw, 2rem);
    color: var(--fC);
  }
`;

export { ChatbotContainer };
