import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";

import "virtual:uno.css";

ReactDOM.createRoot(
  document.getElementById("toolwind-popup-root") as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
