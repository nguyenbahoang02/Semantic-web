import styled from "styled-components";

const TopNavContainer = styled.div`
  --bgc: #000;
  --fC: #fff;
  --btnC: #fad02c;
  min-height: 50px;
  display: flex;
  background-color: var(--bgc);
  color: var(--fC);
  justify-content: center;
  position: sticky;
  top: 0;
  .tab {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    cursor: pointer;
    &:hover {
      color: var(--btnC);
    }
  }
  .homepage {
  }
  .active {
    border-bottom: 2px solid var(--btnC);
  }
`;

export { TopNavContainer };
