export interface CSSClass {
	id: string
	displayName: string
	className: string
	defaultClassName: string
	pseudoClassName?: string
	cssProperties?: CSSProperty[]
	isColorProperty: boolean
}

export interface CSSProperty {
	key: string
	value: string
}

export interface CSSClassObject {
	name: string
	cssProperty?: Array<CSSProperty>
}

export interface ExtensionStateMessageAction {
	state: 'enabled' | 'disabled'
}

export type TActionType = 'EXTENSION_STATE'

export interface Message {
	actionType: TActionType
	action: ExtensionStateMessageAction
}

export type TStorageItemKeys = 'toolwind_extension_state'
