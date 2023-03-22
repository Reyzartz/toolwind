import { useMemo } from 'react'
import { getClassNames } from '../utils'
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

	if (element === null || rect === undefined) return null

	return (
		<>
			{selected ? (
				<SelectedElementPopup />
			) : (
				<ClassNamesTooltip
					classNames={getClassNames(element)}
					tagName={element.nodeName}
					rect={rect}
				/>
			)}

			{/* inspected Element Highted  */}
			<div
				id='toolwind-highlight-bar-t'
				className=':uno: border-t border-solid border-purple-600 fixed z-[10000]'
				style={{
					top: rect.y,
					left: rect.x,
					width: rect.width
				}}
			/>

			<div
				id='toolwind-highlight-bar-b'
				className=':uno: border-b border-solid border-purple-600 fixed z-[10000]'
				style={{
					top: rect.y + rect.height,
					left: rect.x,
					width: rect.width
				}}
			/>

			<div
				id='toolwind-highlight-bar-l'
				className=':uno: border-l border-solid border-purple-600 fixed z-[10000]'
				style={{
					top: rect.y,
					left: rect.x,
					height: rect.height
				}}
			/>

			<div
				id='toolwind-highlight-bar-r'
				className=':uno: border-r border-solid border-purple-600 fixed z-[10000]'
				style={{
					top: rect.y,
					left: rect.x + rect.width,
					height: rect.height
				}}
			/>
		</>
	)
}

export { InspectedElementHighlighter }
