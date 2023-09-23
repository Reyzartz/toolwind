export const waitForElementToScrollIntoView = (
	element: Element,
	callback: () => void
) => {
	/**
	 * chromium does not currently support observing an svg element other thant the top-level .
	 * There is a chromium bug tracking this: https://bugs.chromium.org/p/chromium/issues/detail?id=963246
	 */

	if (element.matches('svg *')) {
		setTimeout(() => {
			callback()
		}, 500)
		return
	}

	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Element has scrolled into view

				setTimeout(() => {
					callback()
				}, 300)
				observer.disconnect() // Stop observing once callback is triggered
			}
		})
	})

	observer.observe(element)
}
