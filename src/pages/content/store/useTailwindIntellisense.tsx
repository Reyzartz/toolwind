import { useCallback, useMemo, useState } from 'react'
import AutoComplete from 'tailwindcss-autocomplete'
import { getCssClassPropertiesFromCssText } from '../utils'

const autocomplete = new AutoComplete({})

export const useTailwindIntellisense = () => {
	const getSuggestionList = useCallback(async (className: string = '') => {
		const results = await autocomplete.getSuggestionList(className)

		return results.slice(0, 100).map(({ label }: { label: string }) => ({
			name: label,
			cssProperty: []
		}))
	}, [])

	const getCssText = useCallback(async (className: string) => {
		const result = await autocomplete.getClassCssText(className)

		console.log('cssTextResult', result, 'className', className)

		return result
	}, [])

	return {
		getSuggestionList,
		getCssText
	}
}
