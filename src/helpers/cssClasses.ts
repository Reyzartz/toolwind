import { autocomplete } from '@toolwind/content/hooks/useTailwindIntellisense'
import {
	type CSSClass,
	type CSSClassSuggestionItem
} from '@toolwind/types/common'

// Function to retrieve all CSS rules from a document
// function getAllCSSRules() {
// 	console.log('Retrieved all CSS rules from a document')

// 	const allRules: Record<string, string> = {}

// 	// Loop through all style sheets in the document
// 	for (let i = 0; i < document.styleSheets.length; i++) {
// 		const styleSheet = document.styleSheets[i]

// 		if (styleSheet.cssRules !== undefined || styleSheet.cssRules !== null) {
// 			for (let j = 0; j < styleSheet.cssRules.length; j++) {
// 				if (
// 					(styleSheet.cssRules[j] as any).selectorText !== undefined &&
// 					!((styleSheet.cssRules[j] as any).selectorText as string).includes(
// 						' '
// 					) &&
// 					((styleSheet.cssRules[j] as any).selectorText as string).startsWith(
// 						'.'
// 					)
// 				)
// 					allRules[(styleSheet.cssRules[j] as any).selectorText] =
// 						styleSheet.cssRules[j].cssText

// 				if ((styleSheet.cssRules[j] as any).type === 4) {
// 					console.log(styleSheet.cssRules[j].conditionText)
// 					for (
// 						let k = 0;
// 						k < (styleSheet.cssRules[j] as any).cssRules.length;
// 						k++
// 					) {
// 						if (
// 							(styleSheet.cssRules[j] as any).cssRules[k].selectorText !==
// 								undefined &&
// 							!(
// 								(styleSheet.cssRules[j] as any).cssRules[k]
// 									.selectorText as string
// 							).includes(' ') &&
// 							(
// 								(styleSheet.cssRules[j] as any).cssRules[k]
// 									.selectorText as string
// 							).startsWith('.')
// 						)
// 							allRules[
// 								(styleSheet.cssRules[j] as any).cssRules[
// 									k
// 								].selectorText.replaceAll(/(\\)|\./gm, '')
// 							] = `@media ${styleSheet.cssRules[j].conditionText} {${
// 								(styleSheet.cssRules[j] as any).cssRules[k].cssText
// 							}}`
// 					}
// 				}
// 			}
// 		}
// 	}

// 	return allRules
// }

// const allRules = getAllCSSRules()

// console.log(allRules)

export function getClassNames(el: HTMLElement | null) {
	if (el === null) return []

	const classNames = el.classList.value.split(' ')

	return classNames.filter(
		(name) => !name.includes('toolwind') && name.trim().length > 0
	)
}

export const isCustomClass = (name: string) => {
	return name.indexOf('[') < name.indexOf(']')
}

export const getCssClassObjectFromClassName = (
	className: string,
	cssText: string | null = null,
	defaultClassName: string | null = null
): CSSClass => {
	return {
		id: crypto.randomUUID(),
		className,
		defaultClassName,
		state: 'active',
		customClass: isCustomClass(className),
		cssText,
		meta: {
			color: autocomplete.getColor(className)
		}
	}
}

export const getClassObjects = (
	el: HTMLElement | null,
	isModifiedElement = true
): CSSClass[] => {
	const classNames = getClassNames(el)

	return classNames.map((className) =>
		getCssClassObjectFromClassName(
			className,
			null,
			isModifiedElement ? null : className
		)
	)
}

// this is later going to be change to accept only tailwind classes from the sites spreadsheets

export const getCssClassPropertiesFromCssText = (cssText: string) => {
	let propertyText = cssText.slice(
		cssText.indexOf('{') + 1,
		cssText.indexOf('}')
	)

	propertyText = propertyText.slice(0, propertyText.lastIndexOf(';'))

	return propertyText.split(';').map((property) => {
		const [key, value] = property.split(':')

		return {
			key: key.trim(),
			value: value.trim()
		}
	})
}

export const getClassNameFromCSSClassSuggestionItem = (
	item: CSSClassSuggestionItem
) => {
	return [...item.variants, `${item.important ? '!' : ''}${item.name}`].join(':')
}
