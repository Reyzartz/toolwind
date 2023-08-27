import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter } from '@codemirror/lint'
import { editorTheme } from '@toolwind/helpers/constant'
import { sendMessage } from '@toolwind/helpers/message'
import { getItemFromStorage, setItemToStorage } from '@toolwind/helpers/storage'
import ReactCodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useState } from 'react'

const DEFAULT_CONFIG = {}

const SettingsPanel = () => {
	const [defaultValue, setDefaultValue] = useState<string>()

	useEffect(() => {
		void getItemFromStorage('tw_config').then((res) => {
			setDefaultValue(JSON.stringify(res ?? DEFAULT_CONFIG, null, 2))
		})
	}, [])

	const onChangeHandler = useCallback((value: string) => {
		// TODO: Add debounce to it
		try {
			const config = JSON.parse(value)

			void sendMessage({
				to: 'content_script',
				action: {
					type: 'UPDATE_CONFIG',
					data: { config },
				},
			})

			void setItemToStorage('tw_config', config)
		} catch (error) {}
	}, [])

	return (
		<div className="p-0">
			<h3 className="text-sm font-semibold text-default mb-2">
				Tailwind Config:
			</h3>

			{defaultValue !== undefined && (
				<ReactCodeMirror
					value={defaultValue}
					height="298px"
					className="text-sm border border-default bg-light"
					theme={editorTheme}
					extensions={[json(), linter(jsonParseLinter())]}
					onChange={onChangeHandler}
				/>
			)}
		</div>
	)
}

export { SettingsPanel }
