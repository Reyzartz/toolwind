import { addMessageEventListener } from '@toolwind/helpers/message'
import ToolwindApp from './toolwindApp'

const toolwindApp = new ToolwindApp()

void toolwindApp.init()

void addMessageEventListener((action) => {
	switch (action.type) {
		case 'TOGGLE_TOOLWIND':
			toolwindApp.toggleExtensionApp(
				action.data.extensionEnabled ? 'enable' : 'disable'
			)
			break
	}
})
