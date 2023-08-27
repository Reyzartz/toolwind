import {
	defaultCssClassesState,
	inspectedElementState,
	selectedElementState,
} from '@toolwind/content/store'
import { CheckMarkIcon, CloseIcon, CopyIcon, DeleteIcon } from '@toolwind/icons'
import { CaretIcon } from '@toolwind/icons/caretIcon'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const SelectedElementHeader = () => {
	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)
	const [parentElement, setParentElement] = useState<HTMLElement | null>(null)
	const [copied, setCopied] = useToggle(false)

	const defaultCssClasses = useRecoilValue(defaultCssClassesState)

	const setInspectedElement = useSetRecoilState(inspectedElementState)

	useEffect(() => {
		if (selectedElement !== null) {
			setParentElement(selectedElement.parentElement)
		}
	}, [selectedElement])

	const selectedElementHandler = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		element: HTMLElement | null
	) => {
		event.stopPropagation()
		if (element === null) return

		setSelectedElement(element)
	}

	const copyClassNameHandler = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation()
		if (selectedElement === null) return

		void navigator.clipboard.writeText(selectedElement.className)

		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 3000)
	}

	const removeElementHandler = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation()
		if (selectedElement === null) return

		setSelectedElement(null)

		selectedElement.remove()
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
					className="border-none text-default text-base font-bold hover:text-primary active:text-primary-dark pl-2 lowercase"
				>
					{parentElement.tagName}
				</button>
			)}

			<CaretIcon size={10} className="text-default -mx-0.5" />

			<h1 className="flex-grow flex items-baseline w-full overflow-hidden">
				<span className="text-primary font-semibold text-base leading-4 lowercase">
					{selectedElement!.nodeName}
				</span>

				<span className="text-xs flex-grow leading-4 truncate inline-block text-default">
					{Boolean(selectedElement!.id) && '#'}
					{selectedElement!.id}
					{Boolean(selectedElement!.className) && '.'}
					{defaultCssClasses.join('.')}
				</span>
			</h1>

			<div className="gap-1.5 flex">
				<button
					onClick={copyClassNameHandler}
					className="border-none text-default group flex items-center gap-1 hover:text-primary active:text-primary-dark"
				>
					{copied ? <CheckMarkIcon size={12} /> : <CopyIcon size={12} />}

					<span
						className={clsx(
							'w-0 overflow-hidden transition-all text-xs font-bold',
							copied ? 'group-hover:w-11' : 'group-hover:w-8'
						)}
					>
						{copied ? 'Copied' : 'Copy'}
					</span>
				</button>

				<button
					onClick={removeElementHandler}
					className="border-none text-default group flex items-center gap-1 hover:text-red-500 active:hover:text-red-600"
				>
					<DeleteIcon size={12} />

					<span className="w-0 overflow-hidden transition-all group-hover:w-12 text-xs font-bold">
						Remove
					</span>
				</button>

				<button
					onClick={() => {
						setSelectedElement(null)
					}}
					className="border-none text-default group flex items-center gap-1 hover:text-primary active:text-primary-dark"
				>
					<CloseIcon size={12} />

					<span className="w-0 overflow-hidden transition-all group-hover:w-9 text-xs font-bold">
						Close
					</span>
				</button>
			</div>
		</div>
	)
}
