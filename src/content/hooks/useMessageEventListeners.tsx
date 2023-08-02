import { addMessageListener, sendMessage } from "@toolwind/helpers/message";
import { getElementFromXPath } from "@toolwind/helpers/xpath";
import { useEffect } from "react";
import { useRecoilTransaction_UNSTABLE, useSetRecoilState } from "recoil";
import { runtime } from "webextension-polyfill";
import {
  inspectedElementState,
  modifiedElementsState,
  selectedElementState,
} from "../store";
import { useTailwindIntellisense } from "./useTailwindIntellisense";
import { TMessage } from "@toolwind/types/common";

export const useMessageEventListeners = () => {
  const setSelectedElement = useSetRecoilState(selectedElementState);
  const { setConfig } = useTailwindIntellisense();

  const onMessageHandler = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (action: TMessage["action"]) => {
        console.log("Listening to Messages");

        switch (action.type) {
          case "FETCH_MODIFIED_ELEMENTS":
            const modifiedElements = get(modifiedElementsState);

            sendMessage({
              to: "service_worker",
              action: {
                type: "MODIFIED_ELEMENTS_UPDATED",
                data: modifiedElements,
              },
            });

            break;

          case "DELETE_MODIFIED_ELEMENT":
            const element = getElementFromXPath(action.data.xpath);
            if (element === null) return;

            element.className = action.data.originalClassNames.join(" ");

            set(modifiedElementsState, (prev) => {
              const updatedList = prev.filter(
                (item) => action.data.xpath !== item.xpath
              );

              sendMessage({
                to: "service_worker",
                action: {
                  type: "MODIFIED_ELEMENTS_UPDATED",
                  data: updatedList,
                },
              });

              return updatedList;
            });

            break;

          case "HOVER_ELEMENT":
            if (action.data.xpath === null) {
              set(inspectedElementState, null);
            } else {
              const element = getElementFromXPath(action.data.xpath);
              if (element === null) return;

              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });

              set(inspectedElementState, element);
            }

            break;

          case "UPDATE_CONFIG":
            setConfig(action.data.config);
            break;
        }
      },
    [setSelectedElement]
  );

  useEffect(() => {
    const eventListenerCallback = (message: TMessage["action"]) => {
      // selectors are currently not supported by useRecoilTransaction Yet

      if (message.type === "SELECT_ELEMENT") {
        const {
          data: { xpath },
        } = message;

        if (xpath === null) {
          setSelectedElement(null);
        } else {
          const element = getElementFromXPath(xpath);

          if (element !== null) {
            setSelectedElement(element);
          }
        }
      } else {
        onMessageHandler(message);
      }
    };

    addMessageListener(eventListenerCallback);

    return function removeEventListener() {
      runtime.onMessage.removeListener(eventListenerCallback);
    };
  }, []);
};
