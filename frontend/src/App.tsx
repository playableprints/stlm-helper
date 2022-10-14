import "./App.css";
import styled from "styled-components";
import FolderPerSTL from "./Tooling/FolderPerSTL";

const Main = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 400px);
    align-content: center;
    gap: 1rem;
    padding: 1rem;
`;

function App() {
    return (
        <Main>
            <FolderPerSTL />
        </Main>
    );
}

export default App;
