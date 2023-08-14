import { ModifiedElementsList } from '@toolwind/components/modifiedElementsList'
import { SettingsPanel } from '@toolwind/components/settingsPanel'
import { Toggle } from '@toolwind/components/toggle'
import { sendMessage } from '@toolwind/helpers/message'
import { getItemFromStorage, setItemToStorage } from '@toolwind/helpers/storage'
import { CloseIcon, SettingsIcon } from '@toolwind/icons'
import { useCallback, useEffect, useState } from 'react'

function App() {
	const [extensionState, setExtensionState] = useState(false)

	const [showSettingsPanel, setShowSettingPanel] = useState(false)

	const onToggleHandler = useCallback((value: boolean) => {
		setExtensionState(value)

		void setItemToStorage('toolwind_enabled', value)

		void sendMessage({
			to: 'content_script',
			action: { type: 'TOGGLE_TOOLWIND', data: value },
		})
	}, [])

	useEffect(() => {
		void getItemFromStorage('toolwind_enabled').then((res) => {
			setExtensionState(res)
		})
	}, [])

	return (
		<div
			className="bg-default flex flex-col"
			style={{ width: 350, height: 400, maxHeight: 400 }}
		>
			<header className="flex p-3 items-center gap-3 pb-1">
				<span className="text-lg font-semibold leading-4 text-default mr-auto">
					{!showSettingsPanel ? 'Toolwind' : 'Settings'}
				</span>

				<Toggle onToggle={onToggleHandler} checked={extensionState} />

				<button
					className="cursor-pointer hover:text-primary active:bg-primary-dark text-default"
					onClick={() => {
						setShowSettingPanel(!showSettingsPanel)
					}}
				>
					{!showSettingsPanel ? <SettingsIcon /> : <CloseIcon />}
				</button>
			</header>

			<div className="flex-grow overflow-scroll p-3">
				{showSettingsPanel ? <SettingsPanel /> : <ModifiedElementsList />}
			</div>
		</div>
	)
}

export default App
