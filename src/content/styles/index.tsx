import { type CSSClass } from '@toolwind/types/common'
import { memo, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { useCSSClasses } from '../hooks/useCssClasses'
import { activeCssClassState } from '../store'
import { useUnmount } from 'react-use'

const TOOLWIND_STYLE_ELEMENT_ID = 'toolwind-styles'

export const ContentStyles = memo(() => {
	const { cssClasses } = useCSSClasses()
	const activeCssClass = useRecoilValue(activeCssClassState)
	const [addedCssClasses, setAddedCssClasses] = useState<CSSClass[]>([])

	useEffect(() => {
		setAddedCssClasses((prev) => [
			...new Map(
				prev
					.concat(cssClasses)
					.filter(
						(cssClass) =>
							cssClass.cssText !== null &&
							cssClass.className !== cssClass.defaultClassName
					)
					.map((cssClass) => [cssClass.className, cssClass])
			).values()
		])
	}, [cssClasses])

	useEffect(() => {
		const cssText = [...addedCssClasses, activeCssClass].reduce(
			(cssText, cssClass) => {
				return typeof cssClass?.cssText === 'string'
					? cssText + cssClass?.cssText
					: cssText
			},
			''
		)

		/**
		 * Attaching newly added classes to the document
		 */

		const toolwindStyleElement: HTMLStyleElement | null = document.querySelector(
			`#${TOOLWIND_STYLE_ELEMENT_ID}`
		)

		if (toolwindStyleElement != null) {
			toolwindStyleElement.innerText = cssText
		} else {
			const toolwindStyleElement = document.createElement('style')
			toolwindStyleElement.id = TOOLWIND_STYLE_ELEMENT_ID

			toolwindStyleElement.innerText = cssText

			document.head.append(toolwindStyleElement)
		}
	}, [cssClasses, activeCssClass, addedCssClasses])

	useUnmount(
		// removing style when the app is removed
		() => document.querySelector(`#${TOOLWIND_STYLE_ELEMENT_ID}`)?.remove()
	)

	return <div />
})

ContentStyles.displayName = 'ContentStyles'
