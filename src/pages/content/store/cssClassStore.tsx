import { useCallback, useLayoutEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { activeCssClassState, cssClassesState, selectedElementState } from '.'
import { CSSClass } from '../../../types/common'
import { getCssClassObjectFromClassName } from '../utils'
import { useTailwindIntellisense } from './useTailwindIntellisense'

export const useCSSClasses = () => {
	const [cssClasses, setCssClasses] = useRecoilState(cssClassesState)

	const activeCssClass = useRecoilValue(activeCssClassState)

	const selectedElement = useRecoilValue(selectedElementState)

	const { getCssText, getClassColor } = useTailwindIntellisense()

	useLayoutEffect(() => {
		setClassNameToElement()
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
		async (id: String, className: string) => {
			const cssText = await getCssText(className)

			const updatedClassObjects = cssClasses.map((cssClass) => {
				if (id !== cssClass.id) return cssClass

				return getCssClassObjectFromClassName(className, cssText)
			})

			setCssClassesHandler(updatedClassObjects)
		},
		[cssClasses]
	)

	const addCssClass = useCallback(
		async (className: string) => {
			const cssText = await getCssText(className)

			const newClassObject = getCssClassObjectFromClassName(className, cssText)

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
