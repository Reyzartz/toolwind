import { json, jsonParseLinter } from "@codemirror/lang-json";
import { lintGutter, linter } from "@codemirror/lint";
import { sendMessage } from "@toolwind/helpers/message";
import {
  getItemFromStorage,
  setItemToStorage,
} from "@toolwind/helpers/storage";
import { githubDark } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_CONFIG = {};

const SettingsPanel = () => {
  const [defaultValue, setDefaultValue] = useState<string>();

  useEffect(() => {
    void getItemFromStorage("tw_config").then((res) => {
      setDefaultValue(JSON.stringify(res ?? DEFAULT_CONFIG, null, 2));
    });
  }, []);

  const onChangeHandler = useCallback((value: string) => {
    // TODO: Add debounce to it
    try {
      const config = JSON.parse(value);

      void sendMessage({
        to: "content_script",
        action: {
          type: "UPDATE_CONFIG",
          data: { config },
        },
      });

      void setItemToStorage("tw_config", config);
    } catch (error) {}
  }, []);

  return (
    <div>
      <h3 className="text-xs font-semibold text-indigo-300 mb-2">
        Tailwind Config:
      </h3>

      {defaultValue !== undefined && (
        <ReactCodeMirror
          value={defaultValue}
          height="364px"
          style={{ fontSize: "14px" }}
          theme={githubDark}
          extensions={[json(), linter(jsonParseLinter()), lintGutter()]}
          onChange={onChangeHandler}
        />
      )}
    </div>
  );
};

export { SettingsPanel };
