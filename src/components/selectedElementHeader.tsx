import {
	inspectedElementState,
	selectedElementState,
} from '@toolwind/content/store'
import { CloseIcon } from '@toolwind/icons'
import { CaretIcon } from '@toolwind/icons/caretIcon'
import { useEffect, useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

export const SelectedElementHeader = () => {
	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)
	const [parentElement, setParentElement] = useState<HTMLElement | null>(null)

	const setInspectedElement = useSetRecoilState(inspectedElementState)

	useEffect(() => {
		if (selectedElement !== null) {
			setParentElement(selectedElement.parentElement)
		}
	}, [selectedElement])

	const selectedElementHandler = (e: any, element: HTMLElement | null) => {
		e.stopPropagation()
		if (element === null) return

		setSelectedElement(element)
	}

	return (
		<div className="max-w-full items-center flex justify-between gap-1.5 p-1.5">
			{parentElement !== null && (
				<button
					onMouseEnter={() => {
						setInspectedElement(parentElement)
					}}
					onMouseLeave={() => {
						setInspectedElement(null)
					}}
					onClick={(e) => {
						selectedElementHandler(e, parentElement)
					}}
					className="border-none text-default text-base font-semibold hover:text-primary pl-2 lowercase"
				>
					{parentElement.tagName}
				</button>
			)}

			<CaretIcon size={12} className="text-default" />

			<h1 className="flex-grow flex items-baseline">
				<span className="text-primary font-semibold text-base leading-4 lowercase">
					{selectedElement!.nodeName}
				</span>

				<span
					className="text-sm leading-4 truncate inline-block text-default"
					style={{ maxWidth: 148 }}
				>
					{Boolean(selectedElement!.id) && '#'}
					{selectedElement!.id}
					{Boolean(selectedElement!.className) && '.'}
					{selectedElement!.className.replace(' ', '.')}
				</span>
			</h1>

			<button
				onClick={() => {
					setSelectedElement(null)
				}}
				className="border-none text-default  active:bg-dark hover:text-primary p-2 hover:bg-light"
			>
				<CloseIcon size={12} />
			</button>
		</div>
	)
}
