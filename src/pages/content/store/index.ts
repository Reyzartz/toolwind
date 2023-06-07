import { atom, DefaultValue, selector } from 'recoil'
import { CSSClass, ModifiedElement } from '../../../types/common'
import { getClassNames, getClassObjects } from '../utils'

export const defaultCssClassesState = atom<string[]>({
	key: 'default-css-classes',
	default: []
})

export const cssClassesState = atom<CSSClass[]>({
	key: 'css-classes',
	default: []
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
	set: ({ set }, element = null) => {
		set(selectedElementAtomState, element)

		if (element !== null && !(element instanceof DefaultValue)) {
			set(cssClassesState, getClassObjects(element, false))
			set(defaultCssClassesState, getClassNames(element))
		}
	}
})

export const modifiedElementsState = atom<ModifiedElement[]>({
	key: 'modified-elements',
	default: []
})
