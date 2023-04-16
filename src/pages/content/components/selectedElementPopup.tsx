import { useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { AddClassName, ClassNameTag } from '.'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { inspectedElementState, selectedElementState } from '../store'
import { useCSSClasses } from '../store/cssClassStore'
import { ParentElementSelector } from './parentElementSelector'

export const SelectedElementPopup = () => {
	const element = useRecoilValue(selectedElementState) as HTMLElement

	const { addCssClass, removeCssClass, cssClasses, updateCssClass } =
		useCSSClasses()

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)

	const setInspectedElement = useSetRecoilState(inspectedElementState)

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: 'bottom-end',

		modifiers: [
			{ name: 'arrow', options: { element: arrowElement, padding: 16 } },
			{
				name: 'offset',
				options: {
					offset: [0, 8]
				}
			}
		]
	})

	const rect = useMemo(() => element.getClientRects()[0], [element])

	return (
		<>
			<div
				ref={setReferenceElement as any}
				className=':uno: fixed z-[-10000]'
				style={{
					top: rect.y,
					left: rect.x,
					width: rect.width,
					height: rect.height
				}}
			/>

			<div
				id='toolwind-tooltip'
				key={`${rect.y + rect.x}`}
				ref={setPopperElement as any}
				style={{ ...styles.popper, zIndex: 10000 }}
				{...attributes.popper}
			>
				<div
					className=':uno: bg-indigo-900 shadow-md p-3 rounded-lg text-sm text-slate-200 lowercase'
					onMouseEnter={() => setInspectedElement(null)}
				>
					<ParentElementSelector />

					<div className=':uno: p-3 w-72 bg-indigo-800 border border-indigo-600 rounded-md flex flex-wrap gap-2'>
						{cssClasses.map((cssClass, ind) => (
							<ClassNameTag
								key={ind}
								cssClass={cssClass}
								onDelete={removeCssClass}
								onUpdate={updateCssClass}
							/>
						))}

						<AddClassName addClassName={addCssClass} />
					</div>
				</div>

				<div
					id='toolwind-arrow'
					ref={setArrowElement as any}
					style={styles.arrow}
					className=':uno: bg-indigo-900 border-transparent'
				/>
			</div>
		</>
	)
}
