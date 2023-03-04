import { runtime } from 'webextension-polyfill'
import { CSSClassObject, Message } from '../../types/common'

export function appendElementToHead (el: HTMLElement) {
  const head = document.querySelector('head') as HTMLHeadElement

  head.appendChild(el)
}

export function appendElementToBody (el: HTMLElement) {
  const body = document.querySelector('body') as HTMLBodyElement

  body.appendChild(el)
}

export function getClassNames (el: HTMLElement) {
  if (
    el === null ||
    typeof el.className !== 'string' ||
    el.className.trim().length === 0
  )
    return []

  const classNames = el.className.split(' ')

  return classNames.filter(
    name => !name.includes('toolwind') && name.trim().length > 0
  )
}

export function appendClassNames (el: HTMLElement, newClassNames: string[]) {
  const classNames = getClassNames(el)

  el.className = classNames.concat(newClassNames).join(' ')
}

export function removeClassNames (
  el: HTMLElement,
  classNames: string | string[]
): string[] {
  if (typeof el.className !== 'string') return []

  const elementClassNames = Array.isArray(classNames)
    ? getClassNames(el).filter(name => !classNames.includes(name))
    : getClassNames(el).filter(name => classNames !== name)

  el.className = elementClassNames.join(' ')

  return elementClassNames
}

export function updateClassName (
  el: HTMLElement,
  index: number,
  updatedClassName: string
): string[] {
  if (typeof el.className !== 'string') return []

  const updatedClassNames = getClassNames(el)

  updatedClassNames[index] = updatedClassName

  el.className = updatedClassNames.join(' ')

  return updatedClassNames
}

const twRegex =
  /^\.(-?)([a-z]+:)?([a-z]+)(-(([0-9]*[a-z]+)|([0-9]+((\.|\/)[0-9]+)?)))*$/

// this is later going to be change to accept only tailwind classes from the sites spreadsheets
export const isClassNameValid = (name: string) => {
  return twRegex.test('.' + name)
}

export const getCssClassObjectFromCssText = (cssText: string) => {
  let propertyText = cssText.slice(
    cssText.indexOf('{') + 1,
    cssText.indexOf('}')
  )

  propertyText = propertyText.slice(0, propertyText.lastIndexOf(';'))

  return propertyText.split(';').map(property => {
    const [key, value] = property.split(':')

    return {
      key: key.trim(),
      value: value.trim()
    }
  })
}

const classList = (() => {
  const results: CSSClassObject[] = []

  for (let i = 0; i < document.styleSheets.length; i++) {
    let styleSheet = document.styleSheets[i]

    try {
      for (let j = 0; j < styleSheet.cssRules.length; j++) {
        let rule = styleSheet.cssRules[j] as any
        if (rule.selectorText && twRegex.test(rule.selectorText)) {
          results.push({
            name: rule.selectorText.replace('.', ''),
            cssProperty: getCssClassObjectFromCssText(rule.cssText)
          })
        }
      }
    } catch (err) {}
  }

  return [...new Set(results)].sort()
})()

export const searchForCss = (searchTerm: string): CSSClassObject[] => {
  return classList.filter(({ name }) => name.includes(searchTerm))
}

export const onMessageListener = (
  actionType: Message['actionType'],
  callback: (action: Message['action']) => void
) => {
  runtime.onMessage.addListener((request: Message, _sender) => {
    if (request.actionType === actionType) {
      callback(request.action)
    }
  })
}
