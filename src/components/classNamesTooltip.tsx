import { inspectedElementState } from '@toolwind/content/store'
import { getClassNames } from '@toolwind/helpers/cssClasses'
import { FontIcon, SizeIcon } from '@toolwind/icons'
import React, { useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { useRecoilValue } from 'recoil'

export interface IClassNamesTooltipProps {
	rect: DOMRect
}

export const ClassNamesTooltip = React.memo(
	({ rect }: IClassNamesTooltipProps) => {
		const inspectedElement = useRecoilValue(inspectedElementState)

		const [referenceElement, setReferenceElement] = useState(null)
		const [popperElement, setPopperElement] = useState(null)

		const { styles, attributes } = usePopper(referenceElement, popperElement, {
			placement: 'top-start',
		})

		const classNames = useMemo(
			() => getClassNames(inspectedElement),
			[inspectedElement]
		)

		const fontInfo = useMemo(() => {
			if (inspectedElement === null) return null

			const computeStyles = window.getComputedStyle(inspectedElement)

			for (const node of inspectedElement.childNodes) {
				if (node.nodeName === '#text')
					return {
						fontSize: computeStyles
							.getPropertyValue('font-size')
							.replace('px', ''),
						fontFamily: computeStyles.getPropertyValue('font-family'),
					}
			}

			return null
		}, [inspectedElement])

		if (inspectedElement === null) return null

		return (
			<>
				<div
					ref={setReferenceElement as any}
					className="fixed pointer-events-none border border-primary z-[10000]"
					style={{
						top: rect.y,
						left: rect.x,
						width: rect.width,
						height: rect.height,
					}}
				/>

				<div
					className="opacity-50 fixed pointer-events-none border-t border-primary z-[10000] border-dashed w-screen left-0"
					style={{
						top: rect.y,
					}}
				/>

				<div
					className="opacity-50 fixed pointer-events-none border-t border-primary z-[10000] border-dashed w-screen left-0"
					style={{
						top: rect.y + rect.height - 1,
					}}
				/>

				<div
					className="opacity-50 fixed pointer-events-none border-l border-primary z-[10000] border-dashed h-screen top-0"
					style={{
						left: rect.x,
					}}
				/>

				<div
					className="opacity-50 fixed pointer-events-none border-l border-primary z-[10000] border-dashed h-screen top-0"
					style={{
						left: rect.x + rect.width - 1,
					}}
				/>

				<div
					id="toolwind-tooltip"
					key={`${rect.y}+${rect.x}`}
					ref={setPopperElement as any}
					style={{ ...styles.popper, zIndex: 10000, pointerEvents: 'none' }}
					{...attributes.popper}
				>
					<div
						className="bg-default p-2 space-y-1.5"
						style={{
							minWidth: 148,
							maxWidth: 296,
						}}
					>
						<div className="lowercase w-full flex items-baseline text-default">
							<span className="font-bold text-primary text-base">{`${inspectedElement.tagName}`}</span>
							<span className="text-xs truncate">
								{classNames.length === 0 ? '' : '.' + classNames.join('.')}
							</span>
						</div>

						<div className="flex items-center gap-2 text-xs">
							<SizeIcon size={14} className="text-primary" />

							<div className="flex items-center text-default font-medium">
								{rect.width.toFixed(2).replaceAll('.00', '')}
								<span className="text-primary-dark mx-0.5">x</span>
								{rect.height.toFixed(2).replaceAll('.00', '')}
							</div>
						</div>

						{fontInfo !== null && (
							<div className="flex gap-2 items-center text-xs  truncate">
								<FontIcon size={14} className="text-primary" />

								<div className="truncate text-default font-medium">
									<span>{fontInfo.fontSize}</span>
									<span className="text-primary-dark">px</span> ,
									<span className="truncate"> {fontInfo.fontFamily}</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		)
	}
)

ClassNamesTooltip.displayName = 'ClassNamesTooltip'
