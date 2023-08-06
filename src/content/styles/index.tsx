import { CSSClass } from "@toolwind/types/common";
import { memo, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useCSSClasses } from "../hooks/useCssClasses";
import { activeCssClassState } from "../store";

const TOOLWIND_STYLE_ELEMENT_ID = "toolwind-styles";

export const ContentStyles = memo(() => {
  const { cssClasses } = useCSSClasses();
  const activeCssClass = useRecoilValue(activeCssClassState);
  const [addedCssClasses, setAddedCssClasses] = useState<CSSClass[]>([]);

  useEffect(() => {
    let updatedAddedCssClasses: CSSClass[] = [
      ...new Map(
        addedCssClasses
          .concat(cssClasses)
          .filter((cssClass) => cssClass.cssText !== null)
          .map((cssClass) => [cssClass.className, cssClass])
      ).values(),
    ];

    setAddedCssClasses(updatedAddedCssClasses);

    const cssText = [...updatedAddedCssClasses, activeCssClass].reduce(
      (cssText, cssClass) => {
        return typeof cssClass?.cssText === "string"
          ? cssText + cssClass?.cssText
          : cssText;
      },
      ""
    );

    /**
     * Attaching newly added classes to the document
     */

    let toolwindStyleElement: HTMLStyleElement | null = document.querySelector(
      `#${TOOLWIND_STYLE_ELEMENT_ID}`
    );

    if (toolwindStyleElement) {
      toolwindStyleElement.innerText = cssText;
    } else {
      const toolwindStyleElement = document.createElement("style");
      toolwindStyleElement.id = TOOLWIND_STYLE_ELEMENT_ID;

      toolwindStyleElement.innerText = cssText;

      document.head.append(toolwindStyleElement);
    }

    return;
  }, [cssClasses, activeCssClass]);

  useEffect(
    // removing style when the app is removed
    () => () =>
      document.querySelector(`#${TOOLWIND_STYLE_ELEMENT_ID}`)?.remove(),
    []
  );

  return <div />;
});
