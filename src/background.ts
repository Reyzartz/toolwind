import { action, tabs } from 'webextension-polyfill'
import { getItemFromStorage } from './helpers/storage'
import { addMessageEventListener } from './helpers/message'

const updateIconHandler = async (extensionEnabled: boolean | null) => {
	console.log('extensionEnabled', extensionEnabled)

	await action.setIcon({
		path: {
			32:
				extensionEnabled ?? false
					? 'icons/logo-32.png'
					: 'icons/disabled-logo-32.png'
		}
	})
}

const tabEventListeners = () => {
	tabs.onActivated.addListener(() => {
		void getItemFromStorage('toolwind_enabled').then(async (extensionEnabled) => {
			await updateIconHandler(extensionEnabled)
		})
	})

	tabs.onUpdated.addListener((_, changeInfo) => {
		if (changeInfo.status === 'complete') {
			void getItemFromStorage('toolwind_enabled').then(
				async (extensionEnabled) => {
					await updateIconHandler(extensionEnabled)
				}
			)
		}
	})
}

const init = async () => {
	tabEventListeners()

	void addMessageEventListener((action) => {
		switch (action.type) {
			case 'UPDATE_EXTENSION_ICON':
				console.log('UPDATE_EXTENSION_ICON', action)

				void updateIconHandler(action.data.extensionEnabled)
				break
		}
	})
}

void init()
