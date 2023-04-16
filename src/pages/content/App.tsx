import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getItemFromStorage } from '../popup/utils'
import { InspectedElementHighlighter } from './components'
import { inspectedElementState, selectedElementState } from './store'
import { onMessageListener } from './utils'

const App = () => {
	const [inspectedElement, setInspectedElement] = useRecoilState(
		inspectedElementState
	)

	const [selectedElement, setSelectedElement] =
		useRecoilState<HTMLElement | null>(selectedElementState)

	const [extensionEnabled, setExtensionEnabled] = useState(false)

	// this function doesn't get the updated state values since it's inside a event listener
	const onHoverElementHandler = useCallback(
		(ele: HTMLElement | null) => {
			setInspectedElement(ele)
		},
		[inspectedElement]
	)

	// this function doesn't get the updated state values since it's inside a event listener
	const onSelectElementHandler = useCallback(
		(ele: HTMLElement) => {
			setSelectedElement(ele)
		},
		[selectedElement]
	)

	const init = useCallback(() => {
		const mouseoverEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('toolwind-root *')
			) {
				onHoverElementHandler(e.target as HTMLElement)
			}
		}

		const clickEventListener = (e: MouseEvent) => {
			e.stopPropagation()

			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('toolwind-root *')
			) {
				onSelectElementHandler(e.target as HTMLElement)
			}
		}

		onMessageListener('EXTENSION_STATE', ({ state }) => {
			switch (state) {
				case 'enabled':
					document.addEventListener('mouseover', mouseoverEventHandler)
					document.addEventListener('click', clickEventListener)
					setExtensionEnabled(true)
					break
				case 'disabled':
					document.removeEventListener('mouseover', mouseoverEventHandler)
					document.removeEventListener('click', clickEventListener)
					setExtensionEnabled(false)
			}
		})

		getItemFromStorage('toolwind_extension_state').then((res) => {
			setExtensionEnabled(res === 'enabled')

			if (res === 'enabled') {
				document.addEventListener('mouseover', mouseoverEventHandler)
				document.addEventListener('click', clickEventListener)
			}
		})
	}, [])

	useEffect(() => {
		// this function need to run before any of the toolwind components are mounted
		init()
	}, [])

	return extensionEnabled ? (
		<>
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
