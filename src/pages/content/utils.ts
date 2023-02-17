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

export function removeCustomClassNames (el: HTMLElement) {
  if (typeof el.className !== 'string') return

  const classNames = getClassNames(el)

  el.className = classNames.join(' ')
}
