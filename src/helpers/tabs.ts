import { tabs } from 'webextension-polyfill'

export const getActiveTab = async () => {
	const browserTabs = await tabs.query({ active: true, currentWindow: true })

	const activeTab = browserTabs[0]

	return activeTab
}
