import { json, jsonParseLinter } from "@codemirror/lang-json";
import { lintGutter, linter } from "@codemirror/lint";
import { githubDark } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useCallback, useEffect, useState } from "react";
import { sendMessageToContentScript } from "../helpers/message";
import { getItemFromStorage, setItemToStorage } from "../helpers/storage";

const DEFAULT_CONFIG = {};

const SettingsPanel = () => {
  const [defaultValue, setDefaultValue] = useState<string>();

  useEffect(() => {
    getItemFromStorage("tw_config").then((res) => {
      setDefaultValue(JSON.stringify(res ?? DEFAULT_CONFIG, null, 2));
    });
  }, []);

  const onChangeHandler = useCallback((value: string) => {
    // TODO: Add debounce to it
    try {
      const config = JSON.parse(value);

      sendMessageToContentScript({
        messageType: "UPDATE_CONFIG",
        message: { config },
      });

      setItemToStorage("tw_config", config);
    } catch (error) {}
  }, []);

  return (
    <div>
      <h3 className=":uno: text-xs font-semibold text-indigo-300 mb-2">
        Tailwind Config:
      </h3>

      {defaultValue !== undefined && (
        <CodeMirror
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
