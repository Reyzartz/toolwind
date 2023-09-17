import { ModifiedElementsList } from '@toolwind/components/modifiedElementsList'
import { SettingsPanel } from '@toolwind/components/settingsPanel'
import { Toggle } from '@toolwind/components/toggle'
import { sendMessage } from '@toolwind/helpers/message'
import { getItemFromStorage, setItemToStorage } from '@toolwind/helpers/storage'
import { CloseIcon, SettingsIcon } from '@toolwind/icons'
import { ToolwindIcon } from '@toolwind/icons/toolwindIcon'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'

function App() {
	const [extensionState, setExtensionState] = useState(false)

	const [showSettingsPanel, setShowSettingPanel] = useState(false)

	const onToggleHandler = useCallback((value: boolean) => {
		setExtensionState(value)

		void setItemToStorage('toolwind_enabled', value)

		void sendMessage({
			to: 'content_script',
			action: { type: 'TOGGLE_TOOLWIND', data: value }
		})
	}, [])

	useEffect(() => {
		void getItemFromStorage('toolwind_enabled').then((res) => {
			setExtensionState(res)
		})
	}, [])

	return (
		<div className="flex flex-col bg-default" style={{ width: 350, height: 400 }}>
			<header className="flex items-center gap-3 p-3 pb-1">
				<div
					className={clsx(
						'mr-auto flex items-center gap-2 rounded-sm p-1 transition-colors',
						extensionState ? 'bg-primary text-background' : 'bg-default text-default'
					)}
				>
					<ToolwindIcon size={24} />

					<span className="text-xl font-bold leading-4">
						{!showSettingsPanel ? 'Toolwind' : 'Settings'}
					</span>
				</div>

				<Toggle onToggle={onToggleHandler} checked={extensionState} />

				<button
					className="cursor-pointer text-default hover:text-primary active:text-primary-dark"
					onClick={() => {
						setShowSettingPanel(!showSettingsPanel)
					}}
				>
					{!showSettingsPanel ? <SettingsIcon /> : <CloseIcon />}
				</button>
			</header>

			<div className="m-3 flex-grow overflow-auto">
				{showSettingsPanel ? <SettingsPanel /> : <ModifiedElementsList />}
			</div>
		</div>
	)
}

export default App
