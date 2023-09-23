import {
	inspectedElementState,
	selectedElementState
} from '@toolwind/content/store'
import {
	CheckMarkIcon,
	CloseIcon,
	CopyIcon,
	DeleteIcon,
	DragIcon
} from '@toolwind/icons'
import { CaretIcon } from '@toolwind/icons/caretIcon'
import clsx from 'clsx'
import { type DragEventHandler, useEffect, useState } from 'react'
import { useToggle } from 'react-use'
import { useRecoilState, useSetRecoilState } from 'recoil'

const emptyImg = new Image()

emptyImg.src =
	'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

interface SelectedElementHeaderProps {
	updatePopupPosition: DragEventHandler
}

export const SelectedElementHeader = ({
	updatePopupPosition
}: SelectedElementHeaderProps) => {
	const [selectedElement, setSelectedElement] =
		useRecoilState(selectedElementState)
	const [parentElement, setParentElement] = useState<HTMLElement | null>(null)
	const [copied, setCopied] = useToggle(false)
	const [isDragging, setIsDragging] = useToggle(false)

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
		<div className="flex max-w-full items-center justify-between gap-1.5 p-1.5">
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
					className="whitespace-pre border-none pl-2 text-base font-bold lowercase text-default hover:text-primary active:text-primary-dark"
				>
					{parentElement.tagName}
				</button>
			)}

			<CaretIcon size={10} className="-mx-0.5 text-default" />

			<h1
				className="flex w-full flex-grow items-baseline overflow-hidden"
				onMouseEnter={() => {
					setInspectedElement(selectedElement)
				}}
				onMouseLeave={() => {
					setInspectedElement(null)
				}}
			>
				<span className="text-base font-semibold lowercase leading-4 text-primary">
					{selectedElement!.nodeName}
				</span>
			</h1>

			<div className="flex gap-1.5">
				<button
					onClick={copyClassNameHandler}
					className="group flex items-center gap-1 whitespace-pre border-none text-default hover:text-primary active:text-primary-dark"
				>
					{copied ? <CheckMarkIcon size={12} /> : <CopyIcon size={12} />}

					<span
						className={clsx(
							'w-0 overflow-hidden text-xs font-bold transition-all',
							copied ? 'group-hover:w-11' : 'group-hover:w-8'
						)}
					>
						{copied ? 'Copied' : 'Copy'}
					</span>
				</button>

				<button
					onClick={removeElementHandler}
					className="group flex items-center gap-1 whitespace-pre border-none text-default hover:text-red-500 active:hover:text-red-600"
				>
					<DeleteIcon size={12} />

					<span className="w-0 overflow-hidden text-xs font-bold transition-all group-hover:w-12">
						Remove
					</span>
				</button>

				<button
					draggable
					onDragStart={(e) => {
						e.dataTransfer.setDragImage(emptyImg, 0, 0)
						setIsDragging(true)
					}}
					onDrag={updatePopupPosition}
					onDragEnd={(e) => {
						updatePopupPosition(e)
						setIsDragging(false)
					}}
					className={clsx(
						'group  flex cursor-grab items-center gap-1 whitespace-pre border-none text-default',
						isDragging
							? 'text-primary-dark'
							: 'hover:text-primary active:text-primary-dark'
					)}
				>
					<DragIcon size={12} />

					<span
						className={clsx(
							'overflow-hidden text-xs font-bold transition-all',
							isDragging ? 'w-8' : 'w-0 group-hover:w-8'
						)}
					>
						Move
					</span>
				</button>

				<button
					onClick={() => {
						setSelectedElement(null)
					}}
					className="group flex items-center gap-1 whitespace-pre border-none text-default hover:text-primary active:text-primary-dark"
				>
					<CloseIcon size={12} />

					<span className="w-0 overflow-hidden text-xs font-bold transition-all group-hover:w-8 ">
						Close
					</span>
				</button>
			</div>
		</div>
	)
}
