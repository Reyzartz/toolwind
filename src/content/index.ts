import { addMessageEventListener } from '@toolwind/helpers/message'
import ToolwindApp from './toolwindApp'
import TailwindAutoComplete from 'tailwindcss-autocomplete'
import { getItemFromStorage } from '@toolwind/helpers/storage'

const initializeTailwindAutoComplete = async () => {
	const defaultConfig = await getItemFromStorage('tw_config')

	tailwindAutoComplete.config = defaultConfig ?? {}
}

const toolwindApp = new ToolwindApp()

export const tailwindAutoComplete: TailwindAutoComplete =
	new TailwindAutoComplete({})

void toolwindApp.init()

void initializeTailwindAutoComplete()

void addMessageEventListener((action) => {
	switch (action.type) {
		case 'TOGGLE_TOOLWIND':
			toolwindApp.toggleExtensionApp(
				action.data.extensionEnabled ? 'enable' : 'disable'
			)
			break

		case 'UPDATE_CONFIG':
			tailwindAutoComplete.config = action.data.config
			break
	}
})
