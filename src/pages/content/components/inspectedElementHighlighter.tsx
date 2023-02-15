interface ElementOverlayProps {
  element: HTMLElement | null
  selected?: boolean
}

const InspectedElementHighlighter = ({
  element,
  selected = false
}: ElementOverlayProps): JSX.Element | null => {
  if (element === null) return null

  const rect = element?.getClientRects()[0]

  return (
    <>
      <div
        id='toolwind-highlight-bar'
        style={{
          position: 'fixed',
          top: rect.y,
          left: rect.x,
          width: rect.width,
          borderTop: '1px solid',
          borderColor: selected ? 'blue' : 'purple',
          zIndex: 10000
        }}
      />

      <div
        id='toolwind-highlight-bar'
        style={{
          position: 'fixed',
          top: rect.y + rect.height,
          left: rect.x,
          width: rect.width,
          borderBottom: '1px solid',
          borderColor: selected ? 'blue' : 'purple',
          zIndex: 10000
        }}
      />

      <div
        id='toolwind-highlight-bar'
        style={{
          position: 'fixed',
          top: rect.y,
          left: rect.x,
          height: rect.height,
          borderLeft: '1px solid',
          borderColor: selected ? 'blue' : 'purple',
          zIndex: 10000
        }}
      />

      <div
        id='toolwind-highlight-bar'
        style={{
          position: 'fixed',
          top: rect.y,
          left: rect.x + rect.width,
          height: rect.height,
          borderRight: '1px solid',
          borderColor: selected ? 'blue' : 'purple',
          zIndex: 10000
        }}
      />
    </>
  )
}

export { InspectedElementHighlighter }
