import { atom, DefaultValue, selector } from 'recoil'
import { CSSClass } from '../../../types/common'
import { getClassObjects } from '../utils'

export const classObjectsState = atom<CSSClass[]>({
	key: 'class-objects',
	default: []
})

export const activeClassObjectState = atom<CSSClass | null>({
	key: 'active-class-object',
	default: null
})

export const selectedElementAtomState = atom<HTMLElement | null>({
	key: 'selected-element-atom',
	default: null
})

export const selectedElementState = selector<HTMLElement | null>({
	key: 'selected-element',

	get: ({ get }) => get(selectedElementAtomState),
	set: ({ set }, element = null) => {
		set(selectedElementAtomState, element)

		if (element !== null && !(element instanceof DefaultValue)) {
			set(classObjectsState, getClassObjects(element))
		}
	}
})
