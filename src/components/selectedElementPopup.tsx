import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import React, {
	type DragEventHandler,
	useCallback,
	useRef,
	useMemo,
} from 'react'
import { AddClassName } from './addClassName'
import { ClassNameTag } from './classNameTag'
import { SelectedElementHeader } from './selectedElementHeader'
import { computePosition, offset } from '@floating-ui/react'

const getVirtualEl = (x = 0, y = 0, width = 0, height = 0) => ({
	getBoundingClientRect() {
		return new DOMRect(x, y, width, height)
	},
})

interface ISelectedElementPopupProps {
	element: HTMLElement
}

export const SelectedElementPopup = React.memo(
	({ element }: ISelectedElementPopupProps) => {
		const { cssClasses } = useCSSClasses()

		const floatingEl = useRef<HTMLDivElement>(null)
		const initialPositionCleanup = useRef<() => void>()

		const rect = useMemo(() => element.getBoundingClientRect(), [element])

		const updatePosition: DragEventHandler = useCallback(
			({ clientX, clientY }) => {
				if (clientX === 0 && clientY === 0) return

				void computePosition(getVirtualEl(), floatingEl.current!, {
					middleware: [offset(8)],
				}).then(() => {
					initialPositionCleanup.current?.()

					Object.assign(floatingEl.current!.style, {
						position: 'fixed',
						// offsetting based on the move button position
						left: `${clientX - 278}px`,
						top: `${clientY - 19}px`,
					})
				})
			},
			[]
		)

		return (
			<>
				<div
					id="toolwind-tooltip my-2"
					ref={floatingEl}
					className="fixed"
					style={{ zIndex: 10000, top: rect.bottom, left: rect.left }}
				>
					<div
						className="bg-default"
						style={{
							width: 320,
						}}
					>
						<SelectedElementHeader updatePopupPosition={updatePosition} />

						<div className="flex flex-wrap gap-2 p-3 pt-2">
							{cssClasses.map((cssClass, ind) => (
								<ClassNameTag key={ind} cssClass={cssClass} />
							))}

							<AddClassName />
						</div>
					</div>
				</div>
			</>
		)
	}
)

SelectedElementPopup.displayName = 'SelectedElementPopup'
