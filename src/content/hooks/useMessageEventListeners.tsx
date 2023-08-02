import { sendMessageToPopup } from "@toolwind/helpers/message";
import { getElementFromXPath } from "@toolwind/helpers/xpath";
import { Message } from "postcss";
import { useEffect } from "react";
import { useRecoilTransaction_UNSTABLE, useSetRecoilState } from "recoil";
import { Runtime, runtime } from "webextension-polyfill";
import {
  inspectedElementState,
  modifiedElementsState,
  selectedElementState,
} from "../store";
import { useTailwindIntellisense } from "./useTailwindIntellisense";

export const useMessageEventListeners = () => {
  const setSelectedElement = useSetRecoilState(selectedElementState);
  const { setConfig } = useTailwindIntellisense();

  const onMessageHandler = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (
        { message, messageType }: Message,
        sendResponse: (response: any) => void
      ) => {
        console.log("Listening to Messages");

        switch (messageType) {
          case "FETCH_MODIFIED_ELEMENTS":
            const modifiedElements = get(modifiedElementsState);

            sendResponse(modifiedElements);

            break;

          case "DELETE_MODIFIED_ELEMENT":
            const element = getElementFromXPath(message.xpath);
            if (element === null) return;

            element.className = message.originalClassNames.join(" ");

            set(modifiedElementsState, (prev) => {
              const updatedList = prev.filter(
                (item) => message.xpath !== item.xpath
              );

              sendMessageToPopup({
                messageType: "MODIFIED_ELEMENTS_UPDATED",
                message: updatedList,
              });

              return updatedList;
            });

            break;

          case "HOVER_ELEMENT":
            if (message.xpath === null) {
              set(inspectedElementState, null);
            } else {
              const element = getElementFromXPath(message.xpath);
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
            setConfig(message.config);
            break;
        }
      },
    [setSelectedElement]
  );

  useEffect(() => {
    const eventListenerCallback = (
      message: Message,
      _sender: Runtime.MessageSender,
      sendResponse: () => void
    ) => {
      // selectors are currently not supported by useRecoilTransaction Yet

      if (message.messageType === "SELECT_ELEMENT") {
        const {
          message: { xpath },
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
        onMessageHandler(message, sendResponse);
      }
    };

    runtime.onMessage.addListener(eventListenerCallback);

    return function removeEventListener() {
      runtime.onMessage.removeListener(eventListenerCallback);
    };
  }, []);
};
