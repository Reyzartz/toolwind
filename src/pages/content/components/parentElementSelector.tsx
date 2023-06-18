import { useRecoilState, useSetRecoilState } from 'recoil'
import { inspectedElementState, selectedElementState } from '../store'
import { useEffect, useState } from 'react'

export const ParentElementSelector = () => {
	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)
	const [parentElement, setParentElement] = useState<HTMLElement | null>(null)
	const [grandParentElement, setGrandParentElement] =
		useState<HTMLElement | null>(null)

	const setInspectedElement = useSetRecoilState(inspectedElementState)

	useEffect(() => {
		if (selectedElement !== null) {
			setParentElement(selectedElement.parentElement)
			setGrandParentElement(
				selectedElement.parentElement?.parentElement ?? null
			)
		}
	}, [selectedElement])

	const selectedElementHandler = (e: any, element: HTMLElement | null) => {
		e.stopPropagation()
		if (element === null) return

		setSelectedElement(element)
	}

	return (
		<div className=':uno: flex gap-3 item-center'>
			{grandParentElement !== null && (
				<>
					<button
						className=':uno: text-indigo-200 font-semibold bg-indigo-700 rounded-md px-2 py-0.5 text-xs hover:bg-indigo-600'
						onMouseEnter={() => setInspectedElement(grandParentElement)}
						onMouseLeave={() => setInspectedElement(null)}
						onClick={(e) => selectedElementHandler(e, grandParentElement)}
					>
						{grandParentElement.nodeName}
					</button>

					<span className=':uno: text-indigo-200 font-semibold'>❯</span>
				</>
			)}

			{parentElement !== null && (
				<>
					<button
						className=':uno: text-indigo-200 font-semibold bg-indigo-700 rounded-md px-2 py-0.5 text-xs hover:bg-indigo-600'
						onMouseEnter={() => setInspectedElement(parentElement)}
						onMouseLeave={() => setInspectedElement(null)}
						onClick={(e) => selectedElementHandler(e, parentElement)}
					>
						{parentElement?.nodeName}
					</button>

					<span className=':uno: text-indigo-200 font-semibold'>❯</span>
				</>
			)}

			<button className=':uno: text-indigo-200 font-semibold  text-xs'>
				{selectedElement?.nodeName}
			</button>
		</div>
	)
}
