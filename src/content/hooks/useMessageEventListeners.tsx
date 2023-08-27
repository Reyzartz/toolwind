import { addMessageListener, sendMessage } from '@toolwind/helpers/message'
import { getElementFromXPath } from '@toolwind/helpers/xpath'
import { useRecoilCallback } from 'recoil'
import { runtime } from 'webextension-polyfill'
import {
	inspectedElementState,
	modifiedElementsState,
	selectedElementState,
} from '../store'
import { useTailwindIntellisense } from './useTailwindIntellisense'
import { type TMessage } from '@toolwind/types/common'
import { useEffectOnce } from 'react-use'

export const useMessageEventListeners = () => {
	const { setConfig } = useTailwindIntellisense()

	const onMessageHandler = useRecoilCallback(
		({ snapshot, set }) =>
			(action: TMessage['action']) => {
				switch (action.type) {
					case 'FETCH_MODIFIED_ELEMENTS': {
						void snapshot
							.getPromise(modifiedElementsState)
							.then((modifiedElements) => {
								void sendMessage({
									to: 'service_worker',
									action: {
										type: 'MODIFIED_ELEMENTS_UPDATED',
										data: modifiedElements,
									},
								})
							})

						break
					}

					case 'DELETE_MODIFIED_ELEMENT': {
						const element = getElementFromXPath(action.data.xpath)
						if (element === null) return

						element.className = action.data.originalClassNames.join(' ')

						set(modifiedElementsState, (prev) => {
							const updatedList = prev.filter(
								(item) => action.data.xpath !== item.xpath
							)

							void sendMessage({
								to: 'service_worker',
								action: {
									type: 'MODIFIED_ELEMENTS_UPDATED',
									data: updatedList,
								},
							})

							return updatedList
						})

						break
					}

					case 'HOVER_ELEMENT':
						if (action.data.xpath === null) {
							set(inspectedElementState, null)
						} else {
							const element = getElementFromXPath(action.data.xpath)
							if (element === null) return

							element.scrollIntoView({
								behavior: 'smooth',
								block: 'center',
								inline: 'center',
							})

							set(inspectedElementState, element)
						}

						break

					case 'SELECT_ELEMENT':
						if (action.data.xpath === null) {
							set(selectedElementState, null)
						} else {
							const element = getElementFromXPath(action.data.xpath)

							if (element !== null) {
								set(selectedElementState, element)
								set(inspectedElementState, null)
							}
						}
						break

					case 'UPDATE_CONFIG':
						setConfig(action.data.config)
						break
				}
			},
		[]
	)

	useEffectOnce(() => {
		console.log('Listening to Messages')

		void addMessageListener(onMessageHandler)

		return function removeEventListener() {
			runtime.onMessage.removeListener(onMessageHandler)
		}
	})
}
