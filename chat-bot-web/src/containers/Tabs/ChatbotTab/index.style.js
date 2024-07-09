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
  // .filter {
  //   z-index: 2;
  //   content: "";
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   height: 100vh;
  //   width: 100vw;
  //   background-color: #000;
  //   opacity: 50%;
  // }
  .message-wrapper {
    position: fixed;
    z-index: 3;
    top: 0;
    right: -40vw;
    height: 100vh;
    width: 40vw;
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
        width: 100px;
        height: 100px;
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
            max-width: 25vw;
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
          background-color: var(--btnC);
          border-radius: 0.75rem 0 0.75rem 0.75rem;
        }
      }
      .bot {
        justify-content: flex-start;
        color: var(--btnC);
        .message-background {
          // background-color: #eee;
          // border-radius: 0 0.75rem 0.75rem 0.75rem;
        }
        .message-background {
          padding: 0;
          padding-top: 0.1rem;
          .message-content {
            max-width: 25vw;
            word-wrap: break-word;
          }
        }
      }
      .dots-container {
        display: flex;
        .message-time {
          margin-right: 1rem;
        }
        .dot {
          width: 8px;
          height: 8px;
          margin: 0 2px;
          margin-top: 10px;
          background-color: var(--btnC);
          border-radius: 50%;
          animation: dot-blink 1.5s infinite ease-in-out;
        }

        .dot:nth-child(1) {
          animation-delay: 0s;
        }

        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes dot-blink {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
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
      padding: 1rem 1.5rem;
      .chat-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ddd;
        height: 50%;
        min-height: 50px;
        width: 100%;
        border-radius: 8px;
        padding: 0 0.5rem;
        .chat {
          flex: 1;
          input {
            font-size: min(1rem, 0.97vw);
            width: 100%;
            line-height: 4rem;
            border: none;
            outline: none;
            background-color: transparent;
          }
        }
      }
      .icon {
        margin-left: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          cursor: pointer;
          font-size: min(2rem, 2.124vw);
          color: var(--btnC);
        }
      }
    }
  }
  .show {
    transform: translateX(-40vw);
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
    transform: translateX(-40vw);
  }
`;

export { ChatbotContainer };
