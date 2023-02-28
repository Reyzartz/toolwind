export interface CSSProperty {
  key: string
  value: string
}

export interface CSSClassObject {
  name: string
  cssProperty?: Array<CSSProperty>
}
