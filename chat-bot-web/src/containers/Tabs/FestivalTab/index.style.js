import styled from "styled-components";

const FestivalContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  --btnHoverColor: #302e2f;
  --borderColor: #e4e4e4;
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
    @media only screen and (min-width: 1200px) {
      display: flex;
      justify-content: center;
      .content-grid {
        width: 1200px;
        min-height: 1266px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: max-content;
        gap: 60px 30px;
        padding-top: 120px;
        .historical-festival-parent {
          border: 1px solid #ddd;
          max-height: 420px;
          padding: 1rem;
          cursor: pointer;
          &:hover {
            box-shadow: 0px 0px 10px 5px var(--btnC);
            transition: all 0.4s ease;
            border: 1px solid transparent;
          }
          .festival-img {
            display: flex;
            justify-content: center;
            width: 364.33px;
            height: 206.77px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .content-type {
            margin-top: 20px;
            margin-bottom: 10px;
            color: var(--btnC);
            transition: all 0.4s ease;
            &:hover {
              color: #000;
            }
          }
          .name {
            font-size: 1.25rem;
            margin-bottom: 44px;
            cursor: pointer;
            transition: all 0.4s ease;
            &:hover {
              color: var(--btnC);
            }
          }
          .button-area {
            display: flex;
            justify-content: center;
            .read-more {
              color: #302e2f;
              padding: 8px 27px;
              border: 1px solid var(--borderColor);
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.4s ease;
              &:hover {
                background-color: var(--btnC);
                color: var(--fC);
              }
            }
          }
        }
      }
    }
  }
`;

export { FestivalContainer };
