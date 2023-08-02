import { useEffect, useRef, useState } from "react";
import { useCSSClasses } from "../hooks/useCssClasses";
import { useRecoilValue } from "recoil";
import { activeCssClassState } from "../store";
import { CSSClass } from "../../../types/common";
import defaultStyles from "../../../../index.css?inline";

export const ContentStyles = () => {
  const { cssClasses } = useCSSClasses();
  const activeCssClass = useRecoilValue(activeCssClassState);
  const [addedCssClasses, serAddedCssClasses] = useState<CSSClass[]>([]);
  const [cssText, setCssText] = useState("");

  useEffect(() => {
    serAddedCssClasses((prev) => [
      ...new Map(
        prev
          .concat(cssClasses)
          .filter((cssClass) => cssClass.cssText !== null)
          .map((cssClass) => [cssClass.className, cssClass])
      ).values(),
    ]);
  }, [cssClasses]);

  useEffect(() => {
    setCssText(
      [...addedCssClasses, activeCssClass].reduce((cssText, cssClass) => {
        return typeof cssClass?.cssText === "string"
          ? cssText + cssClass?.cssText
          : cssText;
      }, "")
    );
  }, [addedCssClasses, activeCssClass]);

  return <style>{defaultStyles + cssText}</style>;
};

export {};
