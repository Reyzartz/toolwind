import { Combobox } from '@headlessui/react'
import {
	ChangeEvent,
	Fragment,
	KeyboardEvent,
	MouseEventHandler,
	useCallback,
	useEffect,
	useState
} from 'react'
import { useRecoilState } from 'recoil'
import { CSSClassObject, CSSProperty } from '../../../types/common'
import { activeCssClassState } from '../store'
import {
	getCssClassObjectFromClassName,
	getCssClassPropertiesFromCssText
} from '../helpers/utils'
import { useTailwindIntellisense } from '../hooks/useTailwindIntellisense'

interface CssPropertiesDisplayProps {
	option: CSSClassObject
	setActiveOption: (cssClass: CSSClassObject) => void
}

const CssPropertiesDisplay = ({
	option,
	setActiveOption
}: CssPropertiesDisplayProps) => {
	const { getCssText } = useTailwindIntellisense()
	const [cssProperties, setCssProperties] = useState<CSSProperty[]>([])

	useEffect(() => {
		setActiveOption(option)

		if (!option.isVariant) {
			getCssText(option.name).then((res) =>
				setCssProperties(getCssClassPropertiesFromCssText(res ?? ''))
			)
		}
	}, [option])

	if (option.isVariant) return null

	return (
		<div className=':uno: absolute left-45 top-full m-4 min-w-48 z-[10001] bg-indigo-900 text-indigo-400 text-xs border px-2 py-1 border-indigo-600 rounded-md'>
			<span className=':uno: text-orange-500'>.{option.name}</span>{' '}
			<span className=':uno: text-purple-500'>&#123;</span>
			<div>
				{cssProperties.map(({ key, value }) => (
					<div key={key}>
						<span>{key}</span>:{' '}
						<span className=':uno: text-red-500'>{value}</span>
					</div>
				))}
			</div>
			<span className=':uno: text-purple-500'>&#125;</span>
		</div>
	)
}

interface ClassNameInputProps {
	onSave: (value: string) => void
	defaultValue?: CSSClassObject | null
}

const ClassNameInput = ({
	defaultValue = null,
	onSave
}: ClassNameInputProps) => {
	const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])
	const [query, setQuery] = useState('')

	const { getCssText, getSuggestionList } = useTailwindIntellisense()

	const [activeOption, setActiveClassOption] =
		useRecoilState(activeCssClassState)

	const onTextInputChangeHandler = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			setQuery(value)

			getSuggestionList(value).then((list) => {
				setSuggestedClasses(list)
			})
		},
		[getSuggestionList]
	)

	const onClickHandler = useCallback(
		({ name, variants }: CSSClassObject) => {
			// triggered if the active option is an variant
			if (activeOption !== null && activeOption.className.endsWith(':')) {
				setQuery(activeOption.className)

				return
			}

			onSave([...variants, name].join(':'))
		},
		[onSave, activeOption]
	)

	useEffect(() => {
		const defaultValueName = defaultValue?.name ?? ''

		getSuggestionList(defaultValueName).then((list) => {
			setSuggestedClasses(list)

			setActiveClassOption(null)
		})

		setQuery(defaultValueName)

		return () => setActiveClassOption(null)
	}, [getSuggestionList])

	const setActiveOptionHandler = useCallback(
		async (cssClass: CSSClassObject) => {
			const className =
				cssClass.variants.length > 0
					? `${cssClass.variants.join(':')}:${cssClass.name}`
					: cssClass.name

			const cssText = await getCssText(className)

			setActiveClassOption(getCssClassObjectFromClassName(className, cssText))
		},
		[]
	)

	const onKeyupHandler = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Enter') {
				// triggered if the active option is an variant
				if (activeOption !== null && activeOption.className.endsWith(':')) {
					setQuery(activeOption.className)

					return
				}

				if (activeOption !== null) {
					onSave(activeOption.className)
				}

				setActiveClassOption(null)
			} else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
				setQuery(activeOption?.className ?? '')
			}
		},
		[onSave, activeOption]
	)

	const onCancelHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()

			setActiveClassOption(null)
			onSave(defaultValue?.name ?? '')
		},
		[onSave]
	)

	return (
		<Combobox as='div' className=':uno: relative' defaultValue={defaultValue}>
			{({ activeOption }) => (
				<>
					<div className=':uno: flex items-center border-b border-indigo-600 my-1 mx-2'>
						<Combobox.Input
							className=':uno: !m-0 text-inherit !bg-transparent !text-sm focus:!outline-none '
							onChange={onTextInputChangeHandler}
							value={query}
							displayValue={({ name }: CSSClassObject) => name}
							onKeyUpCapture={onKeyupHandler}
							autoFocus
						/>

						<button
							onClick={onCancelHandler}
							className=':uno: pr-1.5 z-0 font-bold leading-4 bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500 text-xl'
						>
							⤫
						</button>
					</div>

					{suggestedClasses.length > 0 && activeOption !== null && (
						<CssPropertiesDisplay
							option={activeOption}
							setActiveOption={setActiveOptionHandler}
						/>
					)}

					{suggestedClasses.length > 0 && (
						<Combobox.Options
							as='ul'
							className=':uno: flex flex-col mt-1.5 absolute z-[10000] top-full max-h-48 left-0 overflow-scroll w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2'
							static
						>
							{suggestedClasses.map((cssObject, ind) => (
								<Combobox.Option
									key={cssObject.name + ind}
									value={cssObject}
									as={Fragment}
								>
									{({ active }) => (
										<li
											className={`:uno: flex gap-2 items-baseline text-indigo-400 font-semibold text-sm border-b px-2 py-1 border-indigo-800 rounded-md ${
												active ? 'bg-indigo-800' : ''
											}`}
											onClick={(e) => {
												e.stopPropagation()
												onClickHandler(cssObject)
											}}
										>
											{cssObject.color === undefined ? (
												<span className=':uno: font-semibold text-orange-400'>
													{cssObject.isVariant ? `{}` : '☲'}
												</span>
											) : (
												<span
													className=':uno: w-3 h-3 inline-block border border-gray-900 rounded-1'
													style={{ background: cssObject.color }}
												/>
											)}

											{cssObject.name}
										</li>
									)}
								</Combobox.Option>
							))}
						</Combobox.Options>
					)}
				</>
			)}
		</Combobox>
	)
}

export { ClassNameInput }
