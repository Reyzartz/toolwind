import { useCallback, useLayoutEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeCssClassState, cssClassesState, selectedElementState } from '.'
import { CSSClass } from '../../../types/common'
import { getCssClassObjectFromClassName, isCustomClass } from '../utils'

export const useCSSClasses = () => {
	const [cssClasses, setCssClasses] = useRecoilState(cssClassesState)

	const activeCssClass = useRecoilValue(activeCssClassState)

	const selectedElement = useRecoilValue(selectedElementState)

	useLayoutEffect(() => {
		setClassNameToElement()
		console.log('useLayoutEffect', activeCssClass?.className)
	}, [activeCssClass, cssClasses])

	const setCssClassesHandler = useCallback((updatedCssClasses: CSSClass[]) => {
		setCssClasses(updatedCssClasses)
	}, [])

	const setClassNameToElement = useCallback(() => {
		if (selectedElement === null) return

		const classNames = cssClasses.map(({ className }) => className)

		if (activeCssClass !== null) {
			classNames.push(activeCssClass.className)
		}

		selectedElement.className = classNames.join(' ')
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
					className,
					customClass: isCustomClass(className)
				}
			})

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses]
	)

	const addCssClass = useCallback(
		(className: string) => {
			const newClassObject = getCssClassObjectFromClassName(className)

			console.log(newClassObject)

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
