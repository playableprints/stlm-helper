import styled from "styled-components";
import FilesToFolders from "./Tooling/ExplodeFilesToFolders";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./Components/app/MenuBar";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Landing from "./Components/app/Landing";
import { LogView } from "./Utility/logger";
import Docs from "./Docs";
import TagReplacer from "./Tooling/TagReplacer";
import Convert3mf from "./Tooling/Convert3mf";
import useLoadingBar from "./Utility/loadingbar";

function App() {
  const [, isLoading] = useLoadingBar();

  return (
    <Wrapper>
      <MenuBar.Menu>
        <MenuBar.Link
          disabled={isLoading}
          to="/tools/filestofolder"
          title="Create folders from files and move them into their folder"
        >
          Explode Files to Folders
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/tagreplacer" title="Replace tags across your library in bulk">
          Bulk Tag Replacer
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/convert3mf" title="Convert STLs to 3MFs">
          Convert STL to 3MF
        </MenuBar.Link>
      </MenuBar.Menu>
      <Content>
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/docs"} element={<Docs />} />
          <Route path={"/logs"} element={<LogView />} />
          <Route path={"/tools/filestofolder"} element={<FilesToFolders />} />
          <Route path={"/tools/tagreplacer"} element={<TagReplacer />} />
          <Route path={"/tools/convert3mf"} element={<Convert3mf />} />
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
