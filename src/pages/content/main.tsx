import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ContentStyles } from "./styles";

// Main function for root
import { RecoilRoot } from "recoil";
(() => {
  const rootElement = document.createElement("div");
  rootElement.attachShadow({ mode: "open" });
  rootElement.id = "toolwind";

  document.body.append(rootElement);

  const root = rootElement.shadowRoot ?? rootElement;

  // TODO: remove the root when the extension is toggled off
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RecoilRoot>
        <ContentStyles />
        <App />
      </RecoilRoot>
    </React.StrictMode>
  );
})();

export {};
