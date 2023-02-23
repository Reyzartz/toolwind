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

  return classNames.filter(name => !name.includes('toolwind'))
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

// this is later going to be change to accept only tailwind classes from the sites spreadsheets
export const isClassNameValid = (name: string) => {
  const regex = /^[\w-]+(:[\w-]+)?(-[\w-]+)?$/i

  return regex.test(name)
}

var searchForCss = function (className: string) {
  for (let i = 0; i < document.styleSheets.length; i++) {
    let styleSheet = document.styleSheets[i] as any
    try {
      for (let j = 0; j < styleSheet.cssRules.length; j++) {
        let rule = styleSheet.cssRules[j] as any
        // console.log(rule.selectorText)
        if (rule.selectorText && rule.selectorText.includes(className)) {
          console.log('found - ', rule.selectorText, ' ', i, '-', j)
        }
      }
      if (styleSheet.imports) {
        for (let k = 0; k < styleSheet.imports.length; k++) {
          let imp = styleSheet.imports[k]
          for (let l = 0; l < imp.cssRules.length; l++) {
            let rule = imp.cssRules[l]
            if (rule.selectorText && rule.selectorText.includes(className)) {
              console.log('found - ', rule.selectorText, ' ', i, '-', k, '-', l)
            }
          }
        }
      }
    } catch (err) {}
  }
}
