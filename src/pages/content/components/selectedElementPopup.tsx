import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import { AddClassName, ClassNameTag } from '.'
import { useSetRecoilState } from 'recoil'
import { inspectedElementState, selectedElementState } from '../store'
import { useCSSClasses } from '../hooks/useCssClasses'
import { ParentElementSelector } from './parentElementSelector'

export interface ISelectedElementPopupProps {
	rect: DOMRect
}

export const SelectedElementPopup = React.memo(
	({ rect }: ISelectedElementPopupProps) => {
		const { cssClasses } = useCSSClasses()

		const [referenceElement, setReferenceElement] = useState(null)
		const [popperElement, setPopperElement] = useState(null)
		const [arrowElement, setArrowElement] = useState(null)

		const setInspectedElement = useSetRecoilState(inspectedElementState)
		const setSelectedElement = useSetRecoilState(selectedElementState)

		const { styles, attributes } = usePopper(referenceElement, popperElement, {
			placement: 'bottom-end',

			modifiers: [
				{
					name: 'preventOverflow',
					options: {
						rootBoundary: 'document'
					}
				},
				{ name: 'arrow', options: { element: arrowElement, padding: 16 } },
				{
					name: 'offset',
					options: {
						offset: [0, 8]
					}
				}
			]
		})

		return (
			<>
				<div
					ref={setReferenceElement as any}
					className={`:uno: border border-solid fixed z-[10000] pointer-events-none border-indigo-600`}
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
						<div className=':uno: flex justify-between w-full items-center mb-2'>
							<ParentElementSelector />

							<button
								onClick={() => setSelectedElement(null)}
								className=':uno: pr-1.5 font-bold leading-1 bg-transparent border-none h-full text-slate-400 hover:text-slate-500 text-2xl'
							>
								⤫
							</button>
						</div>

						<div className=':uno: p-3 w-72 bg-indigo-800 border border-indigo-600 rounded-md flex flex-wrap gap-2'>
							{cssClasses.map((cssClass, ind) => (
								<ClassNameTag key={ind} cssClass={cssClass} />
							))}

							<AddClassName />
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
)
