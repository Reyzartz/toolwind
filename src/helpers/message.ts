import { runtime, tabs } from "webextension-polyfill";
import { getActiveTab } from "./tabs";
import { Message } from "@toolwind/types/common";

export const sendMessageToPopup = async ({ messageType, message }: Message) => {
  let response;

  try {
    response = await runtime.sendMessage({
      messageType,
      message,
    });
  } catch {
    response = null;
  }

  return response;
};

export const sendMessageToContentScript = async function (message: Message) {
  const activeTab = await getActiveTab();

  if (activeTab.id === undefined) return;

  const response = await tabs.sendMessage(activeTab.id, message);

  return response;
};

export const onMessageListener = (
  messageType: Message["messageType"],
  callback: (message: Message["message"]) => void
) => {
  runtime.onMessage.addListener((request: Message, _sender) => {
    if (request.messageType === messageType) {
      callback(request.message);
    }
  });
};
