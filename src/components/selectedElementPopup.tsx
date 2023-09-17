import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import React, {
	type DragEventHandler,
	useCallback,
	useRef,
	useMemo
} from 'react'
import { AddClassName } from './addClassName'
import { ClassNameTag } from './classNameTag'
import { SelectedElementHeader } from './selectedElementHeader'
import { computePosition, flip, offset } from '@floating-ui/react'
import { useEffectOnce } from 'react-use'

interface ISelectedElementPopupProps {
	element: HTMLElement
}

export const SelectedElementPopup = React.memo(
	({ element }: ISelectedElementPopupProps) => {
		const { cssClasses } = useCSSClasses()

		const floatingEl = useRef<HTMLDivElement>(null)
		const referenceEl = useRef<HTMLDivElement>(null)

		const initialPositionCleanup = useRef<() => void>()

		const rect = useMemo(() => element.getBoundingClientRect(), [element])

		const updatePosition: DragEventHandler = useCallback(
			({ clientX, clientY }) => {
				if (clientX === 0 && clientY === 0) return

				void computePosition(referenceEl.current!, floatingEl.current!).then(() => {
					initialPositionCleanup.current?.()

					Object.assign(floatingEl.current!.style, {
						position: 'fixed',
						// offsetting based on the move button position
						left: `${clientX - 278}px`,
						top: `${clientY - 19}px`
					})
				})
			},
			[]
		)

		useEffectOnce(() => {
			void computePosition(referenceEl.current!, floatingEl.current!, {
				middleware: [offset(8), flip()]
			}).then(({ x, y }) => {
				initialPositionCleanup.current?.()

				Object.assign(floatingEl.current!.style, {
					position: 'fixed',
					// offsetting based on the move button position
					left: `${x}px`,
					top: `${y}px`
				})
			})
		})

		return (
			<>
				<div
					ref={referenceEl}
					className="pointer-events-none fixed"
					style={{
						zIndex: 10000,
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height
					}}
				/>

				<div
					id="toolwind-tooltip my-2"
					ref={floatingEl}
					className="fixed"
					style={{ zIndex: 10000 }}
				>
					<div
						className="bg-default"
						style={{
							width: 320
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
