import { type TStorageItemKeysMap } from '@toolwind/types/common'
import { storage } from 'webextension-polyfill'
import { getActiveTab } from './tabs'

export const getItemFromStorage = async <T extends keyof TStorageItemKeysMap>(
	key: T
): Promise<TStorageItemKeysMap[T] | null> => {
	let hostname: string
	if (location.protocol === 'chrome-extension:') {
		const activeTab = await getActiveTab()
		if (activeTab?.url === undefined) return null

		hostname = new URL(activeTab.url).hostname
	} else {
		hostname = location.hostname
	}

	const fullKey = `${key}_${hostname.replaceAll('.', '_')}`

	const resp = await storage.local.get(fullKey)

	return resp[fullKey] ?? null
}

export const setItemToStorage = async <T extends keyof TStorageItemKeysMap>(
	key: T,
	item: TStorageItemKeysMap[T]
) => {
	let hostname: string
	if (location.protocol === 'chrome-extension:') {
		const activeTab = await getActiveTab()
		if (activeTab.url === undefined) return null

		hostname = new URL(activeTab.url).hostname
	} else {
		hostname = location.hostname
	}

	const fullKey = `${key}_${hostname.replaceAll('.', '_')}`

	await storage.local.set({
		[fullKey]: item
	})
}
