import styled from "styled-components";

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
    .welcome-text {
      font-size: clamp(1rem, 2vw, 2rem);
      text-align: center;
      z-index: 3;
      white-space: wrap;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--fC);
    }
    img {
      filter: brightness(50%);
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
  .content {
    display: flex;
    flex-direction: column;
    .section {
      min-height: 35vh;
      display: flex;
      border: 1px solid var(--btnC);
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      padding: 2em 4em;
      .sectionContent {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 25vh;
        .title {
          min-width: 50vw;
          text-align: left;
          font-size: clamp(1rem, 1.04vw, 1.25rem);
          cursor: pointer;
          transition: all 0.4s ease;
          &:hover {
            color: var(--btnC);
          }
        }
        .name {
          margin: 1.25em 0;
          font-size: clamp(0.9rem, 0.9375vw, 1.125rem);
        }
        .description {
          width: 70%;
          text-align: center;
          font-size: clamp(0.8rem, 0.83vw, 1rem);
        }
        .thumbnail {
          max-height: 200px;
          margin-bottom: 0.625rem;
        }
      }
      .button {
        padding: 0.5em;
        border: 1px solid var(--bgc);
        cursor: pointer;
        .buttonText {
          margin: 0;
        }
        &:focus,
        &:hover {
          background-color: var(--btnC);
          color: var(--fC);
          border: 1px solid var(--btnC);
        }
      }
    }
  }
  .footer {
    min-height: 20vh;
    background-color: var(--bgc);
    color: var(--fC);
    display: flex;
    padding: 1em 4em;
    .about {
      width: 70%;
      .text {
        padding-top: 0.5em;
        padding-right: 2em;
      }
    }
    .contact {
    }
  }
`;

export { HomeTabContainer };
