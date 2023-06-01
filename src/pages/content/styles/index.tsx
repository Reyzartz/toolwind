import { useEffect, useRef, useState } from 'react'
import { useCSSClasses } from '../store/cssClassStore'
import './styles.css'
import { useRecoilValue } from 'recoil'
import { activeCssClassState } from '../store'

export const ContentStyles = () => {
	const { cssClasses } = useCSSClasses()
	const activeCssClass = useRecoilValue(activeCssClassState)
	const [cssText, setCssText] = useState('')

	useEffect(() => {
		setCssText(
			[activeCssClass, ...cssClasses].reduce((cssText, cssClass) => {
				return typeof cssClass?.cssText === 'string'
					? cssText + cssClass?.cssText
					: cssText
			}, '')
		)
	}, [cssClasses, activeCssClass])

	return <style>{cssText}</style>
}

export {}
