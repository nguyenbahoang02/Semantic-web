import styled from "styled-components";

const ChatbotContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  --btnHoverColor: #302e2f;
  --borderColor: #e4e4e4;
  --blue: #335dff;
  --grey: #f5f5f5;
  --grey-d-1: #eee;
  --grey-d-2: #ddd;
  --grey-d-3: #888;
  --white: #fff;
  --dark: #222;
  .filter {
    z-index: 2;
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: #000;
    opacity: 50%;
  }
  .message-wrapper {
    position: fixed;
    z-index: 3;
    top: 0;
    right: -20vw;
    height: 100vh;
    width: 20vw;
    background-color: var(--fC);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    .bot-icon {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      flex-direction: column;
      transition: all 0.4 ease;
      img {
        width: 200px;
        height: 200px;
      }
    }
    .messages {
      flex: 1;
      display: flex;
      flex-direction: column-reverse;
      padding: 1rem;
      gap: 1.5rem;
      overflow-y: scroll;
      .message {
        display: flex;
        .message-background {
          padding: 1rem;
          .message-content {
            max-width: 13vw;
            word-wrap: break-word;
          }
        }
        .url {
          text-decoration: underline;
          cursor: pointer;
        }
        .message-time {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ddd;
          font-size: 0.75rem;
          margin-left: 0.5rem;
          margin-right: 0.5rem;
          .name {
            color: #bbb;
            font-size: 1rem;
          }
        }
      }
      .user {
        justify-content: flex-end;
        color: #fff;
        .message-background {
          background-color: #335dff;
          border-radius: 0.75rem 0 0.75rem 0.75rem;
        }
      }
      .bot {
        justify-content: flex-start;
        color: #fff;
        .message-background {
          background-color: var(--btnC);
          border-radius: 0 0.75rem 0.75rem 0.75rem;
        }
      }
    }
    .welcome {
      flex: 1;
      display: flex;
      justify-content: center;
      font-size: 2.5rem;
      color: #ccc;
    }
    .chatbox {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 2rem 1.5rem;
      .chat-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ddd;
        height: 50%;
        min-height: 50px;
        width: 100%;
        border-radius: 8px;
        padding: 0 1rem;
        .chat {
          flex: 1;
          input {
            font-size: 1rem;
            width: 100%;
            height: 100%;
            line-height: 2rem;
            border: none;
            outline: none;
            background-color: transparent;
          }
        }
        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            cursor: pointer;
            font-size: 2rem;
            color: var(--btnC);
          }
        }
      }
    }
  }
  .show {
    transform: translateX(-20vw);
  }
  .chatIcon {
    position: fixed;
    z-index: 3;
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
  }
  .open {
    transform: translateX(-20vw);
  }
`;

export { ChatbotContainer };
