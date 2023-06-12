import { useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { useRecoilValue } from 'recoil'
import { inspectedElementState } from '../store'
import { getClassNames, getElementPosition } from '../helpers/utils'

export const ClassNamesTooltip = () => {
	const inspectedElement = useRecoilValue(inspectedElementState)

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: 'top-end'
	})

	const position = useMemo(
		() => getElementPosition(inspectedElement),
		[inspectedElement]
	)

	const classNames = useMemo(
		() => getClassNames(inspectedElement),
		[inspectedElement]
	)

	if (inspectedElement === null) return null

	return (
		<>
			<div
				ref={setReferenceElement as any}
				className=':uno: absolute z-[-10000]'
				style={{
					top: position.y,
					left: position.x + 2,
					width: inspectedElement.offsetWidth,
					height: inspectedElement.offsetHeight
				}}
			/>

			<div
				id='toolwind-tooltip'
				key={`${position.y}+${position.x}`}
				ref={setPopperElement as any}
				style={{ ...styles.popper, zIndex: 10000 }}
				{...attributes.popper}
			>
				<div className=':uno: bg-purple-600 min-w-[48px] shadow-md px-3 py-1 rounded-t-md text-xs text-slate-200 lowercase'>
					{`<${inspectedElement.tagName}>${
						classNames.length === 0 ? '' : '.' + classNames.join('.')
					}`}
				</div>
			</div>
		</>
	)
}
