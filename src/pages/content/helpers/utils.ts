import { runtime } from 'webextension-polyfill'
import { CSSClass, Message } from '../../../types/common'
import { EXTENSION_ID } from '../../../constants'
import { autocomplete } from '../hooks/useTailwindIntellisense'

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
	if (
		el === null ||
		typeof el.className !== 'string' ||
		el.className.trim().length === 0
	)
		return []

	const classNames = el.className.split(' ')

	return classNames
		.filter((name) => !name.includes('toolwind') && name.trim().length > 0)
		.map((className) =>
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

export const onMessageListener = (
	messageType: Message['messageType'],
	callback: (message: Message['message']) => void
) => {
	runtime.onMessage.addListener((request: Message, _sender) => {
		if (request.messageType === messageType) {
			callback(request.message)
		}
	})
}

export const sendMessage = async ({ messageType, message }: Message) => {
	const response = await runtime.sendMessage(EXTENSION_ID, {
		messageType,
		message
	})

	return response
}

export const getXPathFromElement = (
	element: HTMLElement
): string | undefined => {
	if (element.tagName == 'HTML' || element.parentNode === null)
		return '/HTML[1]'
	if (element === document.body) return '/HTML[1]/BODY[1]'

	var ix = 0
	var siblings = element.parentNode.childNodes as NodeListOf<HTMLElement>
	for (var i = 0; i < siblings.length; i++) {
		var sibling = siblings[i]
		if (sibling === element)
			return (
				getXPathFromElement(element.parentNode as HTMLElement) +
				'/' +
				element.tagName +
				'[' +
				(ix + 1) +
				']'
			)
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++
	}
}

export const getElementFromXPath = (xpath: string): HTMLElement | null => {
	return document.evaluate(
		xpath,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue as HTMLElement | null
}
