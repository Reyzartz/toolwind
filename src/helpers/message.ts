import { type Tabs, runtime, tabs } from 'webextension-polyfill'
import { getActiveTab } from './tabs'
import { type TMessage } from '@toolwind/types/common'
import { type DestroyFn } from '@toolwind/types/components'

export const sendMessage = async ({ to, action }: TMessage): Promise<void> => {
	let activeTab: Tabs.Tab

	const from =
		location.protocol === 'chrome-extension:'
			? 'service_worker'
			: 'content_script'

	switch (`${from}-${to}`) {
		case 'service_worker-content_script':
			try {
				activeTab = await getActiveTab()

				if (activeTab?.id === undefined) return

				await tabs.sendMessage(activeTab.id, action)
			} catch {}
			break

		case 'content_script-service_worker':
			try {
				await runtime.sendMessage(action)
			} catch {}
			break

		case 'content_script-content_script':
		case 'service_worker-service_worker':
			postMessage(action)
			break
	}
}

export const addMessageEventListener = (
	callback: (props: TMessage['action']) => void
): DestroyFn => {
	const backgroundEventListener = (action: TMessage['action']) => {
		callback(action)
	}

	const contentEventListener = (message: MessageEvent<TMessage['action']>) => {
		callback(message.data)
	}

	runtime.onMessage.addListener(backgroundEventListener)
	addEventListener('message', contentEventListener)

	return () => {
		console.log('Event Listener Removed')

		runtime.onMessage.removeListener(backgroundEventListener)
		removeEventListener('message', contentEventListener)
	}
}
