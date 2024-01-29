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
import STLIntegrity from "./Tooling/STLIntegrity";
import HoistFiles from "./Tooling/HoistFiles";
import TagToAttribute from "./Tooling/TagToAttribute";
import ConvertManifest from "./Tooling/MigrateManifest";
import MigrateManifest from "./Tooling/MigrateManifest";
import RenameAttrKeys from "./Tooling/RenameAttrKeys";

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
        <MenuBar.Link disabled={isLoading} to="/tools/hoistfiles" title="Move files to the root level">
          Hoist Files
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/migratemanifest" title="convert user.json to config.oyrnt3d">
          Migrate Manifests
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/tagreplacer" title="Replace tags across your library in bulk">
          Bulk Tag Replacer
        </MenuBar.Link>
        <MenuBar.Link
          disabled={isLoading}
          to="/tools/renameattrkeys"
          title="Rename attribute keys across your library in bulk"
        >
          Rename Attribute Keys
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/tagtoattribute" title="Tag to Attribute">
          Tag to Attribute
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/convert3mf" title="Convert STLs to 3MFs">
          Convert STL to 3MF
        </MenuBar.Link>
        <MenuBar.Link disabled={isLoading} to="/tools/stlintegrity" title="Convert STLs to 3MFs">
          STL Integrity
        </MenuBar.Link>
      </MenuBar.Menu>
      <Content>
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/docs"} element={<Docs />} />
          <Route path={"/logs"} element={<LogView />} />
          <Route path={"/tools/filestofolder"} element={<FilesToFolders />} />
          <Route path={"/tools/hoistfiles"} element={<HoistFiles />} />
          <Route path={"/tools/renameattrkeys"} element={<RenameAttrKeys />} />
          <Route path={"/tools/tagreplacer"} element={<TagReplacer />} />
          <Route path={"/tools/tagtoattribute"} element={<TagToAttribute />} />
          <Route path={"/tools/migratemanifest"} element={<MigrateManifest />} />
          <Route path={"/tools/convert3mf"} element={<Convert3mf />} />
          <Route path={"/tools/stlintegrity"} element={<STLIntegrity />} />
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
