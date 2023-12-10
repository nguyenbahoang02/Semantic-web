import styled from "styled-components";

const QueryTestContainer = styled.div`
  --blue: #335dff;
  --bgc: #403e3f;
  @media only screen and (min-width: 1200px) {
    .content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-right: calc(1.5rem * 0.5);
      padding-left: calc(1.5rem * 0.5);
      width: 1140px;
      margin-left: auto;
      margin-right: auto;
      .question {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .text-box {
          min-height: 1.1875rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          border-radius: 0.25rem;
          border: 1px solid #ddd;
        }
      }
      .query {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        .query-text {
          min-height: 201px;
          padding: 0.25rem 0.5rem;
          appearance: none;
          font-family: inherit;
          resize: vertical;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          border-radius: 0.25rem;
          border: 1px solid #ddd;
          transition: border-color 0.15s ease-in-out,
            box-shadow 0.15s ease-in-out;
          -webkit-text-size-adjust: 100%;
          -webkit-tap-highlight-color: transparent;
          font-style: ;
          font-variant-ligatures: ;
          font-variant-caps: ;
          font-variant-numeric: ;
          font-variant-east-asian: ;
          font-variant-alternates: ;
          font-variant-position: ;
          font-stretch: ;
          font-optical-sizing: ;
          font-kerning: ;
          font-feature-settings: ;
          font-variation-settings: ;
          text-rendering: auto;
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0px;
          text-shadow: none;
          text-align: start;
          -webkit-rtl-ordering: logical;
          cursor: text;
          white-space-collapse: preserve;
          text-wrap: wrap;
          overflow-wrap: break-word;
          column-count: initial !important;
          writing-mode: horizontal-tb !important;
          &:focus {
            border-color: #86b7fe;
            outline: 0;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          }
        }
      }
      .result {
        padding-bottom: 2rem;
        .result-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 2rem;
        }
        .result-table {
          display: flex;
        }
        border-bottom: 0.25rem solid var(--bgc);
      }
      .question-list {
        .question-list-title {
          font-size: 2rem;
        }
      }
    }
    .query-test {
      display: flex;
      justify-content: center;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
      padding: 2rem 0;
    }
    .title {
      font-size: 2.5rem;
      text-align: center;
    }
    .run-btn-toggle {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
      .toggle {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        align-self: flex-end;
        transition: all 0.4s ease;
        cursor: pointer;
        &:hover {
          background-color: #ddd;
        }
      }

      .run-btn {
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        background-color: var(--blue);
        color: #fff;
        width: fit-content;
        transition: all 0.4s ease;
        cursor: pointer;
        &:hover {
          background-color: #ddd;
        }
      }
    }

    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: all 0.4s ease;
    }
    .column-label {
      margin-top: 2rem;
      font-weight: bold;
      border-top: 1px solid #ddd;
      text-align: center;
    }
    .cell {
      border-bottom: 1px solid #ddd;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 5px;
      transition: all 0.4s ease;
      cursor: pointer;
      &:hover {
        background-color: #ddd;
      }
    }

    .question-grid {
      display: flex;
      flex-direction: column;
    }

    .cell-index {
      display: flex;
      .cell {
        flex: 1;
        text-align: left;
      }
      .index {
        flex: 0.025;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
`;

export { QueryTestContainer };
