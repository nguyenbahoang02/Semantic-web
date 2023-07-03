import { LayOut } from "./index.style";
import TopNav from "../TopNav/TopNav";
import Main from "../Main/Main";
import { useState } from "react";

const Layout = () => {
  const [tab, setTab] = useState("homepage");
  return (
    <LayOut>
      <TopNav tab={tab} setTab={setTab}></TopNav>
      <Main tab={tab} setTab={setTab}></Main>
    </LayOut>
  );
};

export default Layout;
