import { addMessageListener } from "@toolwind/helpers/message";
import { renderReactComponent } from "@toolwind/helpers/renderReactComponent";
import { getItemFromStorage } from "@toolwind/helpers/storage";
import { App } from "./App";

let appDestroyer: () => void;

const init = async () => {
  const extensionEnabled = await getItemFromStorage("toolwind_enabled");

  if (extensionEnabled === true) {
    appDestroyer = renderReactComponent(App);
  }
};

void addMessageListener((action) => {
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

void init();
