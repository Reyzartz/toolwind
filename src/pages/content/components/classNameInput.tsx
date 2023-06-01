import { Combobox } from '@headlessui/react'
import {
	ChangeEvent,
	Fragment,
	KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react'
import { useSetRecoilState } from 'recoil'
import { CSSClassObject, CSSProperty } from '../../../types/common'
import { activeCssClassState } from '../store'
import {
	getCssClassObjectFromClassName,
	getCssClassPropertiesFromCssText
} from '../utils'
import { useTailwindIntellisense } from '../store/useTailwindIntellisense'

interface CssPropertiesDisplayProps {
	className: string
	setActiveOption: (className: string) => void
}

const CssPropertiesDisplay = ({
	className,
	setActiveOption
}: CssPropertiesDisplayProps) => {
	const { getCssText } = useTailwindIntellisense()
	const [cssProperties, setCssProperties] = useState<CSSProperty[]>([])

	useEffect(() => {
		setActiveOption(className)
		getCssText(className).then((res) =>
			setCssProperties(getCssClassPropertiesFromCssText(res ?? ''))
		)
	}, [className])

	return (
		<div className=':uno: absolute left-45 top-full m-4 min-w-56 z-[10001] bg-indigo-900 text-indigo-400 text-xs border px-2 py-1 border-indigo-600 rounded-md'>
			<span className=':uno: text-orange-500'>.{className}</span>{' '}
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
	onChange: (value: string) => void
	onBlur: () => void
	classNames: CSSClassObject[]
	defaultValue?: CSSClassObject
}

const ClassNameInput = ({
	classNames,
	onChange,
	defaultValue,
	onBlur
}: ClassNameInputProps) => {
	const { getCssText } = useTailwindIntellisense()

	const setActiveClassOption = useSetRecoilState(activeCssClassState)

	const onTextInputChangeHandler = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			onChange(event.target.value)
		},
		[onChange]
	)

	const onChangeHandler = useCallback(
		({ name }: CSSClassObject) => {
			onChange(name)
		},
		[onChange]
	)

	useEffect(() => {
		if (classNames.length === 0) {
			setActiveClassOption(null)
		}
	}, [classNames.length, defaultValue])

	const setActiveOptionHandler = useCallback(async (name: string) => {
		const cssText = await getCssText(name)

		setActiveClassOption(getCssClassObjectFromClassName(name, cssText))
	}, [])

	const onBlurHandler = useCallback(() => {
		setActiveClassOption(null)

		onBlur()
	}, [onBlur])

	const onKeyupHandler = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.code === 'Enter') {
				onChange(e.currentTarget.value)
				setActiveClassOption(null)
				onBlur()
			}
		},
		[onBlur]
	)

	return (
		<Combobox
			as='div'
			className=':uno: relative'
			onChange={onChangeHandler}
			defaultValue={defaultValue}
		>
			{({ activeOption }) => (
				<>
					<Combobox.Input
						className=':uno: !mx-2 !my-1 text-inherit !bg-transparent !text-sm focus:!outline-none focus:!border-b border-indigo-600'
						onChange={onTextInputChangeHandler}
						displayValue={({ name }: CSSClassObject) => name}
						onKeyUpCapture={onKeyupHandler}
						//TODO: Fix this it's getting triggered before onClick and it closing the modal
						onBlur={onBlurHandler}
						autoFocus
					/>

					<span className=':uno: absolute top-1 left-2 text-sm text-inherit opacity-50'>
						{activeOption?.name}
					</span>

					{classNames.length > 0 && activeOption !== null && (
						<CssPropertiesDisplay
							className={activeOption.name}
							setActiveOption={setActiveOptionHandler}
						/>
					)}

					{classNames.length > 0 && (
						<Combobox.Options
							as='ul'
							className=':uno: flex flex-col mt-2 absolute z-[10000] top-full max-h-48 left-0 overflow-scroll w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2'
							static
						>
							{classNames.map((cssObject, ind) => (
								<Combobox.Option
									key={cssObject.name + ind}
									value={cssObject}
									as={Fragment}
								>
									{({ active }) => (
										<li
											className={`:uno: flex justify-between text-indigo-400 font-semibold text-sm border-b px-2 py-1 border-indigo-800 rounded-md ${
												active ? 'bg-indigo-800' : ''
											}`}
										>
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
