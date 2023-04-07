import { useCallback, useLayoutEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeCssClassState, cssClassesState, selectedElementState } from '.'
import { CSSClass } from '../../../types/common'
import { getCssClassObjectFromClassName } from '../utils'

export const useCSSClasses = () => {
	const [cssClasses, setCssClasses] = useRecoilState(cssClassesState)

	const activeCssClass = useRecoilValue(activeCssClassState)

	const selectedElement = useRecoilValue(selectedElementState)

	useLayoutEffect(() => {
		setClassNameToElement()
	}, [activeCssClass])

	const setCssClassesHandler = useCallback((updatedCssClasses: CSSClass[]) => {
		setCssClasses(updatedCssClasses)
	}, [])

	const setClassNameToElement = useCallback(() => {
		if (activeCssClass !== null) [...cssClasses, activeCssClass]

		if (selectedElement === null) return

		selectedElement.className = cssClasses
			.map(({ displayName }) => displayName)
			.join(' ')
	}, [cssClasses, activeCssClass, selectedElement])

	const removeCssClass = useCallback(
		(id: string) => {
			const updatedClassObjects = cssClasses.filter(
				(cssClass) => cssClass.id !== id
			)

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses]
	)

	const updateCssClass = useCallback(
		(id: String, className: string) => {
			const updatedClassObjects = cssClasses.map((cssClass) => {
				if (id !== cssClass.id) return cssClass

				return {
					...cssClass,
					displayName:
						cssClass.pseudoClassName !== undefined
							? `${cssClass.pseudoClassName}:${className}`
							: className,
					className
				}
			})

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses]
	)

	const addCssClass = useCallback(
		(className: string) => {
			const newClassObject = getCssClassObjectFromClassName(className)

			setCssClassesHandler([...cssClasses, newClassObject])
		},
		[cssClasses]
	)

	return {
		cssClasses,
		removeCssClass,
		addCssClass,
		updateCssClass
	}
}
