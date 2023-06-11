import { Message, TStorageItemKeys } from '../../types/common'
import { storage, tabs } from 'webextension-polyfill'

const getActiveTab = async () => {
	const browserTabs = await tabs.query({ active: true, currentWindow: true })

	const activeTab = browserTabs[0]

	return activeTab
}

export const sendMessageToContentScript = async function (message: Message) {
	const activeTab = await getActiveTab()

	if (activeTab.id === undefined) return

	const response = await tabs.sendMessage(activeTab.id, message)

	return response
}

export const getItemFromStorage = async (
	key: TStorageItemKeys
): Promise<any> => {
	let hostname: string
	if (window.location.protocol === 'chrome-extension:') {
		const activeTab = await getActiveTab()
		if (activeTab.url === undefined) return null

		hostname = new URL(activeTab.url).hostname
	} else {
		hostname = window.location.hostname
	}

	const fullKey = `${key}_${hostname.replaceAll('.', '_')}`

	const resp: Record<string, any> = await storage.local.get(fullKey)

	return resp[fullKey] ?? null
}

export const setItemToStorage = async (key: TStorageItemKeys, item: any) => {
	let hostname: string
	if (window.location.protocol === 'chrome-extension:') {
		const activeTab = await getActiveTab()
		if (activeTab.url === undefined) return null

		hostname = new URL(activeTab.url).hostname
	} else {
		hostname = window.location.hostname
	}

	const fullKey = `${key}_${hostname.replaceAll('.', '_')}`

	await storage.local.set({
		[fullKey]: item
	})
}
