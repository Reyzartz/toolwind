import { runtime } from 'webextension-polyfill'
import { CSSClass, Message } from '../../types/common'

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

export const isCustomClass = (name: string) => {
	return name.indexOf('[') < name.indexOf(']') || name.includes(':')
}

export const getCssClassObjectFromClassName = (
	className: string,
	cssText: string | null = null
): CSSClass => {
	return {
		id: crypto.randomUUID(),
		className,
		defaultClassName: className,
		customClass: isCustomClass(className),
		cssText,
		meta: {}
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
		.map((className) => getCssClassObjectFromClassName(className))
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
