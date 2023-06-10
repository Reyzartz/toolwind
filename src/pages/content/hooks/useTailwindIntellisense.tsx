import { useCallback } from 'react'
import AutoComplete from 'tailwindcss-autocomplete'
import { isCustomClass } from '../helpers/utils'

export const autocomplete = new AutoComplete({})

export const useTailwindIntellisense = () => {
	const getSuggestionList = useCallback(async (className: string = '') => {
		if (isCustomClass(className)) return []

		const results = await autocomplete.getSuggestionList(className)

		return results.slice(0, 50).map((item) => {
			return {
				name: item.label as string,
				color:
					typeof item.documentation === 'string'
						? (item.documentation as string)
						: undefined,
				isVariant: item.data._type === 'variant',
				variants: item.data?.variants ?? []
			}
		})
	}, [])

	const getCssText = useCallback(async (className: string) => {
		const result = await autocomplete.getClassCssText(className)

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
