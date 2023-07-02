import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { ContentStyles } from "./styles";

// Main function for root
import { RecoilRoot } from "recoil";
(() => {
  const root = document.createElement("toolwind-root");

  document.querySelector("html")?.append(root);

  // TODO: remove the root when the extension is toggled off
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
        <ContentStyles />
      </RecoilRoot>
    </React.StrictMode>
  );
})();

export {};
