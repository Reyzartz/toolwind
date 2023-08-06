import { isCustomClass } from "@toolwind/helpers/cssClasses";
import { getItemFromStorage } from "@toolwind/helpers/storage";
import { CSSClassSuggestionItem } from "@toolwind/types/common";
import { useCallback, useEffect, useState } from "react";
// @ts-expect-error
import AutoComplete from "tailwindcss-autocomplete";
export let autocomplete: AutoComplete;

export const useTailwindIntellisense = () => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (autocomplete === undefined) {
      getItemFromStorage("tw_config").then((config) => {
        autocomplete = new AutoComplete(config ?? {});
      });
    }
  }, []);

  const getSuggestionList = useCallback(
    async (className: string = ""): Promise<CSSClassSuggestionItem[]> => {
      if (isCustomClass(className)) return [];

      const results = await autocomplete.getSuggestionList(className);

      // @ts-ignore
      return results.slice(0, 50).map((item) => {
        return {
          name: item.label as string,
          color:
            typeof item.documentation === "string"
              ? (item.documentation as string)
              : undefined,
          isVariant: item.data._type === "variant",
          variants: item.data?.variants ?? [],
        };
      });
    },
    []
  );

  const getCssText = useCallback(async (className: string): Promise<string> => {
    const result = await autocomplete.getClassCssText(className);

    return result;
  }, []);

  const getClassColor = useCallback(async (className: string) => {
    const result = await autocomplete.getColor(className);

    return result;
  }, []);

  const setConfigHandler = useCallback((config: Object) => {
    setConfig(config);

    autocomplete = new AutoComplete(config);
  }, []);

  return {
    config,
    setConfig: setConfigHandler,
    getSuggestionList,
    getCssText,
    getClassColor,
  };
};
