import styled from "styled-components";

var path = require("../../../img/banner/co_do_hue.jpg");

const HomeTabContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  display: flex;
  flex-direction: column;
  .rectangle {
    height: 20vh;
    background-color: var(--bgc);
    width: 100vw;
  }
  .banner {
    position: relative;
    background-image: url(${path});
    height: 55vh;
    background-repeat: no-repeat;
    background-size: cover;
    transition: all 0.4 ease-in-out;
    .welcome-text {
      font-size: clamp(1rem, 2vw, 2rem);
      text-align: center;
      z-index: 1;
      white-space: wrap;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--fC);
    }
    &::after {
      content: "";
      position: absolute;
      background-color: #000;
      opacity: 50%;
      height: 100%;
      width: 100%;
    }
  }
  .about-this-website {
    display: flex;
    justify-content: center;
    min-height: 35vh;
    padding: 3em 0;
    .about-this-website-content {
      width: 70%;
      display: flex;
      justify-content: space-between;
      .about-text-content {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .about-tag {
          font-size: 1rem;
          color: #a5a5a5;
          div {
            border-top: 2px solid var(--btnC);
            padding-top: 1rem;
            display: inline-block;
            max-width: 100%;
            word-wrap: break-word;
          }
        }
        .about-title {
          font-size: 3rem;
        }
        .about-abstract {
          font-size: 2rem;
        }
        .about-text {
          color: #777777;
        }
      }
    }
  }
  .example-questions-div {
    padding: 3em 0;
    gap: 1rem;
    .questions-tag {
      width: 70%;
      .questions-title {
        font-size: 1rem;
        color: #a5a5a5;
        div {
          border-top: 2px solid var(--btnC);
          padding-top: 1rem;
          display: inline-block;
          max-width: 100%;
          word-wrap: break-word;
        }
      }
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    .example-questions {
      width: 70%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .question {
        cursor: pointer;
        width: fit-content;
        transition: all 0.4s ease;
        &:hover {
          color: var(--btnC);
        }
      }
    }
  }
`;

export { HomeTabContainer };
