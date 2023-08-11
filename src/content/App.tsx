import { InspectedElementHighlighter } from '@toolwind/components/inspectedElementHighlighter'
import { useCallback, useEffect } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { useMessageEventListeners } from './hooks/useMessageEventListeners'
import { inspectedElementState, selectedElementState } from './store'
import { ContentStyles } from './styles'

const App = () => {
	const inspectedElement = useRecoilValue(inspectedElementState)

	useMessageEventListeners()

	const selectedElement = useRecoilValue(selectedElementState)

	const setInspectedElementHandler = useRecoilCallback(
		({ snapshot, set }) =>
			async (ele: HTMLElement | null) => {
				const selectedEle = await snapshot.getPromise(selectedElementState)

				if (selectedEle === null) {
					set(inspectedElementState, ele)
				}
			},
		[]
	)

	const setSelectedElementHandler = useRecoilCallback(
		({ snapshot, set }) =>
			async (ele: HTMLElement | null) => {
				const selectedEle = await snapshot.getPromise(selectedElementState)

				if (selectedEle === null) {
					set(selectedElementState, ele)
					set(inspectedElementState, null)
				} else {
					set(inspectedElementState, ele)
					set(selectedElementState, null)
				}
			},
		[]
	)

	const init = useCallback(() => {
		const mouseoverEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('#toolwind,svg, svg *')
			) {
				void setInspectedElementHandler(e.target as HTMLElement)
			}
		}

		const mouseleaveWindowEventHandler = (e: MouseEvent) => {
			e.stopPropagation()

			void setInspectedElementHandler(null)
		}

		const clickEventListener = (e: MouseEvent) => {
			if (
				e.target !== null &&
				!(e.target as HTMLElement).matches('#toolwind,svg, svg *')
			) {
				e.stopPropagation()
				e.preventDefault()

				void setSelectedElementHandler(e.target as HTMLElement)
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

		addEventListenerHandler()

		return () => {
			removeEventListenerHandler()
		}
	}, [setInspectedElementHandler, setSelectedElementHandler])

	useEffect(() => {
		const unmount = init()

		console.log('added event listeners')

		return unmount
	}, [init])

	return (
		<>
			<ContentStyles />

			{inspectedElement !== null && (
				<InspectedElementHighlighter element={inspectedElement} />
			)}

			{selectedElement !== null && (
				<InspectedElementHighlighter element={selectedElement} selected />
			)}
		</>
	)
}

export { App }
