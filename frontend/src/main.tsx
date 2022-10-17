import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import Globals from "./Components/app/Globals";

const container = document.getElementById("app-root");

const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <Globals>
            <App />
        </Globals>
    </React.StrictMode>
);
