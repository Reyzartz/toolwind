import { inspectedElementState } from "@toolwind/content/store";
import { getClassNames } from "@toolwind/helpers/cssClasses";
import React, { useMemo, useState } from "react";
import { usePopper } from "react-popper";
import { useRecoilValue } from "recoil";

export interface IClassNamesTooltipProps {
  rect: DOMRect;
}

export const ClassNamesTooltip = React.memo(
  ({ rect }: IClassNamesTooltipProps) => {
    const inspectedElement = useRecoilValue(inspectedElementState);

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);

    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement: "top-end",
    });

    const classNames = useMemo(
      () => getClassNames(inspectedElement),
      [inspectedElement]
    );

    if (inspectedElement === null) return null;

    return (
      <>
        <div
          ref={setReferenceElement as any}
          className="fixed pointer-events-none bg-purple-400/50 z-[10000]"
          style={{
            top: rect.y,
            left: rect.x,
            width: rect.width,
            height: rect.height,
          }}
        />

        <div
          id="toolwind-tooltip"
          key={`${rect.y}+${rect.x}`}
          ref={setPopperElement as any}
          style={{ ...styles.popper, zIndex: 10000, pointerEvents: "none" }}
          {...attributes.popper}
        >
          <div
            className="bg-purple-600 min-w-12 truncate shadow-md px-3 py-1 rounded-t-md text-xs text-slate-200 lowercase"
            style={{
              maxWidth: inspectedElement.offsetWidth,
            }}
          >
            {`<${inspectedElement.tagName}>${
              classNames.length === 0 ? "" : "." + classNames.join(".")
            }`}
          </div>
        </div>
      </>
    );
  }
);
