import { addMessageListener } from "@toolwind/helpers/message";
import { renderReactComponent } from "@toolwind/helpers/renderReactComponent";
import { getItemFromStorage } from "@toolwind/helpers/storage";
import { InspectElementApp } from "./inspectElementApp";
import { App } from "./App";

let appDestroyer: () => void;

const init = async () => {
  const extensionEnabled = await getItemFromStorage("toolwind_enabled");

  if (extensionEnabled) {
    appDestroyer = renderReactComponent(App);
  }
};

addMessageListener((action) => {
  switch (action.type) {
    case "TOGGLE_TOOLWIND":
      if (action.data) {
        appDestroyer = renderReactComponent(App);
      } else {
        appDestroyer();
      }
      break;
  }
});

init();
