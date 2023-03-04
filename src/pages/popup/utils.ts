import { Message, TStorageItemKeys } from '../../types/common'
import { storage, tabs } from 'webextension-polyfill'

export const sendMessageToContentScript = async function (message: Message) {
  const browserTabs = await tabs.query({ active: true, currentWindow: true })

  const activeTab = browserTabs[0]

  if (activeTab.id === undefined) return

  tabs.sendMessage(activeTab.id, message)
}

export const getItemFromStorage = async (
  key: TStorageItemKeys
): Promise<any> => {
  const resp: Record<string, any> = await storage.local.get(key)

  return resp[key]
}

export const setItemToStorage = async (key: TStorageItemKeys, item: any) => {
  storage.local.set({
    [key]: item
  })
}
