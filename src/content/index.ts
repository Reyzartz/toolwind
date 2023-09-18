import { addMessageListener, sendMessage } from '@toolwind/helpers/message'
import { renderReactComponent } from '@toolwind/helpers/renderReactComponent'
import { getItemFromStorage, setItemToStorage } from '@toolwind/helpers/storage'
import { App } from './App'

let appDestroyer: () => void

const init = async () => {
	const extensionEnabled = await getItemFromStorage('toolwind_enabled')

	if (extensionEnabled === true) {
		appDestroyer = renderReactComponent(App)
	}

	void sendMessage({
		to: 'service_worker',
		action: {
			type: 'UPDATE_EXTENSION_ICON',
			data: { extensionEnabled: extensionEnabled ?? false }
		}
	})

	addEventListener(
		'keyup',
		(e) => {
			if (e.shiftKey && e.altKey && e.code === 'KeyT') {
				void getItemFromStorage('toolwind_enabled').then((enabled) => {
					void sendMessage({
						to: 'content_script',
						action: {
							type: 'TOGGLE_TOOLWIND',
							data: { extensionEnabled: !(enabled ?? false) }
						}
					})
				})
			}
		},
		true
	)
}

void addMessageListener((action) => {
	switch (action.type) {
		case 'TOGGLE_TOOLWIND':
			if (action.data.extensionEnabled) {
				appDestroyer = renderReactComponent(App)
			} else {
				appDestroyer()
			}

			void setItemToStorage('toolwind_enabled', action.data.extensionEnabled)

			void sendMessage({
				to: 'service_worker',
				action: {
					type: 'UPDATE_EXTENSION_ICON',
					data: action.data
				}
			})

			break
	}
})

void init()
