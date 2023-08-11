import { useTailwindIntellisense } from '@toolwind/content/hooks/useTailwindIntellisense'
import { activeCssClassState } from '@toolwind/content/store'
import {
	getClassNameFromCSSClassSuggestionItem,
	getCssClassObjectFromClassName,
	isCustomClass,
} from '@toolwind/helpers/cssClasses'
import { CloseIcon } from '@toolwind/icons'
import { type CSSClassSuggestionItem } from '@toolwind/types/common'
import clsx from 'clsx'
import { type UseComboboxStateChange, useCombobox } from 'downshift'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePopper } from 'react-popper'
import { useMount, useUnmount } from 'react-use'
import { useRecoilState } from 'recoil'

interface ClassNameInputProps {
	onSave: (value: string) => void
	defaultValue?: CSSClassSuggestionItem | null
}

const ClassNameInput = ({
	defaultValue = null,
	onSave,
}: ClassNameInputProps) => {
	const [suggestedClasses, setSuggestedClasses] = useState<
		CSSClassSuggestionItem[]
	>([])

	const { getCssText, getSuggestionList } = useTailwindIntellisense()

	const [activeOption, setActiveClassOption] =
		useRecoilState(activeCssClassState)

	const referenceElement = useRef(null)
	const popperElement = useRef(null)

	const { styles, attributes, forceUpdate } = usePopper(
		referenceElement.current,
		popperElement.current,
		{
			placement: 'bottom-start',
			modifiers: [
				{
					name: 'preventOverflow',
					options: {
						rootBoundary: 'document',
					},
				},
				{
					name: 'offset',
					options: {
						offset: [0, 8],
					},
				},
			],
		}
	)

	const onSelectedItemChange = useCallback(
		({
			selectedItem = null,
		}: UseComboboxStateChange<CSSClassSuggestionItem>) => {
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
					setActiveClassOption(
						getCssClassObjectFromClassName(inputValue, cssText)
					)
				})
			}

			void getSuggestionList(inputValue).then((list) => {
				setSuggestedClasses(list)

				// void setActiveOptionHandler(list[0] ?? null)
			})
		},
		[
			getSuggestionList,
			getCssText,
			setActiveClassOption,
			// setActiveOptionHandler,
		]
	)

	const onActiveOptionChange = useCallback(
		({
			highlightedIndex = 0,
			isOpen = false,
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
		isOpen,
		setInputValue,
	} = useCombobox<CSSClassSuggestionItem>({
		items: suggestedClasses,
		itemToString: (item) => getClassNameFromCSSClassSuggestionItem(item!),
		// defaultHighlightedIndex: 0,
		onInputValueChange,
		onHighlightedIndexChange: onActiveOptionChange,
		onSelectedItemChange,
		defaultInputValue: defaultValue?.name,
		defaultSelectedItem: defaultValue,
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

	useEffect(() => {
		if (suggestedClasses.length > 0 && forceUpdate !== null) {
			forceUpdate()
		}
	}, [suggestedClasses, forceUpdate])

	return (
		<div className="relative">
			<div
				className="flex items-center border-b border-default py-1 px-2 h-7"
				ref={referenceElement}
			>
				<input
					{...getInputProps({
						onKeyUpCapture: onKeyUpHandler,
						onBlur: onCancelHandler,
						className:
							'm-0 text-sm bg-transparent focus:!outline-none text-default',
						placeholder: 'Enter class name',
						autoFocus: true,
					})}
				/>

				<button
					onClick={onCancelHandler}
					className=" text-default hover:text-red-500"
				>
					<CloseIcon size={10} />
				</button>
			</div>

			<ul
				style={{ ...styles.popper, zIndex: 10000 }}
				{...attributes.popper}
				{...getMenuProps({
					ref: popperElement,
					className: clsx(
						'flex flex-col mt-1.5 absolute z-[10000] top-full max-h-60 left-0 overflow-auto w-60 bg-light p-1.5',
						!isOpen && 'hidden'
					),
				})}
			>
				{suggestedClasses.length === 0 ? (
					<div className="p-3 text-center text-sm but you can still add it bg-light">
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
									highlightedIndex === index &&
										'text-primary font-semibold bg-default',
									// selectedItem === suggestedClass && "font-bold",
									'flex gap-2 items-baseline text-default text-sm border-b p-2 border-default'
								),
							})}
						>
							{suggestedClass.color === undefined ? (
								<span>{suggestedClass.isVariant === true ? `{}` : '☲'}</span>
							) : (
								<span
									className={clsx(
										'w-3 h-3 inline-block border',
										highlightedIndex === index
											? 'border-primary'
											: 'border-light'
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
