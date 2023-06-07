import { useCallback, useEffect, useState } from 'react'
import {
	useRecoilState,
	useRecoilTransaction_UNSTABLE,
	useSetRecoilState
} from 'recoil'
import { getItemFromStorage } from '../popup/utils'
import { InspectedElementHighlighter } from './components'
import {
	cssClassesState,
	defaultCssClassesState,
	inspectedElementState,
	modifiedElementsState,
	selectedElementState
} from './store'
import {
	getElementFromXPath,
	getXPathFromElement,
	onMessageListener,
	sendMessage
} from './utils'
import { ModifiedElement } from '../../types/common'
import { selectedElementAtomState } from './store'

const App = () => {
	const [inspectedElement, setInspectedElement] = useRecoilState(
		inspectedElementState
	)

	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)

	const setModifiedElements = useSetRecoilState(modifiedElementsState)

	const [extensionEnabled, setExtensionEnabled] = useState(false)

	const addModifiedELementHandler = useRecoilTransaction_UNSTABLE(
		({ get, set }) =>
			() => {
				const selectedElement = get(selectedElementAtomState)

				if (selectedElement === null) return

				const xpath = getXPathFromElement(selectedElement)

				if (xpath == undefined) return

				const updatedClassNames = get(cssClassesState).map(
					(cssClass) => cssClass.className
				)

				const originalClassNames = get(defaultCssClassesState)

				const tagName = selectedElement.tagName

				if (
					JSON.stringify(updatedClassNames) ===
					JSON.stringify(originalClassNames)
				)
					return

				set(modifiedElementsState, (prev) => {
					const updatedList: ModifiedElement[] = [
						{
							xpath,
							updatedClassNames,
							originalClassNames,
							tagName
						},
						...prev.filter((item) => item.xpath !== xpath)
					]

					sendMessage({
						messageType: 'MODIFIED_ELEMENTS_UPDATED',
						message: updatedList
					})

					return updatedList
				})
			},
		[]
	)

	// this function doesn't get the updated state values since it's inside a event listener
	const onHoverElementHandler = useCallback(
		(ele: HTMLElement | null = null) => {
			setInspectedElement(ele)
		},
		[inspectedElement]
	)

	// this function doesn't get the updated state values since it's inside a event listener
	const onSelectElementHandler = useCallback(
		(ele: HTMLElement | null = null) => {
			addModifiedELementHandler()

			setSelectedElement(ele)
		},
		[]
	)

	const init = useCallback(() => {
		setModifiedElements([])

		const mouseoverEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('toolwind-root *')
			) {
				onHoverElementHandler(e.target as HTMLElement)
			}
		}

		const mouseleaveWindowEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			onHoverElementHandler(null)
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

		const addEventListenerHandler = () => {
			document.addEventListener('mouseover', mouseoverEventHandler)
			document.addEventListener('click', clickEventListener)
			document.documentElement.addEventListener(
				'mouseleave',
				mouseleaveWindowEventHandler
			)
		}

		const removeEventListenerHandler = () => {
			document.removeEventListener('mouseover', mouseoverEventHandler)
			document.removeEventListener('click', clickEventListener)
			document.documentElement.removeEventListener(
				'mouseleave',
				mouseleaveWindowEventHandler
			)
		}

		onMessageListener('HOVER_ELEMENT', (xpath: string | null = null) => {
			if (xpath === null) {
				onHoverElementHandler(null)
			} else {
				const element = getElementFromXPath(xpath)

				if (element === null) return
				onHoverElementHandler(element)
			}
		})

		onMessageListener('SELECT_ELEMENT', (xpath: string | null = null) => {
			if (xpath === null) {
				onSelectElementHandler(null)
			} else {
				const element = getElementFromXPath(xpath)

				if (element === null) return
				onSelectElementHandler(element)
			}
		})

		onMessageListener('DELETE_MODIFIED_ELEMENT', (item: ModifiedElement) => {
			const element = getElementFromXPath(item.xpath)

			if (element === null) return

			element.className = item.originalClassNames.join(' ')

			setModifiedElements((prev) => {
				const updatedList = prev.filter(({ xpath }) => xpath !== item.xpath)

				sendMessage({
					messageType: 'MODIFIED_ELEMENTS_UPDATED',
					message: updatedList
				})

				return updatedList
			})
		})

		onMessageListener('EXTENSION_STATE', ({ state }) => {
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
