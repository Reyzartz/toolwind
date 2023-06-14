import { useCallback } from 'react'
import { ClassNameInput } from '.'
import { useCSSClasses } from '../hooks/useCssClasses'

const AddClassName = () => {
	const { isAdding, setIsAdding, addCssClass } = useCSSClasses()

	const onAddHandler = useCallback(
		(className: string) => {
			if (className.trim().length > 0) {
				addCssClass(className)
			}
			setIsAdding(false)
		},
		[setIsAdding]
	)


	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
		useCallback(
			(e) => {
				e.stopPropagation()

				setIsAdding(true)
			},
			[setIsAdding]
		)

	return (
		<div>
			{isAdding ? (
				<ClassNameInput
					defaultValue={{ name: '', variants: [] }}
					onSave={onAddHandler}
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
