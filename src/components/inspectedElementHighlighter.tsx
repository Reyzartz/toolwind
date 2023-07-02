import { useCallback, useEffect, useRef, useState } from "react";
import { SelectedElementPopup } from "./selectedElementPopup";
import { ClassNamesTooltip } from "./classNamesTooltip";

interface ElementOverlayProps {
  element: HTMLElement | null;
  selected?: boolean;
}

const InspectedElementHighlighter = ({
  element,
  selected = false,
}: ElementOverlayProps): JSX.Element | null => {
  const [rect, setRect] = useState(element?.getClientRects()[0]);
  const intervalId = useRef<number | null>(null);

  const setRectHandler = useCallback(() => {}, [element]);

  useEffect(() => {
    if (selected) {
      if (typeof intervalId.current === "number") {
        clearInterval(intervalId.current);
      }

      intervalId.current = setInterval(() => {
        setRect((prev) => {
          const updatedRect = element?.getClientRects()[0];
          return prev?.x === updatedRect?.x &&
            prev?.y === updatedRect?.y &&
            prev?.height === updatedRect?.height &&
            prev?.width === updatedRect?.width
            ? prev
            : updatedRect;
        });

        setRectHandler();
      }, 100);
    } else {
      setRect(element?.getClientRects()[0]);
    }

    return () => {
      intervalId.current !== null && clearInterval(intervalId.current);
    };
  }, [element]);

  if (element === null || rect === undefined) return null;

  return (
    <>
      {selected ? (
        <SelectedElementPopup rect={rect} />
      ) : (
        <ClassNamesTooltip rect={rect} />
      )}
    </>
  );
};

export { InspectedElementHighlighter };
