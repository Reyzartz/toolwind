import { type Tabs, runtime, tabs } from "webextension-polyfill";
import { getActiveTab } from "./tabs";
import { type TMessage } from "@toolwind/types/common";

export const sendMessage = async ({ to, action }: TMessage): Promise<void> => {
  let activeTab: Tabs.Tab;

  const from =
    location.protocol === "chrome-extension:"
      ? "service_worker"
      : "content_script";

  switch (`${from}-${to}`) {
    case "service_worker-content_script":
      try {
        activeTab = await getActiveTab();

        if (activeTab?.id === undefined) return;

        await tabs.sendMessage(activeTab.id, action);
      } catch {}
      break;

    case "content_script-service_worker":
      await runtime.sendMessage(action);
      break;

    case "content_script-content_script":
    case "service_worker-service_worker":
      postMessage(action);
      break;
  }
};

export const addMessageListener = async (
  callback: (props: TMessage["action"]) => void
) => {
  runtime.onMessage.addListener((action: TMessage["action"]) => {
    callback(action);
  });

  addEventListener("message", (message: MessageEvent<TMessage["action"]>) => {
    callback(message.data);
  });
};
