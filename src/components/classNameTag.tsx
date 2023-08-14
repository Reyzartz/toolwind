import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import { type CSSClass } from '@toolwind/types/common'
import { type MouseEventHandler, useCallback } from 'react'
import { ClassNameInput } from './classNameInput'
import { CloseIcon } from '@toolwind/icons'
import clsx from 'clsx'

interface ClassNameTagProps {
	cssClass: CSSClass
}

export const ClassNameTag = ({
	cssClass: { id, className, meta, state, defaultClassName },
}: ClassNameTagProps) => {
	const { updateCssClass, removeCssClass } = useCSSClasses()

	const onUpdateHandler = useCallback(
		(value: string) => {
			void updateCssClass(id, { className: value, state: 'active' })
		},
		[id, updateCssClass]
	)

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
		useCallback(
			(e) => {
				e.stopPropagation()
				if (state === 'removed') return

				void updateCssClass(id, { state: 'editing' })
			},
			[id, state, updateCssClass]
		)

	const onDeleteHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()

			if (defaultClassName === null) {
				removeCssClass(id)
			} else {
				void updateCssClass(id, { state: 'removed' })
			}
		},
		[defaultClassName, id, removeCssClass, updateCssClass]
	)

	return (
		<div
			className={clsx(
				'relative transition-colors hover:bg-light max-w-max inline-flex items-center cursor-pointer group border border-default',
				state === 'removed'
					? 'text-neutral'
					: 'text-default hover:text-primary hover:font-semibold'
			)}
		>
			{state === 'editing' ? (
				<ClassNameInput
					defaultValue={{ name: className, variants: [] }}
					onSave={onUpdateHandler}
				/>
			) : (
				<button
					onClick={onClickHandler}
					className={clsx(
						'flex items-center gap-1 px-2 py-1 text-sm text-inherit border-none bg-transparent',
						state === 'removed' ? 'line-through cursor-text' : 'cursor-pointer'
					)}
				>
					{meta.color !== null && (
						<span
							className="w-3 h-3 inline-block border border-light rounded-1"
							style={{ background: meta.color }}
						/>
					)}

					{className}
				</button>
			)}

			{state === 'active' && (
				<button
					onClick={onDeleteHandler}
					className="p-2 pl-0 bg-transparent border-none h-full group-hover:opacity-100 transition-opacity"
				>
					<CloseIcon size={10} className="text-default hover:text-red-500" />
				</button>
			)}
		</div>
	)
}
