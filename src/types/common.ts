export interface CSSClass {
	id: string
	className: string
	customClass: boolean
	defaultClassName: string
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

export interface ExtensionStateMessageAction {
	state: 'enabled' | 'disabled'
}

export type TActionType = 'EXTENSION_STATE'

export interface Message {
	actionType: TActionType
	action: ExtensionStateMessageAction
}

export type TStorageItemKeys = 'toolwind_extension_state'
