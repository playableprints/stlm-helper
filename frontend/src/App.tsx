import styled from "styled-components";
import FilesToFolders from "./Tooling/ExplodeFilesToFolders";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./Components/app/MenuBar";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Landing from "./Components/app/Landing";
import { LogView } from "./Utility/logger";
import Docs from "./Docs";

function App() {
  return (
    <Wrapper>
      <MenuBar.Menu>
        <MenuBar.Link to="/tools/filestofolder" title="Create folders from files and move them into their folder">
          Explode Files to Folders
        </MenuBar.Link>
      </MenuBar.Menu>
      <Content>
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/docs"} element={<Docs />} />
          <Route path={"/logs"} element={<LogView />} />
          <Route path={"/tools/filestofolder"} element={<FilesToFolders />} />
        </Routes>
      </Content>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;
