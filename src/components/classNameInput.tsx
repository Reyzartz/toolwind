import { useTailwindIntellisense } from "@toolwind/content/hooks/useTailwindIntellisense";
import { activeCssClassState } from "@toolwind/content/store";
import {
  getClassNameFromCSSClassSuggestionItem,
  getCssClassObjectFromClassName,
  isCustomClass,
} from "@toolwind/helpers/cssClasses";
import { type CSSClassSuggestionItem } from "@toolwind/types/common";
import clsx from "clsx";
import { type UseComboboxStateChange, useCombobox } from "downshift";
import { useCallback, useState } from "react";
import { useMount, useUnmount } from "react-use";
import { useRecoilState } from "recoil";

interface ClassNameInputProps {
  onSave: (value: string) => void;
  defaultValue?: CSSClassSuggestionItem | null;
}

const ClassNameInput = ({
  defaultValue = null,
  onSave,
}: ClassNameInputProps) => {
  const [suggestedClasses, setSuggestedClasses] = useState<
    CSSClassSuggestionItem[]
  >([]);

  const { getCssText, getSuggestionList } = useTailwindIntellisense();

  const [activeOption, setActiveClassOption] =
    useRecoilState(activeCssClassState);

  const onSelectedItemChange = useCallback(
    ({
      selectedItem = null,
    }: UseComboboxStateChange<CSSClassSuggestionItem>) => {
      // triggered if the active option is an variant

      if (selectedItem === null || (selectedItem.isVariant ?? false)) return;

      onSave(getClassNameFromCSSClassSuggestionItem(selectedItem));

      return true;
    },
    [onSave]
  );

  const setActiveOptionHandler = useCallback(
    async (cssClass: CSSClassSuggestionItem | null) => {
      if (cssClass === null) {
        setActiveClassOption(null);
        return;
      }

      const className = getClassNameFromCSSClassSuggestionItem(cssClass);

      if (className === activeOption?.className) return;

      const cssText = await getCssText(className);

      setActiveClassOption(getCssClassObjectFromClassName(className, cssText));
    },
    [activeOption?.className, getCssText, setActiveClassOption]
  );

  const onInputValueChange = useCallback(
    ({ inputValue = "" }: UseComboboxStateChange<CSSClassSuggestionItem>) => {
      if (isCustomClass(inputValue)) {
        setSuggestedClasses([]);

        void getCssText(inputValue).then((cssText) => {
          setActiveClassOption(
            getCssClassObjectFromClassName(inputValue, cssText)
          );
        });
      }

      void getSuggestionList(inputValue).then((list) => {
        setSuggestedClasses(list);

        void setActiveOptionHandler(list[0] ?? null);
      });
    },
    [
      getSuggestionList,
      getCssText,
      setActiveClassOption,
      setActiveOptionHandler,
    ]
  );

  const onActiveOptionChange = useCallback(
    ({
      highlightedIndex = 0,
      isOpen = false,
    }: UseComboboxStateChange<CSSClassSuggestionItem>) => {
      const cssClass = suggestedClasses[highlightedIndex];

      if (cssClass === undefined || !isOpen) return;

      void setActiveOptionHandler(cssClass);
    },
    [suggestedClasses, setActiveOptionHandler]
  );

  const onCancelHandler = useCallback(() => {
    onSave(defaultValue?.name ?? "");
  }, [defaultValue?.name, onSave]);

  const {
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    isOpen,
    setInputValue,
  } = useCombobox<CSSClassSuggestionItem>({
    items: suggestedClasses,
    itemToString: (item) => getClassNameFromCSSClassSuggestionItem(item!),
    defaultHighlightedIndex: 0,
    onInputValueChange,
    onHighlightedIndexChange: onActiveOptionChange,
    onSelectedItemChange,
    defaultInputValue: defaultValue?.name,
    defaultSelectedItem: defaultValue,
  });

  useMount(() => {
    if (defaultValue != null) {
      // setting Active option to defaultValue on umount
      void setActiveOptionHandler(defaultValue);
    }
  });

  useUnmount(() => {
    // setting Active option to null on unmount
    void setActiveOptionHandler(null);
  });

  const onKeyUpHandler: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const value = (e.target as HTMLInputElement).value;

        if (e.code === "Enter" && isCustomClass(value)) {
          onSave(value);
          return;
        }

        if (e.code === "BracketLeft") {
          setInputValue(value + "]");
        }
      },
      [onSave, setInputValue]
    );

  return (
    <div className="relative">
      <div className="flex items-center border-b border-indigo-600 my-1 mx-2">
        <input
          placeholder="Enter class name"
          className="m-0 text-inherit bg-transparent !text-sm focus:!outline-none"
          {...getInputProps({
            autoFocus: true,
            onBlur: onCancelHandler,
            onKeyUpCapture: onKeyUpHandler,
          })}
        />

        <button
          onClick={onCancelHandler}
          className="pr-1.5 z-0 font-bold leading-4 bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500 text-xl"
        >
          ⤫
        </button>
      </div>

      <ul
        className={clsx(
          "flex flex-col mt-1.5 absolute z-[10000] top-full max-h-48 left-0 overflow-auto w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2",
          !isOpen && "hidden"
        )}
        {...getMenuProps()}
      >
        {suggestedClasses.map((suggestedClass, index) => (
          <li
            className={clsx(
              highlightedIndex === index && "bg-indigo-800",
              // selectedItem === suggestedClass && "font-bold",
              "flex gap-2 items-baseline text-indigo-400 font-semibold text-sm border-b px-2 py-1 border-indigo-800 rounded-md"
            )}
            key={`${suggestedClass.name}${index}`}
            {...getItemProps({ item: suggestedClass, index })}
          >
            {suggestedClass.color === undefined ? (
              <span className="font-semibold text-orange-400">
                {suggestedClass.isVariant === true ? `{}` : "☲"}
              </span>
            ) : (
              <span
                className="w-3 h-3 inline-block border border-gray-900 rounded-1"
                style={{ background: suggestedClass.color }}
              />
            )}

            <span>{suggestedClass.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ClassNameInput };
