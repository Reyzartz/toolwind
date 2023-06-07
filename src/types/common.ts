export interface CSSClass {
	id: string
	className: string
	customClass: boolean
	defaultClassName: string | null
	cssText: string | null
	meta: {
		color: string | null
		variants?: string[]
	}
}

export interface CSSProperty {
	key: string
	value: string
}

export interface CSSClassObject {
	name: string
	color?: string
	isVariant?: boolean
	variants: string[]
}

export interface ModifiedElement {
	xpath: string
	originalClassNames: string[]
	updatedClassNames: string[]
	tagName: string
}

export interface ExtensionStateMessageAction {
	state: 'enabled' | 'disabled'
}

export type TMessageType =
	| 'EXTENSION_STATE'
	| 'MODIFIED_ELEMENTS_UPDATED'
	| 'DELETE_MODIFIED_ELEMENT'
	| 'FETCH_MODIFIED_ELEMENTS'
	| 'HOVER_ELEMENT'
	| 'SELECT_ELEMENT'

export interface Message {
	messageType: TMessageType
	message: any
}

export type TStorageItemKeys = 'toolwind_extension_state'
