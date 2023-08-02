export interface CSSClass {
  id: string;
  className: string;
  customClass: boolean;
  defaultClassName: string | null;
  cssText: string | null;
  state: "active" | "removed" | "editing";
  meta: {
    color: string | null;
    variants?: string[];
  };
}

export interface CSSProperty {
  key: string;
  value: string;
}

export interface CSSClassObject {
  name: string;
  color?: string;
  isVariant?: boolean;
  variants: string[];
}

export interface ModifiedElement {
  xpath: string;
  originalClassNames: string[];
  updatedClassNames: string[];
  tagName: string;
}

export interface ExtensionStateMessageAction {
  state: "enabled" | "disabled";
}

export interface IToggleToolwindMessage {
  to: "content_script";
  action: {
    type: "TOGGLE_TOOLWIND";
    data: boolean;
  };
}

export interface ISelectElementMessage {
  to: "content_script";
  action: {
    type: "SELECT_ELEMENT";
    data: { xpath: null | string };
  };
}

export interface IHoverElementMessage {
  to: "content_script";
  action: {
    type: "HOVER_ELEMENT";
    data: { xpath: null | string };
  };
}

export interface IModifiedElementUpdatedMessage {
  to: "service_worker";
  action: {
    type: "MODIFIED_ELEMENTS_UPDATED";
    data: ModifiedElement[];
  };
}

export interface IDeleteModifiedElementMessage {
  to: "content_script";
  action: {
    type: "DELETE_MODIFIED_ELEMENT";
    data: ModifiedElement;
  };
}

export interface IFetchModifiedElementMessage {
  to: "content_script";
  action: {
    type: "FETCH_MODIFIED_ELEMENTS";
  };
}

export interface IUpdateConfigMessage {
  to: "content_script";
  action: {
    type: "UPDATE_CONFIG";
    data: { config: Record<string, any> };
  };
}

export type TMessage =
  | IToggleToolwindMessage
  | ISelectElementMessage
  | IHoverElementMessage
  | IModifiedElementUpdatedMessage
  | IDeleteModifiedElementMessage
  | IFetchModifiedElementMessage
  | IUpdateConfigMessage;

export type TStorageItemKeys = "toolwind_enabled" | "tw_config";
