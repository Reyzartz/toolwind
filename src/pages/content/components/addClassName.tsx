import { useCallback, useState } from 'react'
import { ClassNameInput } from '.'
import { CSSClassObject } from '../../../types/common'
import { useTailwindIntellisense } from '../store/useTailwindIntellisense'

interface AddClassNameProps {
	addClassName: (className: string) => void
}

const AddClassName = ({ addClassName }: AddClassNameProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const { getSuggestionList } = useTailwindIntellisense()

	const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])
	const [className, setClassName] = useState('')

	const onChangeHandler = useCallback(async (value: string) => {
		setClassName(value)
		setSuggestedClasses(await getSuggestionList(value))
	}, [])

	const onBlurHandler = useCallback(() => {
		setSuggestedClasses([])
		setClassName('')
		setIsEditing(false)

		if (className.trim().length > 0) {
			addClassName(className)
		}
	}, [addClassName, className])

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
		useCallback((e) => {
			e.stopPropagation()
			setIsEditing(true)
		}, [])

	return (
		<div>
			{isEditing ? (
				<ClassNameInput
					classNames={suggestedClasses}
					onChange={onChangeHandler}
					defaultValue={{ name: className, variants: [] }}
					onBlur={onBlurHandler}
				/>
			) : (
				<button
					onClick={onClickHandler}
					className=':uno: text-sm text-indigo-400 py-1 px-2 rounded-1 hover:text-indigo-200'
				>
					+ Add Class
				</button>
			)}
		</div>
	)
}
export { AddClassName }
