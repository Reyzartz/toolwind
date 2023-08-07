import { useCSSClasses } from "@toolwind/content/hooks/useCssClasses";
import { useCallback } from "react";
import { ClassNameInput } from "./classNameInput";
import { useUnmount } from "react-use";

const AddClassName = () => {
  const { isAdding, setIsAdding, addCssClass } = useCSSClasses();

  const onAddHandler = useCallback(
    (className: string) => {
      if (className.trim().length > 0) {
        void addCssClass(className);
      }

      setIsAdding(false);
    },
    [setIsAdding, addCssClass]
  );

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        e.stopPropagation();
        setIsAdding(true);
      },
      [setIsAdding]
    );

  // close the input component when it unloaded
  useUnmount(() => {
    setIsAdding(false);
  });

  return (
    <div>
      {isAdding ? (
        <ClassNameInput
          defaultValue={{ name: "", variants: [] }}
          onSave={onAddHandler}
        />
      ) : (
        <button
          onClick={onClickHandler}
          className="text-sm text-indigo-400 py-1 px-2 rounded-1 hover:text-indigo-200"
        >
          + Add Class
        </button>
      )}
    </div>
  );
};
export { AddClassName };
