import { useCallback } from 'react'
import AutoComplete from 'tailwindcss-autocomplete'

export const autocomplete = new AutoComplete({})

console.count('inc')

export const useTailwindIntellisense = () => {
	const getSuggestionList = useCallback(async (className: string = '') => {
		const results = await autocomplete.getSuggestionList(className)

		return results.slice(0, 50).map((item) => {
			return {
				name: item.label as string,
				color:
					typeof item.documentation === 'string'
						? (item.documentation as string)
						: undefined,
				isVariant: item.data._type === 'variant'
			}
		})
	}, [])

	const getCssText = useCallback(async (className: string) => {
		const result = await autocomplete.getClassCssText(className)

		console.log('cssTextResult', result, 'className', className)

		return result
	}, [])

	const getClassColor = useCallback(async (className: string) => {
		const result = await autocomplete.getColor(className)

		return result
	}, [])

	return {
		getSuggestionList,
		getCssText,
		getClassColor
	}
}
