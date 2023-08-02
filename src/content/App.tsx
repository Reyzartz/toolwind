import { InspectedElementHighlighter } from "@toolwind/components/inspectedElementHighlighter";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useMessageEventListeners } from "./hooks/useMessageEventListeners";
import { inspectedElementState, selectedElementState } from "./store";

const App = () => {
  const [inspectedElement, setInspectedElement] = useRecoilState(
    inspectedElementState
  );

  useMessageEventListeners();

  const [selectedElement, setSelectedElement] =
    useRecoilState(selectedElementState);

  const init = useCallback(() => {
    const mouseoverEventHandler = (e: MouseEvent) => {
      e.stopPropagation();

      if (
        e.target !== null &&
        !(e.target as HTMLElement).matches("toolwind-root *") &&
        !(e.target as HTMLElement).matches("toolwind-root *,svg, svg *")
      ) {
        setInspectedElement(e.target as HTMLElement);
      }
    };

    const mouseleaveWindowEventHandler = (e: MouseEvent) => {
      e.stopPropagation();

      setInspectedElement(null);
    };

    const clickEventListener = (e: MouseEvent) => {
      if (
        e.target !== null &&
        !(e.target as HTMLElement).matches("toolwind-root *,svg, svg *")
      ) {
        e.stopPropagation();
        e.preventDefault();

        setSelectedElement(e.target as HTMLElement);
      }
    };

    const addEventListenerHandler = () => {
      document.addEventListener("mouseover", mouseoverEventHandler);
      document.addEventListener("click", clickEventListener, true);
      document.documentElement.addEventListener(
        "mouseleave",
        mouseleaveWindowEventHandler
      );
    };

    const removeEventListenerHandler = () => {
      document.removeEventListener("mouseover", mouseoverEventHandler);
      document.removeEventListener("click", clickEventListener, true);
      document.documentElement.removeEventListener(
        "mouseleave",
        mouseleaveWindowEventHandler
      );
    };

    addEventListenerHandler();

    return () => removeEventListenerHandler();
  }, []);

  useEffect(() => {
    const unmount = init();

    return unmount;
  }, []);

  return (
    <>
      <InspectedElementHighlighter element={inspectedElement} />

      {selectedElement !== null && (
        <InspectedElementHighlighter element={selectedElement} selected />
      )}
    </>
  );
};

export { App };
