import { autocomplete } from "@toolwind/content/hooks/useTailwindIntellisense";
import { CSSClass, CSSClassSuggestionItem } from "@toolwind/types/common";

export function getClassNames(el: HTMLElement | null) {
  if (
    el === null ||
    typeof el.className !== "string" ||
    el.className.trim().length === 0
  )
    return [];

  const classNames = el.className.split(" ");

  return classNames.filter(
    (name) => !name.includes("toolwind") && name.trim().length > 0
  );
}

export const isCustomClass = (name: string) => {
  return name.indexOf("[") < name.indexOf("]");
};

export const getCssClassObjectFromClassName = (
  className: string,
  cssText: string | null = null,
  defaultClassName: string | null = null
): CSSClass => {
  return {
    id: crypto.randomUUID(),
    className,
    defaultClassName,
    state: "active",
    customClass: isCustomClass(className),
    cssText,
    meta: {
      color: autocomplete.getColor(className),
    },
  };
};

export const getClassObjects = (
  el: HTMLElement | null,
  isModifiedElement = true
): CSSClass[] => {
  const classNames = getClassNames(el);

  return classNames.map((className) =>
    getCssClassObjectFromClassName(
      className,
      null,
      isModifiedElement ? null : className
    )
  );
};

// this is later going to be change to accept only tailwind classes from the sites spreadsheets

export const getCssClassPropertiesFromCssText = (cssText: string) => {
  let propertyText = cssText.slice(
    cssText.indexOf("{") + 1,
    cssText.indexOf("}")
  );

  propertyText = propertyText.slice(0, propertyText.lastIndexOf(";"));

  return propertyText.split(";").map((property) => {
    const [key, value] = property.split(":");

    return {
      key: key.trim(),
      value: value.trim(),
    };
  });
};

export const getClassNameFromCSSClassSuggestionItem = (
  item: CSSClassSuggestionItem
) => {
  return [...item!.variants, item!.name].join(":");
};
