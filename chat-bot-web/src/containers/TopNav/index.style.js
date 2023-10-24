import styled from "styled-components";

const TopNavContainer = styled.div`
  --bgc: #403e3f;
  --fC: #fff;
  --btnC: #d99578;
  min-height: 50px;
  display: flex;
  background-color: var(--bgc);
  color: var(--fC);
  justify-content: center;
  position: sticky;
  top: 0;
  .web-title {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    margin-left: 0.5em;
    font-size: 1.5rem;
  }
  .tab {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    cursor: pointer;
    transition: all 0.4s ease;
    &:hover {
      color: var(--btnC);
    }
    a {
      text-decoration: none;
      color: inherit;
    }
  }

  .active {
    border-bottom: 2px solid var(--btnC);
  }
`;

export { TopNavContainer };
