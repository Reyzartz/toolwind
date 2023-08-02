import { ModifiedElementsList } from "@toolwind/components/modifiedElementsList";
import { SettingsPanel } from "@toolwind/components/settingsPanel";
import { Toggle } from "@toolwind/components/toggle";
import { sendMessage } from "@toolwind/helpers/message";
import {
  getItemFromStorage,
  setItemToStorage,
} from "@toolwind/helpers/storage";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [extensionState, setExtensionState] = useState(false);

  const [showSettingsPanel, setShowSettingPanel] = useState(false);

  const onToggleHandler = useCallback((value: boolean) => {
    setExtensionState(value);

    setItemToStorage("toolwind_enabled", value);

    sendMessage({
      to: "content_script",
      action: { type: "TOGGLE_TOOLWIND", data: value },
    });
  }, []);

  useEffect(() => {
    getItemFromStorage("toolwind_enabled").then((res) => {
      setExtensionState(res);
    });
  }, []);

  return (
    <div
      className="bg-indigo-900 flex flex-col"
      style={{ width: 350, height: 400, maxHeight: 400 }}
    >
      <header className="flex border-b border-indigo-600 pl-3 items-center gap-2">
        <span className="text-lg font-semibold leading-4 text-indigo-200 mr-auto">
          {!showSettingsPanel ? "Toolwind" : "Settings"}
        </span>

        <Toggle onToggle={onToggleHandler} checked={extensionState} />

        <div
          className="cursor-pointer border-0 border-l border-solid border-indigo-600 w-9 h-9 flex items-center justify-center hover:bg-indigo-800 active:bg-indigo-900 text-2xl text-slate-200"
          onClick={() => setShowSettingPanel(!showSettingsPanel)}
        >
          {!showSettingsPanel ? (
            <img src="/icons/settings.svg" width="20" height="20" />
          ) : (
            <span className="px-1">⤫</span>
          )}
        </div>
      </header>

      <div className="flex-grow overflow-scroll p-3">
        {showSettingsPanel ? <SettingsPanel /> : <ModifiedElementsList />}
      </div>
    </div>
  );
}

export default App;
