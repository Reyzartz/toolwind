export const getXPathFromElement = (
  element: HTMLElement
): string | undefined => {
  if (element.tagName == "HTML" || element.parentNode === null)
    return "/HTML[1]";
  if (element === document.body) return "/HTML[1]/BODY[1]";

  var ix = 0;
  var siblings = element.parentNode.childNodes as NodeListOf<HTMLElement>;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return (
        getXPathFromElement(element.parentNode as HTMLElement) +
        "/" +
        element.tagName +
        "[" +
        (ix + 1) +
        "]"
      );
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
};

export const getElementFromXPath = (xpath: string): HTMLElement | null => {
  return document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as HTMLElement | null;
};
