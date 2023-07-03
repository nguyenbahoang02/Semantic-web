import styled from "styled-components";

const HomeTabContainer = styled.div`
  --bgc: #000;
  --fC: #fff;
  --btnC: #fad02c;
  display: flex;
  flex-direction: column;
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
