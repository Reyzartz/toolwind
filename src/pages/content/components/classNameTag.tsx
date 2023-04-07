import { useCallback, useState } from 'react'
import { CSSClass, CSSClassObject } from '../../../types/common'
import { searchForCss } from '../utils'
import { ClassNameInput } from './classNameInput'

interface ClassNameTagProps {
	cssClass: CSSClass
	onDelete: (id: string) => void
	onUpdate: (id: string, className: string) => void
}

export const ClassNameTag = ({
	cssClass: { id, displayName, className },
	onDelete,
	onUpdate
}: ClassNameTagProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])

	const onChangeHandler = useCallback(
		(value: string) => {
			onUpdate(id, value)

			setSuggestedClasses(searchForCss(value))
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
					className=':uno: px-2 py-1 text-sm text-inherit border-none bg-transparent'
				>
					{displayName}
				</button>
			)}

			{!isEditing && (
				<button
					onClick={() => onDelete(id)}
					className=':uno: pr-2 z-0 font-bold leading-none bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500'
				>
					⤫
				</button>
			)}
		</div>
	)
}
