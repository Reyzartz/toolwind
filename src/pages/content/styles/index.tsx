import { useEffect, useRef, useState } from 'react'
import { useCSSClasses } from '../store/cssClassStore'
import './styles.css'
import { useRecoilValue } from 'recoil'
import { activeCssClassState } from '../store'
import { CSSClass } from '../../../types/common'

export const ContentStyles = () => {
	const { cssClasses } = useCSSClasses()
	const activeCssClass = useRecoilValue(activeCssClassState)
	const [addedCssClasses, serAddedCssClasses] = useState<CSSClass[]>([])
	const [cssText, setCssText] = useState('')

	useEffect(() => {
		serAddedCssClasses((prev) => [
			...new Map(
				prev
					.concat(cssClasses)
					.filter((cssClass) => cssClass.cssText !== null)
					.map((cssClass) => [cssClass.className, cssClass])
			).values()
		])
	}, [cssClasses])

	useEffect(() => {
		setCssText(
			[...addedCssClasses, activeCssClass].reduce((cssText, cssClass) => {
				return typeof cssClass?.cssText === 'string'
					? cssText + cssClass?.cssText
					: cssText
			}, '')
		)
	}, [addedCssClasses, activeCssClass])

	return <style>{cssText}</style>
}

export {}
