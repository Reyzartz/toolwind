import { getCssClassObjectFromClassName } from '@toolwind/helpers/cssClasses'
import { type CSSClass } from '@toolwind/types/common'
import { useCallback, useLayoutEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
	activeCssClassState,
	cssClassesState,
	isAddingClassState,
	isEditingClassState,
	selectedElementState
} from '../store'
import { useTailwindIntellisense } from './useTailwindIntellisense'

export const useCSSClasses = () => {
	const [cssClasses, setCssClasses] = useRecoilState(cssClassesState)
	const [isAdding, setIsAdding] = useRecoilState(isAddingClassState)
	const [isEditing, setIsEditing] = useRecoilState(isEditingClassState)

	const activeCssClass = useRecoilValue(activeCssClassState)

	const selectedElement = useRecoilValue(selectedElementState)

	const { getCssText } = useTailwindIntellisense()

	const setClassNameToElement = useCallback(() => {
		if (selectedElement === null) return

		const classNames = cssClasses
			.filter(({ state }) => state === 'active')
			.map(({ className }) => className)

		if (activeCssClass !== null) {
			classNames.push(activeCssClass.className)
		}

		selectedElement.setAttribute('class', classNames.join(' '))
	}, [cssClasses, activeCssClass, selectedElement])

	useLayoutEffect(() => {
		setClassNameToElement()
	}, [activeCssClass, cssClasses, setClassNameToElement])

	const setCssClassesHandler = useCallback(
		(updatedCssClasses: CSSClass[]) => {
			setCssClasses(updatedCssClasses)
		},
		[setCssClasses]
	)

	const removeCssClass = useCallback(
		(id: string) => {
			const updatedClassObjects = cssClasses.filter(
				(cssClass) => cssClass.id !== id
			)

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses, setCssClassesHandler]
	)

	const setIsAddingHandler = useCallback(
		(value: boolean) => {
			setIsAdding(value)

			if (value) {
				const updatedClassObjects = cssClasses.map((cssClass) => {
					return {
						...cssClass,
						state: cssClass.state === 'editing' ? 'active' : cssClass.state
					}
				})

				setCssClassesHandler(updatedClassObjects)
			}
		},
		[cssClasses, setCssClassesHandler, setIsAdding]
	)

	const updateCssClass = useCallback(
		async (id: string, updatedCssClass: Partial<CSSClass>) => {
			if (updatedCssClass.state === 'editing') {
				setIsAdding(false)
				setIsEditing(true)
			}

			const updatedClassObjects = await Promise.all(
				cssClasses.map(async (cssClass) => {
					if (id !== cssClass.id) {
						return updatedCssClass.state === 'editing' && cssClass.state === 'editing'
							? ({ ...cssClass, state: 'active' } satisfies CSSClass)
							: cssClass
					}

					if (updatedCssClass.className !== undefined) {
						const cssText = await getCssText(updatedCssClass.className)

						return {
							...getCssClassObjectFromClassName(
								updatedCssClass.className,
								cssText,
								cssClass.defaultClassName
							),
							...updatedCssClass
						}
					}

					return {
						...cssClass,
						...updatedCssClass
					}
				})
			)

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses, getCssText, setCssClassesHandler, setIsAdding, setIsEditing]
	)

	const addCssClass = useCallback(
		async (className: string) => {
			const cssText = await getCssText(className)

			const newClassObject = getCssClassObjectFromClassName(className, cssText)

			setCssClassesHandler([...cssClasses, newClassObject])
		},
		[cssClasses, getCssText, setCssClassesHandler]
	)

	return {
		isAdding,
		isEditing,
		setIsAdding: setIsAddingHandler,
		setIsEditing,
		cssClasses,
		removeCssClass,
		addCssClass,
		updateCssClass
	}
}
