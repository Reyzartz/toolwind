import { TStorageItemKeys } from "@toolwind/types/common";
import { storage } from "webextension-polyfill";
import { getActiveTab } from "./tabs";

export const getItemFromStorage = async (
  key: TStorageItemKeys
): Promise<any> => {
  let hostname: string;
  if (window.location.protocol === "chrome-extension:") {
    const activeTab = await getActiveTab();
    if (activeTab.url === undefined) return null;

    hostname = new URL(activeTab.url).hostname;
  } else {
    hostname = window.location.hostname;
  }

  const fullKey = `${key}_${hostname.replaceAll(".", "_")}`;

  const resp: Record<string, any> = await storage.local.get(fullKey);

  return resp[fullKey] ?? null;
};

export const setItemToStorage = async (key: TStorageItemKeys, item: any) => {
  let hostname: string;
  if (window.location.protocol === "chrome-extension:") {
    const activeTab = await getActiveTab();
    if (activeTab.url === undefined) return null;

    hostname = new URL(activeTab.url).hostname;
  } else {
    hostname = window.location.hostname;
  }

  const fullKey = `${key}_${hostname.replaceAll(".", "_")}`;

  await storage.local.set({
    [fullKey]: item,
  });
};
