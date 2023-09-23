import { addMessageEventListener, sendMessage } from '@toolwind/helpers/message'
import { renderReactComponent } from '@toolwind/helpers/renderReactComponent'
import { getItemFromStorage, setItemToStorage } from '@toolwind/helpers/storage'
import ReactApp from './reactApp'
import { type TMessage } from '@toolwind/types/common'
import { waitForElementToScrollIntoView } from '@toolwind/helpers/waitForElementToScrollIntoView'
import { getElementFromXPath } from '@toolwind/helpers/xpath'
import { getRecoil, setRecoil } from 'recoil-nexus'
import {
	modifiedElementsState,
	inspectedElementState,
	selectedElementState
} from './store'

type TExtensionState = 'enable' | 'disable'

class ToolwindApp {
	private removeReactApp: (() => void) | null = null
	private removeMessageEventListeners: (() => void) | null = null
	private removeMouseEventListeners: (() => void) | null = null

	async init() {
		const extensionEnabled = await getItemFromStorage('toolwind_enabled')

		ToolwindApp.keyboardShortcutToggleEventListener()

		this.toggleExtensionApp(extensionEnabled === true ? 'enable' : 'disable')
	}

	toggleExtensionApp(state: TExtensionState) {
		switch (state) {
			case 'enable':
				this.removeReactApp = renderReactComponent(ReactApp)
				this.removeMessageEventListeners = addMessageEventListener(
					ToolwindApp.messageEventHandler
				)
				this.removeMouseEventListeners = ToolwindApp.addMouseEventListener()
				break
			case 'disable':
				this.removeReactApp?.()
				this.removeMessageEventListeners?.()
				this.removeMouseEventListeners?.()
		}

		ToolwindApp.toggleExtensionAppIcon(state)

		void setItemToStorage('toolwind_enabled', state === 'enable')
	}

	private static toggleExtensionAppIcon(state: TExtensionState) {
		void sendMessage({
			to: 'service_worker',
			action: {
				type: 'UPDATE_EXTENSION_ICON',
				data: { extensionEnabled: state === 'enable' }
			}
		})
	}

	private static keyboardShortcutToggleEventListener() {
		addEventListener(
			'keyup',
			(e) => {
				if (e.shiftKey && e.altKey && e.code === 'KeyT') {
					void getItemFromStorage('toolwind_enabled').then((enabled) => {
						void sendMessage({
							to: 'content_script',
							action: {
								type: 'TOGGLE_TOOLWIND',
								data: { extensionEnabled: !(enabled ?? false) }
							}
						})
					})
				}
			},
			true
		)
	}

	private static addMouseEventListener() {
		const mouseoverEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			if (e.target !== null && !(e.target as HTMLElement).matches('#toolwind')) {
				const selectedEle = getRecoil(selectedElementState)
				const hoveredEle = e.target as HTMLElement

				if (selectedEle === null) {
					setRecoil(inspectedElementState, hoveredEle)
				}
			}
		}

		const mouseleaveWindowEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			setRecoil(inspectedElementState, null)
		}

		const clickEventListener = (e: MouseEvent) => {
			if (e.target !== null && !(e.target as HTMLElement).matches('#toolwind')) {
				e.stopPropagation()
				e.preventDefault()

				const selectedEle = getRecoil(selectedElementState)
				const clickedEle = e.target as HTMLElement

				if (selectedEle === null) {
					setRecoil(selectedElementState, clickedEle)
					setRecoil(inspectedElementState, null)
				} else {
					setRecoil(inspectedElementState, clickedEle)
					setRecoil(selectedElementState, null)
				}
			}
		}

		document.addEventListener('mouseover', mouseoverEventHandler)
		document.addEventListener('click', clickEventListener, true)
		document.documentElement.addEventListener(
			'mouseleave',
			mouseleaveWindowEventHandler
		)

		console.log('Added Mouse Event Listeners')

		return () => {
			document.removeEventListener('mouseover', mouseoverEventHandler)
			document.removeEventListener('click', clickEventListener, true)
			document.documentElement.removeEventListener(
				'mouseleave',
				mouseleaveWindowEventHandler
			)

			console.log('Removed Mouse Event Listeners')
		}
	}

	private static messageEventHandler(action: TMessage['action']) {
		switch (action.type) {
			case 'FETCH_MODIFIED_ELEMENTS': {
				console.log('Fetched Event Listeners')

				const modifiedElements = getRecoil(modifiedElementsState)

				void sendMessage({
					to: 'service_worker',
					action: {
						type: 'MODIFIED_ELEMENTS_UPDATED',
						data: modifiedElements
					}
				})

				break
			}

			case 'DELETE_MODIFIED_ELEMENT': {
				const element = getElementFromXPath(action.data.xpath)
				if (element === null) return

				element.className = action.data.originalClassNames.join(' ')

				setRecoil(modifiedElementsState, (prev) => {
					const updatedList = prev.filter((item) => action.data.xpath !== item.xpath)

					void sendMessage({
						to: 'service_worker',
						action: {
							type: 'MODIFIED_ELEMENTS_UPDATED',
							data: updatedList
						}
					})

					return updatedList
				})

				break
			}

			case 'HOVER_ELEMENT':
				if (action.data.xpath === null) {
					setRecoil(inspectedElementState, null)
				} else {
					const element = getElementFromXPath(action.data.xpath)

					if (element === null) return

					element.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'center'
					})

					waitForElementToScrollIntoView(element, () => {
						setRecoil(inspectedElementState, element)
					})
				}

				break

			case 'SELECT_ELEMENT':
				if (action.data.xpath === null) {
					setRecoil(selectedElementState, null)
				} else {
					const element = getElementFromXPath(action.data.xpath)

					if (element !== null) {
						setRecoil(selectedElementState, element)
						setRecoil(inspectedElementState, null)
					}
				}
				break

			// case 'UPDATE_CONFIG':
			// 	setConfig(action.data.config)
			// 	break
		}
	}
}

export default ToolwindApp
