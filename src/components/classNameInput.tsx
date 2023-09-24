import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating
} from '@floating-ui/react'
import { tailwindAutoComplete } from '@toolwind/content'
import { activeCssClassState } from '@toolwind/content/store'
import {
	getClassNameFromSuggestionItem,
	getCssClassObjectFromClassName,
	isCustomClass
} from '@toolwind/helpers/cssClasses'
import { CloseIcon } from '@toolwind/icons'
import clsx from 'clsx'
import { type UseComboboxStateChange, useCombobox } from 'downshift'
import { useCallback, useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useRecoilState } from 'recoil'
import { type SuggestionItem } from 'tailwindcss-autocomplete'

interface ClassNameInputProps {
	onSave: (value: string) => void
	defaultValue?: SuggestionItem | null
	initialWidth?: number
}

const ClassNameInput = ({
	defaultValue = null,
	onSave,
	initialWidth = 148
}: ClassNameInputProps) => {
	const [suggestedClasses, setSuggestedClasses] = useState<SuggestionItem[]>([])

	const [activeOption, setActiveClassOption] =
		useRecoilState(activeCssClassState)

	const textElementWidthRef = useRef<HTMLSpanElement>(null)

	const onSelectedItemChange = useCallback(
		({ selectedItem = null }: UseComboboxStateChange<SuggestionItem>) => {
			// triggered if the active option is an variant

			if (selectedItem === null || selectedItem.isVariant) return

			onSave(getClassNameFromSuggestionItem(selectedItem))
		},
		[onSave]
	)

	const setActiveOptionHandler = useCallback(
		async (cssClass: SuggestionItem | null) => {
			if (cssClass === null) {
				setActiveClassOption(null)
				return
			}

			const className = getClassNameFromSuggestionItem(cssClass)

			if (className === activeOption?.className) return

			const cssText = await tailwindAutoComplete.getCssText(className)

			setActiveClassOption(getCssClassObjectFromClassName(className, cssText))
		},
		[activeOption?.className, setActiveClassOption]
	)

	const onInputValueChange = useCallback(
		({ inputValue = '' }: UseComboboxStateChange<SuggestionItem>) => {
			if (isCustomClass(inputValue)) {
				setSuggestedClasses([])

				void tailwindAutoComplete.getCssText(inputValue).then((cssText) => {
					setActiveClassOption(getCssClassObjectFromClassName(inputValue, cssText))
				})
			}

			const query = inputValue.endsWith(':') ? '' : inputValue

			void tailwindAutoComplete.getSuggestionList(query).then((list) => {
				// the full list can contain more than 11000+ classnames so it's important to slice it

				setSuggestedClasses(list.slice(0, 50))

				void setActiveOptionHandler(list[0] ?? null)
			})
		},
		[setActiveClassOption, setActiveOptionHandler]
	)

	const onActiveOptionChange = useCallback(
		({
			highlightedIndex = 0,
			isOpen = false
		}: UseComboboxStateChange<SuggestionItem>) => {
			const cssClass = suggestedClasses[highlightedIndex]

			if (cssClass === undefined || !isOpen) return

			void setActiveOptionHandler(cssClass)
		},
		[suggestedClasses, setActiveOptionHandler]
	)

	const onCancelHandler = useCallback(() => {
		onSave(defaultValue?.name ?? '')
	}, [defaultValue?.name, onSave])

	const {
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
		inputValue,
		setInputValue,
		isOpen
	} = useCombobox<SuggestionItem>({
		items: suggestedClasses,
		itemToString: (item) => getClassNameFromSuggestionItem(item!),
		defaultHighlightedIndex: 0,
		onInputValueChange,
		onHighlightedIndexChange: onActiveOptionChange,
		onSelectedItemChange,
		defaultInputValue: defaultValue?.name,
		defaultSelectedItem: defaultValue
	})

	const { refs, floatingStyles } = useFloating({
		placement: 'bottom-start',
		open: isOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			flip(),
			offset(8),
			shift({
				boundary: {
					x: 0,
					y: 0,
					width: innerWidth,
					height: innerHeight
				}
			})
		]
	})

	useMount(() => {
		if (defaultValue != null) {
			// setting Active option to defaultValue on mount
			void setActiveOptionHandler(defaultValue)

			// setting initial suggestion list

			void tailwindAutoComplete
				.getSuggestionList(getClassNameFromSuggestionItem(defaultValue))
				.then((list) => {
					setSuggestedClasses(list.slice(0, 50))
				})
		}
	})

	useUnmount(() => {
		// setting Active option to null on unmount
		void setActiveOptionHandler(null)
	})

	const onKeyDownHandler: React.KeyboardEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				const value = (e.target as HTMLInputElement).value

				if (e.code === 'Tab' && activeOption?.className.endsWith(':') === true) {
					e.stopPropagation()
					e.preventDefault()

					setInputValue(activeOption?.className ?? '')
				}

				if (e.code === 'Enter' && (isCustomClass(value) || activeOption === null)) {
					console.log('save')

					onSave(value)
					
				}

				// if (e.key === '[') {
				// 	const end = e.target as HTMLInputElement

				// 	const caretPosition = end.selectionStart ?? value.length

				// 	setInputValue(
				// 		value.slice(0, caretPosition) +
				// 			']' +
				// 			value.slice(caretPosition + 1, value.length)
				// 	)

				// 	setTimeout(() => {
				// 		end.setSelectionRange(caretPosition, caretPosition)
				// 	}, 0)
				// }
			},
			[activeOption, onSave, setInputValue]
		)

	return (
		<div className="relative">
			<span
				ref={textElementWidthRef}
				className="pointer-events-none absolute whitespace-pre pl-1.5 pr-7 text-sm opacity-0"
			>
				{inputValue.length === 0
					? defaultValue?.name ?? 'Enter class name'
					: inputValue}
			</span>

			<div
				className={clsx(
					'flex h-6 items-center bg-light px-2 py-1 placeholder-opacity-30 transition-all'
				)}
				style={{
					width: `min(${
						textElementWidthRef.current?.getClientRects()[0].width ?? initialWidth
					}px, 296px)`
				}}
				ref={refs.setReference}
			>
				<input
					{...getInputProps({
						onKeyDownCapture: onKeyDownHandler,
						onBlur: onCancelHandler,
						className: clsx(
							'm-0 text-sm bg-transparent focus:!outline-none text-default w-full',
							inputValue.length === 0 && 'opacity-50'
						),
						placeholder: defaultValue?.name ?? 'Enter class name',
						autoFocus: true
					})}
				/>

				<button
					onClick={onCancelHandler}
					className="text-default hover:text-red-500"
				>
					<CloseIcon size={10} />
				</button>
			</div>

			<ul
				style={{ ...floatingStyles, zIndex: 10000 }}
				{...getMenuProps({
					ref: refs.setFloating,
					className: clsx(
						'flex flex-col absolute z-[10000] top-full max-h-60 left-0 overflow-auto w-60 bg-light p-1.5',
						(inputValue.length === 0 || !isOpen) && 'hidden'
					)
				})}
			>
				{suggestedClasses.length === 0 ? (
					<div className="-m-1.5 p-2 text-default">
						<h5 className="mb-2 flex gap-1 text-lg font-bold leading-5 text-yellow-500">
							<span>⚠</span> No Results Found with current config
						</h5>
						<p className="text-sm leading-4">
							But, you can still add the class by pressing{' '}
							<span className="font-semibold">↵</span> Enter
						</p>
					</div>
				) : (
					suggestedClasses.map((suggestedClass, index) => (
						<li
							key={`${suggestedClass.name}${index}`}
							{...getItemProps({
								item: suggestedClass,
								index,
								className: clsx(
									'flex gap-2 items-baseline text-default text-sm px-2 py-1.5 cursor-pointer',
									highlightedIndex === index && 'text-primary font-semibold bg-default'
								)
							})}
						>
							{suggestedClass.color === null ? (
								<span>{suggestedClass.isVariant ? `{}` : '☲'}</span>
							) : (
								<span
									className={clsx(
										'inline-block h-3 w-3 border',
										highlightedIndex === index ? 'border-primary' : 'border-light'
									)}
									style={{ background: suggestedClass.color }}
								/>
							)}

							<span className="flex-grow">{suggestedClass.name}</span>

							{highlightedIndex === index && (
								<kbd className="block rounded-sm border border-default px-1 py-0.5 font-mono text-[10px] font-semibold leading-3 text-default">
									tab
								</kbd>
							)}
						</li>
					))
				)}
			</ul>
		</div>
	)
}

export { ClassNameInput }
