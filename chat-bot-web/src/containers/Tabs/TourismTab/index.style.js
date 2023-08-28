import styled from "styled-components";

const TourismTabContainer = styled.div`
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
    display: flex;
    .city-list {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .city-related-entity {
      flex: 3;
      flex-direction: column;
    }
  }
`;

export { TourismTabContainer };
