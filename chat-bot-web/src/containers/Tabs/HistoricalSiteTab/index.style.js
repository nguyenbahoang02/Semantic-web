import styled from "styled-components";

const HistoricalSiteContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  --btnHoverColor: #302e2f;
  .banner {
    position: relative;
    height: 30vh;
    background-color: var(--bgc);
    .banner-title {
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
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .rectangle {
      height: 20vh;
      background-color: var(--bgc);
      width: 100vw;
    }
    .historical-site-parent {
      display: flex;
      flex-direction: column;
      align-items: center;
      .historical-site {
        min-height: 55vh;
        width: 50vw;
        padding: 4rem;
        display: flex;
        flex-direction: column;
        .site-name {
          font-size: 2.5rem;
          div {
            border-top: 2px solid var(--btnC);
            padding-top: 1rem;
            display: inline-block;
            max-width: 100%;
            word-wrap: break-word;
          }
        }
        .site-content {
          margin-top: 2rem;
          display: flex;
          flex-grow: 1;
          .site-img {
            width: 50%;
            img {
              max-width: 50vw;
            }
          }
        }
        .site-more-button-area {
          margin-top: 1rem;
          display: flex;
          .site-more-button {
            font-size: 0.85rem;
            background-color: var(--btnC);
            color: var(--fC);
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.4s ease;
            &:hover {
              background-color: var(--btnHoverColor);
            }
          }
        }
      }
    }
  }
`;

export { HistoricalSiteContainer };
