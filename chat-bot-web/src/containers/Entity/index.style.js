import styled from "styled-components";

const HistoricalFigurePage = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  --btnHoverColor: #302e2f;
  --borderColor: #e4e4e4;
  .loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @media only screen and (min-width: 1200px) {
    padding: 2rem 0;
    .not-found {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-size: 2rem;
    }
    .content {
      display: flex;
      padding: 0 calc(50vw - 600px);
      flex-direction: column;
      .label {
        margin-top: 0.5rem;
        font-size: clamp(1rem, 2vw, 2rem);
      }
      .description-picture {
        display: flex;
        .description {
          flex: 1;
        }
        .picture {
          img {
            max-height: 206.77px;
            max-width: 364.33px;
          }
        }
      }
      .table {
        display: flex;
        flex-direction: column;
        background-color: #f8f9fa;
        .row {
          display: flex;
          border-bottom: 1px solid #ccc;
          padding: 0.3125rem 0.3rem;
          &:hover {
            background-color: #ddd;
          }
          .property-col {
            flex: 1;
          }
          .value-col {
            flex: 3;
          }
          .url {
            span {
              text-decoration: underline;
              cursor: pointer;
              color: #335dff;
            }
          }
        }
      }
    }
  }
`;

export { HistoricalFigurePage };
