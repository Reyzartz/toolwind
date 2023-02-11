function appendElementToHead (el) {
  document.querySelector('head').appendChild(el)
}

function appendElementToBody (el) {
  document.querySelector('body').appendChild(el)
}

function getClassNames (el) {
  if (el === null || typeof el.className !== 'string') return ''

  const classNames = el.className.split(' ')

  return classNames.filter(name => !name.includes('toolwind'))
}

function appendClassNames (el, newClassNames) {
  const classNames = getClassNames(el)

  el.className = classNames.concat(newClassNames).join(' ')
}

function removeCustomClassNames (el) {
  if (el === null || typeof el.className !== 'string') return

  const classNames = getClassNames(el)

  el.className = classNames.join(' ')
}
