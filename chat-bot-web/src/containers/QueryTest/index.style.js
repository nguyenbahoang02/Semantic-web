import styled from "styled-components";

const QueryTestContainer = styled.div`
  .query-test {
    display: flex;
    justify-content: center;
    padding: 1rem;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
  }
  .title {
    font-size: 2.5rem;
    text-align: center;
  }

  .content {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    padding: 5%;
    gap: 3rem;
    .toggle {
      padding: 0.5rem 0.75rem;
      border: 1px solid #ddd;
      flex: 1;
      border-radius: 0.5rem;
      align-self: flex-end;
      transition: all 0.4s ease;
      cursor: pointer;
      &:hover {
        background-color: #ddd;
      }
    }
    .content-body {
      gap: 2rem;
      .query-result {
        gap: 1rem;
        display: flex;
      }
    }
  }

  .question-list {
    text-align: center;
  }

  .query {
    flex: 2;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .big {
    height: 60vh;
    width: 23vw;
    padding: 5%;
    border-radius: 5%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .small {
    cursor: pointer;
    transition: all 0.4s ease;
    &:hover {
      background-color: #ddd;
    }
  }

  .box {
    margin-top: 1rem;
    min-height: 2rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding: 1rem;
    box-shadow: 3px 4px 5px 0px rgba(0, 0, 0, 0.38);
  }

  .box:last-child {
    margin-bottom: 1rem;
  }

  .query-box {
    display: flex;
    text-align: left;
  }

  .run-btn {
    margin-top: 1rem;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    width: fit-content;
    transition: all 0.4s ease;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
  }

  .result {
    flex: 3;
    text-align: center;
    width: 100%;
    .box {
      width: 100%;
      flex-direction: row;
      align-items: flex-start;
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
`;

export { QueryTestContainer };
