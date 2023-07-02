import { useCallback, useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeCssClassState,
  cssClassesState,
  isAddingClassState,
  selectedElementState,
} from "../store";
import { CSSClass } from "../../../types/common";
import { getCssClassObjectFromClassName } from "../../../helpers/cssClasses";
import { useTailwindIntellisense } from "./useTailwindIntellisense";

export const useCSSClasses = () => {
  const [cssClasses, setCssClasses] = useRecoilState(cssClassesState);
  const [isAdding, setIsAdding] = useRecoilState(isAddingClassState);

  const activeCssClass = useRecoilValue(activeCssClassState);

  const selectedElement = useRecoilValue(selectedElementState);

  const { getCssText } = useTailwindIntellisense();

  useLayoutEffect(() => {
    setClassNameToElement();
  }, [activeCssClass, cssClasses]);

  const setCssClassesHandler = useCallback((updatedCssClasses: CSSClass[]) => {
    setCssClasses(updatedCssClasses);
  }, []);

  const setClassNameToElement = useCallback(() => {
    if (selectedElement === null) return;

    const classNames = cssClasses
      .filter(({ state }) => state === "active")
      .map(({ className }) => className);

    if (activeCssClass !== null) {
      classNames.push(activeCssClass.className);
    }

    selectedElement.className = classNames.join(" ");
  }, [cssClasses, activeCssClass, selectedElement]);

  const removeCssClass = useCallback(
    (id: string) => {
      const updatedClassObjects = cssClasses.filter(
        (cssClass) => cssClass.id !== id
      );

      setCssClassesHandler(updatedClassObjects);
    },
    [cssClasses]
  );

  const setIsAddingHandler = useCallback(
    (value: boolean) => {
      setIsAdding(value);

      if (value) {
        const updatedClassObjects = cssClasses.map((cssClass) => {
          return {
            ...cssClass,
            state: cssClass.state === "editing" ? "active" : cssClass.state,
          };
        });

        setCssClassesHandler(updatedClassObjects);
      }
    },
    [cssClasses]
  );

  const updateCssClass = useCallback(
    async (id: String, updatedCssClass: Partial<CSSClass>) => {
      if (updatedCssClass.state === "editing") {
        setIsAdding(false);
      }

      const updatedClassObjects = await Promise.all(
        cssClasses.map(async (cssClass) => {
          if (id !== cssClass.id) {
            return updatedCssClass.state === "editing" &&
              cssClass.state === "editing"
              ? ({ ...cssClass, state: "active" } as CSSClass)
              : cssClass;
          }

          if (updatedCssClass.className !== undefined) {
            const cssText = await getCssText(updatedCssClass.className);

            return {
              ...getCssClassObjectFromClassName(
                updatedCssClass.className,
                cssText,
                cssClass.defaultClassName
              ),
              ...updatedCssClass,
            };
          }

          return {
            ...cssClass,
            ...updatedCssClass,
          };
        })
      );

      setCssClassesHandler(updatedClassObjects);
    },
    [cssClasses]
  );

  const addCssClass = useCallback(
    async (className: string) => {
      const cssText = await getCssText(className);

      const newClassObject = getCssClassObjectFromClassName(className, cssText);

      setCssClassesHandler([...cssClasses, newClassObject]);
    },
    [cssClasses]
  );

  return {
    isAdding,
    setIsAdding: setIsAddingHandler,
    cssClasses,
    removeCssClass,
    addCssClass,
    updateCssClass,
  };
};
