import { atom, DefaultValue, selector } from 'recoil'
import { CSSClass, ModifiedElement } from '../../../types/common'
import {
	getClassNames,
	getClassObjects,
	getXPathFromElement,
	sendMessage
} from '../helpers/utils'

export const defaultCssClassesState = atom<string[]>({
	key: 'default-css-classes',
	default: []
})

export const cssClassesState = atom<CSSClass[]>({
	key: 'css-classes',
	default: []
})

export const isAddingClassState = atom<boolean>({
	key: 'is-adding-class',
	default: false
})

export const activeCssClassState = atom<CSSClass | null>({
	key: 'active-css-class',
	default: null
})

export const selectedElementAtomState = atom<HTMLElement | null>({
	key: 'selected-element-atom',
	default: null
})

export const inspectedElementState = atom<HTMLElement | null>({
	key: 'inspected-element-atom',
	default: null
})

export const selectedElementState = selector<HTMLElement | null>({
	key: 'selected-element',

	get: ({ get }) => get(selectedElementAtomState),
	set: ({ set, get }, element = null) => {
		// added the previous selected element to modifiedList

		const prevSelectedElement = get(selectedElementAtomState)

		if (prevSelectedElement !== null) {
			const xpath = getXPathFromElement(prevSelectedElement) as string

			const updatedClassNames = get(cssClassesState).map(
				(cssClass) => cssClass.className
			)

			const originalClassNames = get(defaultCssClassesState)

			if (
				JSON.stringify(updatedClassNames) !== JSON.stringify(originalClassNames)
			) {
				const modifiedElementsList = get(modifiedElementsState)

				const updatedList: ModifiedElement[] = [
					{
						xpath,
						updatedClassNames,
						originalClassNames,
						tagName: prevSelectedElement.tagName
					},
					...modifiedElementsList.filter((item) => item.xpath !== xpath)
				]

				set(modifiedElementsState, updatedList)

				sendMessage({
					messageType: 'MODIFIED_ELEMENTS_UPDATED',
					message: updatedList
				})
			}
		}

		if (element !== null && !(element instanceof DefaultValue)) {
			// setting the css classes and default css classes
			set(cssClassesState, getClassObjects(element, false))

			set(defaultCssClassesState, getClassNames(element))
		}

		// setting the selected element atom state
		set(selectedElementAtomState, element)
	}
})

export const modifiedElementsState = atom<ModifiedElement[]>({
	key: 'modified-elements',
	default: []
})
