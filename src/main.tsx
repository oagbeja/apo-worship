import { StrictMode } from "react";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router";

import ReactDOM from "react-dom/client";
import Home from "./screens/home";
import Presentation from "./screens/presentation";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/presentation' element={<Presentation />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
