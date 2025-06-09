import { StrictMode } from "react";
import "./index.css";
import { HashRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <ToastContainer
      position='top-right'
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </StrictMode>
);
