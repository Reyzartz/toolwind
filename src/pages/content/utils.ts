import { runtime } from 'webextension-polyfill'
import { CSSClass, CSSClassObject, Message } from '../../types/common'

export function getClassNames(el: HTMLElement) {
	if (
		el === null ||
		typeof el.className !== 'string' ||
		el.className.trim().length === 0
	)
		return []

	const classNames = el.className.split(' ')

	return classNames.filter(
		(name) => !name.includes('toolwind') && name.trim().length > 0
	)
}

export const getClassObjectFromClassName = (className: string): CSSClass => {
	return {
		id: crypto.randomUUID(),
		displayName: className,
		className: className.includes(':') ? className.split(':')[1] : className,
		defaultClassName: className,
		pseudoClassName: className.includes(':')
			? className.split(':')[1]
			: undefined,
		isColorProperty: false
	}
}

export const getClassObjects = (el: HTMLElement | null): CSSClass[] => {
	if (
		el === null ||
		typeof el.className !== 'string' ||
		el.className.trim().length === 0
	)
		return []

	const classNames = el.className.split(' ')

	return classNames
		.filter((name) => !name.includes('toolwind') && name.trim().length > 0)
		.map((className) => getClassObjectFromClassName(className))
}

const twRegex =
	/^\.(-?)([a-z]+:)?([a-z]+)(-(([0-9]*[a-z]+)|([0-9]+((\.|\/)[0-9]+)?)))*$/

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

const classList = (() => {
	const results: CSSClassObject[] = []

	for (let i = 0; i < document.styleSheets.length; i++) {
		let styleSheet = document.styleSheets[i]

		try {
			for (let j = 0; j < styleSheet.cssRules.length; j++) {
				let rule = styleSheet.cssRules[j] as any
				if (rule.selectorText && twRegex.test(rule.selectorText)) {
					results.push({
						name: rule.selectorText.replace('.', ''),
						cssProperty: getCssClassPropertiesFromCssText(rule.cssText)
					})
				}
			}
		} catch (err) {}
	}

	return [...new Set(results)].sort()
})()

export const searchForCss = (searchTerm: string): CSSClassObject[] => {
	return searchTerm.length > 1
		? classList.filter(({ name }) => name.startsWith(searchTerm))
		: []
}

export const onMessageListener = (
	actionType: Message['actionType'],
	callback: (action: Message['action']) => void
) => {
	runtime.onMessage.addListener((request: Message, _sender) => {
		if (request.actionType === actionType) {
			callback(request.action)
		}
	})
}
