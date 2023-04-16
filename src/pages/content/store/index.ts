import { atom, DefaultValue, selector } from 'recoil'
import { CSSClass } from '../../../types/common'
import { getClassObjects } from '../utils'

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
			set(cssClassesState, getClassObjects(element))
		}
	}
})
