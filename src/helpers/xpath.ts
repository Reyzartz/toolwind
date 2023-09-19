const getElementPrefix = (element: Element) => {
	return element.namespaceURI === 'http://www.w3.org/2000/svg' ? 'svg:' : ''
}

export const getXPathFromElement = (
	element: HTMLElement
): string | undefined => {
	if (element.tagName === 'HTML' || element.parentNode === null)
		return '/HTML[1]'
	if (element === document.body) return '/HTML[1]/BODY[1]'

	let ix = 0
	const siblings = element.parentNode.childNodes as NodeListOf<HTMLElement>
	for (let i = 0; i < siblings.length; i++) {
		const sibling = siblings[i]
		if (sibling === element)
			return `${
				getXPathFromElement(element.parentNode as HTMLElement) as string
			}/${`${getElementPrefix(element)}${element.tagName}`}[${ix + 1}]`
		if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++
	}
}

export const getElementFromXPath = (xpath: string): HTMLElement | null => {
	return document.evaluate(
		xpath,
		document,
		function (prefix) {
			if (prefix === 'svg') {
				return 'http://www.w3.org/2000/svg'
			} else {
				return null
			}
		},
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null
	).singleNodeValue as HTMLElement | null
}
