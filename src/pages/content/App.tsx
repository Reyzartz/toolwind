import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getItemFromStorage } from '../popup/utils'
import { InspectedElementHighlighter } from './components'
import { inspectedElementState, selectedElementState } from './store'
import { onMessageListener } from './helpers/utils'
import { OnMessageEventListeners } from './helpers/onMessageEventListeners'

const App = () => {
	const [inspectedElement, setInspectedElement] = useRecoilState(
		inspectedElementState
	)

	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)

	const [extensionEnabled, setExtensionEnabled] = useState(false)

	const init = useCallback(() => {
		const mouseoverEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('toolwind-root *')
			) {
				setInspectedElement(e.target as HTMLElement)
			}
		}

		const mouseleaveWindowEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			setInspectedElement(null)
		}

		const clickEventListener = (e: MouseEvent) => {
			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('toolwind-root *')
			) {
				e.stopPropagation()
				e.preventDefault()

				setSelectedElement(e.target as HTMLElement)
			}
		}

		const addEventListenerHandler = () => {
			document.addEventListener('mouseover', mouseoverEventHandler)
			document.addEventListener('click', clickEventListener, true)
			document.documentElement.addEventListener(
				'mouseleave',
				mouseleaveWindowEventHandler
			)
		}

		const removeEventListenerHandler = () => {
			document.removeEventListener('mouseover', mouseoverEventHandler)
			document.removeEventListener('click', clickEventListener, true)
			document.documentElement.removeEventListener(
				'mouseleave',
				mouseleaveWindowEventHandler
			)
		}

		onMessageListener('UPDATE_EXTENSION_ACTIVE_STATE', ({ state }) => {
			switch (state) {
				case 'enabled':
					addEventListenerHandler()
					setExtensionEnabled(true)
					break
				case 'disabled':
					removeEventListenerHandler()
					setExtensionEnabled(false)
			}
		})

		getItemFromStorage('toolwind_extension_state').then((res) => {
			setExtensionEnabled(res === 'enabled')

			if (res === 'enabled') {
				addEventListenerHandler()
			}
		})
	}, [])

	useEffect(() => {
		init()
	}, [])

	return extensionEnabled ? (
		<>
			<OnMessageEventListeners />
			<InspectedElementHighlighter element={inspectedElement} />

			{selectedElement !== null && (
				<InspectedElementHighlighter element={selectedElement} selected />
			)}
		</>
	) : (
		<></>
	)
}

export { App }
