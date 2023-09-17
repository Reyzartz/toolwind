import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react'
import { useTailwindIntellisense } from '@toolwind/content/hooks/useTailwindIntellisense'
import { activeCssClassState } from '@toolwind/content/store'
import {
	getClassNameFromCSSClassSuggestionItem,
	getCssClassObjectFromClassName,
	isCustomClass
} from '@toolwind/helpers/cssClasses'
import { CloseIcon } from '@toolwind/icons'
import { type CSSClassSuggestionItem } from '@toolwind/types/common'
import clsx from 'clsx'
import { type UseComboboxStateChange, useCombobox } from 'downshift'
import { useCallback, useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useRecoilState } from 'recoil'

interface ClassNameInputProps {
	onSave: (value: string) => void
	defaultValue?: CSSClassSuggestionItem | null
	initialWidth?: number
}

const ClassNameInput = ({
	defaultValue = null,
	onSave,
	initialWidth = 148
}: ClassNameInputProps) => {
	const [suggestedClasses, setSuggestedClasses] = useState<
		CSSClassSuggestionItem[]
	>([])

	const { getCssText, getSuggestionList } = useTailwindIntellisense()

	const [activeOption, setActiveClassOption] =
		useRecoilState(activeCssClassState)

	const textElementWidthRef = useRef<HTMLSpanElement>(null)

	const onSelectedItemChange = useCallback(
		({ selectedItem = null }: UseComboboxStateChange<CSSClassSuggestionItem>) => {
			// triggered if the active option is an variant

			if (selectedItem === null || (selectedItem.isVariant ?? false)) return

			onSave(getClassNameFromCSSClassSuggestionItem(selectedItem))

			return true
		},
		[onSave]
	)

	const setActiveOptionHandler = useCallback(
		async (cssClass: CSSClassSuggestionItem | null) => {
			if (cssClass === null) {
				setActiveClassOption(null)
				return
			}

			const className = getClassNameFromCSSClassSuggestionItem(cssClass)

			if (className === activeOption?.className) return

			const cssText = await getCssText(className)

			setActiveClassOption(getCssClassObjectFromClassName(className, cssText))
		},
		[activeOption?.className, getCssText, setActiveClassOption]
	)

	const onInputValueChange = useCallback(
		({ inputValue = '' }: UseComboboxStateChange<CSSClassSuggestionItem>) => {
			if (isCustomClass(inputValue)) {
				setSuggestedClasses([])

				void getCssText(inputValue).then((cssText) => {
					setActiveClassOption(getCssClassObjectFromClassName(inputValue, cssText))
				})
			}

			void getSuggestionList(inputValue).then((list) => {
				setSuggestedClasses(list)

				void setActiveOptionHandler(list[0] ?? null)
			})
		},
		[getSuggestionList, getCssText, setActiveClassOption, setActiveOptionHandler]
	)

	const onActiveOptionChange = useCallback(
		({
			highlightedIndex = 0,
			isOpen = false
		}: UseComboboxStateChange<CSSClassSuggestionItem>) => {
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
	} = useCombobox<CSSClassSuggestionItem>({
		items: suggestedClasses,
		itemToString: (item) => getClassNameFromCSSClassSuggestionItem(item!),
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
		middleware: [flip(), offset(8)]
	})

	useMount(() => {
		if (defaultValue != null) {
			// setting Active option to defaultValue on umount
			void setActiveOptionHandler(defaultValue)
		}
	})

	useUnmount(() => {
		// setting Active option to null on unmount
		void setActiveOptionHandler(null)
	})

	const onKeyUpHandler: React.KeyboardEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				const value = (e.target as HTMLInputElement).value

				if (e.code === 'Enter' && isCustomClass(value)) {
					onSave(value)
					return
				}

				if (e.code === 'BracketLeft') {
					setInputValue(value + ']')
				}
			},
			[onSave, setInputValue]
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
					'flex h-6 items-center bg-light px-2 py-0.5 placeholder-opacity-30 transition-all'
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
						onKeyUpCapture: onKeyUpHandler,
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
					<div className="but you can still add it bg-light p-3 text-center text-sm text-default">
						This class name is not supported by tailwindcss
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
							{suggestedClass.color === undefined ? (
								<span>{suggestedClass.isVariant === true ? `{}` : '☲'}</span>
							) : (
								<span
									className={clsx(
										'inline-block h-3 w-3 border',
										highlightedIndex === index ? 'border-primary' : 'border-light'
									)}
									style={{ background: suggestedClass.color }}
								/>
							)}

							<span>{suggestedClass.name}</span>
						</li>
					))
				)}
			</ul>
		</div>
	)
}

export { ClassNameInput }
