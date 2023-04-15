import { useCallback, useEffect, useRef, useState } from 'react'
import { useCSSClasses } from '../store/cssClassStore'
import './styles.css'
import { useRecoilValue } from 'recoil'
import { activeCssClassState } from '../store'

export const ContentStyles = () => {
	const { cssClasses } = useCSSClasses()
	const iframeRef = useRef<HTMLIFrameElement>(null)

	const [customClasses, setCustomClasses] = useState<string[]>([])
	const activeCssClass = useRecoilValue(activeCssClassState)
	const [cssText, setCssText] = useState('')

	console.log(customClasses, activeCssClass?.className)

	useEffect(() => {
		setCustomClasses((prev) => [
			...new Set([
				activeCssClass?.customClass ? activeCssClass.className : '',
				...prev,
				...cssClasses
					.filter(({ customClass }) => customClass)
					.map(({ className }) => className)
			])
		])
	}, [cssClasses, activeCssClass])

	useEffect(() => {
		const interval = setInterval(() => {
			const updatedCSSText = getCssText()

			setCssText((prev) => {
				console.log('l1')

				if (updatedCSSText.length !== prev.length || updatedCSSText !== prev) {
					console.log('l2')
					return updatedCSSText
				}

				return prev
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	const getCssText = useCallback(() => {
		let css = ''

		if (iframeRef.current?.contentWindow?.document.styleSheets[0] === undefined)
			return ''

		const cssRules =
			iframeRef.current.contentWindow?.document.styleSheets[0].cssRules

		for (let i = 0; i < cssRules.length; i++) {
			if (i > 37) {
				css += cssRules[i].cssText
			}
		}

		return css
	}, [])

	return (
		<div className=':uno: hidden'>
			<iframe
				ref={iframeRef}
				srcDoc={`
						<script src='https://cdn.tailwindcss.com/'></script>
						<div class='${customClasses.join(' ')}'></div>
					`}
			/>

			<style>{cssText}</style>
		</div>
	)
}

export {}
