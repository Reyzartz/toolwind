import { MouseEventHandler, useCallback, useState } from 'react'
import { CSSClass, CSSClassObject } from '../../../types/common'
import { ClassNameInput } from './classNameInput'
import { useTailwindIntellisense } from '../store/useTailwindIntellisense'

interface ClassNameTagProps {
	cssClass: CSSClass
	onDelete: (id: string) => void
	onUpdate: (id: string, className: string) => void
}

export const ClassNameTag = ({
	cssClass: { id, className, meta },
	onDelete,
	onUpdate
}: ClassNameTagProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])
	const { getSuggestionList } = useTailwindIntellisense()

	const onChangeHandler = useCallback(
		async (value: string) => {
			onUpdate(id, value)

			setSuggestedClasses(await getSuggestionList(value))
		},
		[id, onUpdate]
	)

	const onBlurHandler = useCallback(() => {
		setSuggestedClasses([])
		setIsEditing(false)
	}, [className])

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
		useCallback((e) => {
			e.stopPropagation()
			setIsEditing(true)
		}, [])

	const onDeleteHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()
			onDelete(id)
		},
		[onDelete, id]
	)

	return (
		<div className=':uno: relative bg-indigo-900 border border-solid border-indigo-600 rounded-[4px] max-w-max flex cursor-pointer text-indigo-200'>
			{isEditing ? (
				<ClassNameInput
					classNames={suggestedClasses}
					onChange={onChangeHandler}
					defaultValue={{ name: className }}
					onBlur={onBlurHandler}
				/>
			) : (
				<button
					onClick={onClickHandler}
					className=':uno: flex items-center gap-1 px-1.5 py-1 text-sm text-inherit border-none bg-transparent'
				>
					{meta.color !== null && (
						<span
							className=':uno: w-4 h-4 inline-block border border-gray-900 rounded-1'
							style={{ background: meta.color }}
						/>
					)}

					{className}
				</button>
			)}

			{!isEditing && (
				<button
					onClick={onDeleteHandler}
					className=':uno: pr-1.5 z-0 font-bold leading-none bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500'
				>
					⤫
				</button>
			)}
		</div>
	)
}
