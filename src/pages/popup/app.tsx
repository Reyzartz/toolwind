import { useCallback, useEffect, useState } from 'react'
import { ExtensionStateMessageAction } from '../../types/common'
import { Toggle } from './components/toggle'

import {
	getItemFromStorage,
	sendMessageToContentScript,
	setItemToStorage
} from './utils'
import { ModifiedElementsList } from './modifiedElementsList'

function App() {
	const [extensionState, setExtensionState] =
		useState<ExtensionStateMessageAction['state']>('disabled')

	const onToggleHandler = useCallback((value: boolean) => {
		setExtensionState(value ? 'enabled' : 'disabled')

		setItemToStorage('toolwind_extension_state', value ? 'enabled' : 'disabled')

		sendMessageToContentScript({
			messageType: 'EXTENSION_STATE',
			message: { state: value ? 'enabled' : 'disabled' }
		})
	}, [])

	useEffect(() => {
		getItemFromStorage('toolwind_extension_state').then((res) => {
			setExtensionState(res)
		})
	}, [])

	return (
		<div
			className=':uno: bg-indigo-900'
			style={{ width: 350, height: 400, maxHeight: 400 }}
		>
			<header className=':uno: flex justify-between border-0 border-b border-solid border-indigo-600 py-2 px-3'>
				<span className='text-lg font-semibold leading-4 text-indigo-400'>
					Toolwind
				</span>

				<Toggle
					onToggle={onToggleHandler}
					checked={extensionState === 'enabled'}
				/>
			</header>

			<ModifiedElementsList />
		</div>
	)
}

export default App
