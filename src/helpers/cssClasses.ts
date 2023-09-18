import { autocomplete } from '@toolwind/content/hooks/useTailwindIntellisense'
import {
	type CSSClass,
	type CSSClassSuggestionItem
} from '@toolwind/types/common'

// Function to retrieve all CSS rules from a document

function getAllCSSRules(): Record<string, string> {
	console.log('Retrieved all CSS rules from a document')

	const allRules: Record<string, string> = {}

	// Loop through all style sheets in the document

	try {
		for (let i = 0; i < document.styleSheets.length; i++) {
			const styleSheet = document.styleSheets[i]

			if (styleSheet instanceof CSSStyleSheet) {
				for (let j = 0; j < styleSheet.cssRules.length; j++) {
					const cssRule = styleSheet.cssRules[j]

					if (cssRule instanceof CSSStyleRule) {
						const selectorText = cssRule.selectorText

						if (
							typeof selectorText === 'string' &&
							!selectorText.includes(' ') &&
							selectorText.startsWith('.')
						) {
							allRules[selectorText.replace(/(\\)|\./gm, '')] = cssRule.cssText
						}
					} else if (cssRule instanceof CSSMediaRule) {
						for (let k = 0; k < cssRule.cssRules.length; k++) {
							const innerRule = cssRule.cssRules[k]

							if (innerRule instanceof CSSStyleRule) {
								const innerSelectorText = innerRule.selectorText

								if (
									typeof innerSelectorText === 'string' &&
									!innerSelectorText.includes(' ') &&
									innerSelectorText.startsWith('.')
								) {
									allRules[innerSelectorText.replace(/(\\)|\./gm, '')] = `@media ${
										cssRule.conditionText
									} {${innerRule.cssText.replace(/(\\)|\./gm, '')}}`
								}
							}
						}
					}
				}
			}
		}
	} catch (e) {}

	return allRules
}

const allRules = getAllCSSRules()

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
			allRules[className] ?? null,
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
