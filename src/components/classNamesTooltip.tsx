import { autoUpdate, flip, useFloating } from '@floating-ui/react'
import { inspectedElementState } from '@toolwind/content/store'
import { getClassNames } from '@toolwind/helpers/cssClasses'
import { FontIcon, SizeIcon } from '@toolwind/icons'
import React, { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export interface IClassNamesTooltipProps {
	rect: DOMRect
}

export const ClassNamesTooltip = React.memo(
	({ rect }: IClassNamesTooltipProps) => {
		const inspectedElement = useRecoilValue(inspectedElementState)

		const { refs, floatingStyles } = useFloating({
			placement: 'top-start',
			whileElementsMounted: autoUpdate,
			middleware: [flip()]
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
						fontSize: computeStyles.getPropertyValue('font-size').replace('px', ''),
						fontFamily: computeStyles.getPropertyValue('font-family')
					}
			}

			return null
		}, [inspectedElement])

		if (inspectedElement === null) return null

		return (
			<>
				<div
					ref={refs.setReference}
					className="pointer-events-none fixed z-[10000] border border-primary"
					style={{
						top: rect.y,
						left: rect.x,
						width: rect.width,
						height: rect.height
					}}
				/>

				<div
					className="pointer-events-none fixed left-0 z-[10000] w-screen border-t border-dashed border-primary opacity-50"
					style={{
						top: rect.y
					}}
				/>

				<div
					className="pointer-events-none fixed left-0 z-[10000] w-screen border-t border-dashed border-primary opacity-50"
					style={{
						top: rect.y + rect.height - 1
					}}
				/>

				<div
					className="pointer-events-none fixed top-0 z-[10000] h-screen border-l border-dashed border-primary opacity-50"
					style={{
						left: rect.x
					}}
				/>

				<div
					className="pointer-events-none fixed top-0 z-[10000] h-screen border-l border-dashed border-primary opacity-50"
					style={{
						left: rect.x + rect.width - 1
					}}
				/>

				<div
					id="toolwind-tooltip"
					key={`${rect.y}+${rect.x}`}
					ref={refs.setFloating}
					style={{ ...floatingStyles, zIndex: 10000, pointerEvents: 'none' }}
				>
					<div
						className="space-y-1.5 bg-default p-2"
						style={{
							minWidth: 148,
							maxWidth: 296
						}}
					>
						<div className="flex w-full items-baseline lowercase text-default">
							<span className="whitespace-pre text-base font-bold text-primary">{`${inspectedElement.tagName}`}</span>
							<span className="truncate text-xs">
								{classNames.length === 0 ? '' : '.' + classNames.join('.')}
							</span>
						</div>

						<div className="flex items-center gap-2 text-xs">
							<SizeIcon size={14} className="text-primary" />

							<div className="flex items-center font-medium text-default">
								{rect.width.toFixed(2).replaceAll('.00', '')}
								<span className="mx-0.5 text-primary-dark">x</span>
								{rect.height.toFixed(2).replaceAll('.00', '')}
							</div>
						</div>

						{fontInfo !== null && (
							<div className="flex items-center gap-2 truncate  text-xs">
								<FontIcon size={14} className="text-primary" />

								<div className="truncate font-medium text-default">
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
