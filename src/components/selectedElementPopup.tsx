import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import { AddClassName } from './addClassName'
import { ClassNameTag } from './classNameTag'
import { SelectedElementHeader } from './selectedElementHeader'

export interface ISelectedElementPopupProps {
	rect: DOMRect
}

export const SelectedElementPopup = React.memo(
	({ rect }: ISelectedElementPopupProps) => {
		const { cssClasses } = useCSSClasses()

		const [referenceElement, setReferenceElement] = useState(null)
		const [popperElement, setPopperElement] = useState(null)
		const [arrowElement, setArrowElement] = useState(null)

		const { styles, attributes } = usePopper(referenceElement, popperElement, {
			placement: 'bottom-start',
			modifiers: [
				{
					name: 'preventOverflow',
					options: {
						rootBoundary: 'document',
					},
				},
				{
					name: 'arrow',
					options: { element: arrowElement, padding: 16 },
				},
				{
					name: 'offset',
					options: {
						offset: [0, 8],
					},
				},
			],
		})

		return (
			<>
				<div
					ref={setReferenceElement as any}
					className="border border-solid fixed z-[10000] pointer-events-none border-default"
					style={{
						top: rect.y,
						left: rect.x,
						width: rect.width,
						height: rect.height,
					}}
				/>

				<div
					id="toolwind-tooltip"
					key={`${rect.y + rect.x}`}
					ref={setPopperElement as any}
					style={{ ...styles.popper, zIndex: 10000 }}
					{...attributes.popper}
				>
					<div
						className="bg-default"
						style={{
							width: 320,
						}}
					>
						<SelectedElementHeader />

						<div className="flex flex-wrap gap-2 p-3 pt-2">
							{cssClasses.map((cssClass, ind) => (
								<ClassNameTag key={ind} cssClass={cssClass} />
							))}

							<AddClassName />
						</div>
					</div>

					<div
						id="toolwind-arrow"
						ref={setArrowElement as any}
						style={styles.arrow}
						className="bg-default border-transparent"
					/>
				</div>
			</>
		)
	}
)

SelectedElementPopup.displayName = 'SelectedElementPopup'
