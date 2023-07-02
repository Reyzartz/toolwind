import { MouseEventHandler, useCallback, useState } from "react";
import { CSSClass } from "../types/common";
import { ClassNameInput } from "./classNameInput";
import { useCSSClasses } from "../pages/content/hooks/useCssClasses";

interface ClassNameTagProps {
  cssClass: CSSClass;
}

export const ClassNameTag = ({
  cssClass: { id, className, meta, state, defaultClassName },
}: ClassNameTagProps) => {
  const { updateCssClass, removeCssClass } = useCSSClasses();

  const onUpdateHandler = useCallback(
    (value: string) => {
      updateCssClass(id, { className: value, state: "active" });
    },
    [updateCssClass]
  );

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        e.stopPropagation();
        if (state === "removed") return;

        updateCssClass(id, { state: "editing" });
      },
      [id, state, updateCssClass]
    );

  const onDeleteHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();

      if (defaultClassName === null) {
        removeCssClass(id);
      } else {
        updateCssClass(id, { state: "removed" });
      }
    },
    [id, updateCssClass]
  );

  return (
    <div
      className={`:uno: relative bg-indigo-900 border border-solid border-indigo-600 rounded-[4px] max-w-max flex cursor-pointer  ${
        state === "removed" ? "text-neutral-400" : "text-neutral-200"
      }`}
    >
      {state === "editing" ? (
        <ClassNameInput
          defaultValue={{ name: className, variants: [] }}
          onSave={onUpdateHandler}
        />
      ) : (
        <button
          onClick={onClickHandler}
          className={`:uno: flex items-center gap-1 px-1.5 py-1 text-sm text-inherit border-none bg-transparent ${
            state === "removed" ? "line-through cursor-text" : "cursor-pointer"
          }
					}`}
        >
          {meta.color !== null && (
            <span
              className=":uno: w-4 h-4 inline-block border border-gray-900 rounded-1"
              style={{ background: meta.color }}
            />
          )}

          {className}
        </button>
      )}

      {state === "active" && (
        <button
          onClick={onDeleteHandler}
          className=":uno: pr-1.5 z-0 font-bold leading-none bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500"
        >
          ⤫
        </button>
      )}
    </div>
  );
};
