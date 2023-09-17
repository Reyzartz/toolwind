import { isCustomClass } from '@toolwind/helpers/cssClasses'
import { getItemFromStorage } from '@toolwind/helpers/storage'
import { type CSSClassSuggestionItem } from '@toolwind/types/common'
import { useCallback, useState } from 'react'
import { useMount } from 'react-use'
// @ts-expect-error it is broken Gomen'nasai
import AutoComplete from 'tailwindcss-autocomplete'

export let autocomplete: AutoComplete

export const useTailwindIntellisense = () => {
	const [config, setConfig] = useState({})

	useMount(() => {
		if (autocomplete === undefined) {
			void getItemFromStorage('tw_config').then((config) => {
				autocomplete = new AutoComplete(config ?? {})
			})
		}
	})

	const getSuggestionList = useCallback(
		async (className = ''): Promise<CSSClassSuggestionItem[]> => {
			if (isCustomClass(className)) return []

			const results = await autocomplete.getSuggestionList(className)
			const variants = className.split(':').slice(0, -1)

			return results.slice(0, 50).map((item: any) => {
				console.log('item', item)

				return {
					name: item.label as string,
					color:
						typeof item.documentation === 'string'
							? (item.documentation as string)
							: undefined,
					isVariant: item.data._type === 'variant',
					variants: item.data?.variants ?? variants
				}
			})
		},
		[]
	)

	const getCssText = useCallback(async (className: string): Promise<string> => {
		const result = await autocomplete.getClassCssText(className)

		return result
	}, [])

	const getClassColor = useCallback(async (className: string) => {
		const result = await autocomplete.getColor(className)

		return result
	}, [])

	const setConfigHandler = useCallback((config: Record<string, any>) => {
		setConfig(config)

		autocomplete = new AutoComplete(config)
	}, [])

	return {
		config,
		setConfig: setConfigHandler,
		getSuggestionList,
		getCssText,
		getClassColor
	}
}
