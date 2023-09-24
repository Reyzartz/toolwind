import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import { useCallback } from 'react'
import { ClassNameInput } from './classNameInput'
import { useUnmount } from 'react-use'
import { AddIcon } from '@toolwind/icons'

const AddClassName = () => {
	const { isAdding, setIsAdding, addCssClass } = useCSSClasses()

	const onAddHandler = useCallback(
		(className: string) => {
			if (className.trim().length > 0) {
				void addCssClass(className)
			}

			setIsAdding(false)
		},
		[setIsAdding, addCssClass]
	)

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()
			setIsAdding(true)
		},
		[setIsAdding]
	)

	// close the input component when it unloaded
	useUnmount(() => {
		setIsAdding(false)
	})

	return (
		<div className="w-full">
			<div className="flex max-w-max ring-primary ring-opacity-70 focus-within:ring-2">
				{isAdding ? (
					<ClassNameInput onSave={onAddHandler} />
				) : (
					<button
						onClick={onClickHandler}
						className="flex items-center gap-2 px-2 py-0.5 text-sm font-semibold text-primary outline-none transition-colors hover:bg-light"
					>
						<AddIcon size={10} /> Add Class
					</button>
				)}
			</div>
		</div>
	)
}
export { AddClassName }
