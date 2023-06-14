import CodeMirror from '@uiw/react-codemirror'
import { githubDark } from '@uiw/codemirror-theme-github'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import { DEFAULT_CONFIG } from '../../../constants'
import { useCallback, useEffect, useState } from 'react'
import {
	getItemFromStorage,
	sendMessageToContentScript,
	setItemToStorage
} from '../utils'

const SettingsPanel = () => {
	const [defaultValue, setDefaultValue] = useState<string>()

	useEffect(() => {
		getItemFromStorage('tw_config').then((res) => {
			setDefaultValue(
				res === null ? DEFAULT_CONFIG : JSON.stringify(res, null, 2)
			)
		})
	}, [])

	const onChangeHandler = useCallback((value: string) => {
		// TODO: Add debounce to it
		try {
			const config = JSON.parse(value)

			sendMessageToContentScript({
				messageType: 'UPDATE_CONFIG',
				message: { config }
			})

			setItemToStorage('tw_config', config)
		} catch (error) {}
	}, [])

	return (
		<div>
			<h3 className=':uno: text-xs font-semibold text-indigo-300 mb-2'>
				Tailwind Config:
			</h3>

			{defaultValue !== undefined && (
				<CodeMirror
					value={defaultValue}
					height='364px'
					style={{ fontSize: '14px' }}
					theme={githubDark}
					extensions={[json(), linter(jsonParseLinter()), lintGutter()]}
					onChange={onChangeHandler}
				/>
			)}
		</div>
	)
}

export { SettingsPanel }
