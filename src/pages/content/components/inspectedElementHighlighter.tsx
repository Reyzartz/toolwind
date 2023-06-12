import { useMemo } from 'react'
import { getElementPosition } from '../helpers/utils'
import { ClassNamesTooltip, SelectedElementPopup } from '.'

interface ElementOverlayProps {
	element: HTMLElement | null
	selected?: boolean
}

const InspectedElementHighlighter = ({
	element,
	selected = false
}: ElementOverlayProps): JSX.Element | null => {
	const rect = useMemo(() => element?.getClientRects()[0], [element])

	const position = useMemo(() => getElementPosition(element), [element])

	if (element === null || rect === undefined) return null

	return (
		<>
			{selected ? <SelectedElementPopup /> : <ClassNamesTooltip />}

			{/* inspected Element Highted  */}
			<div
				id='toolwind-highlight-bar-t'
				className={`:uno: border-t absolute z-[10000] ${
					selected
						? 'border-solid border-indigo-600'
						: 'border-dashed border-purple-600'
				}`}
				style={{
					top: position.y,
					left: position.x,
					width: element.offsetWidth
				}}
			/>

			<div
				id='toolwind-highlight-bar-b'
				className={`:uno: border-b absolute z-[10000] ${
					selected
						? 'border-solid border-indigo-600'
						: 'border-dashed border-purple-600'
				}`}
				style={{
					top: position.y + element.offsetHeight,
					left: position.x,
					width: element.offsetWidth
				}}
			/>

			<div
				id='toolwind-highlight-bar-l'
				className={`:uno: border-l absolute z-[10000] ${
					selected
						? 'border-solid border-indigo-600'
						: 'border-dashed border-purple-600'
				}`}
				style={{
					top: position.y,
					left: position.x,
					height: element.offsetHeight
				}}
			/>

			<div
				id='toolwind-highlight-bar-r'
				className={`:uno: border-r absolute z-[10000] ${
					selected
						? 'border-solid border-indigo-600'
						: 'border-dashed border-purple-600'
				}`}
				style={{
					top: position.y,
					left: position.x + element.offsetWidth,
					height: element.offsetHeight
				}}
			/>
		</>
	)
}

export { InspectedElementHighlighter }
