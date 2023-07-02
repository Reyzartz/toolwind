import { useCallback, useEffect, useState } from "react";
import { ExtensionStateMessageAction } from "../../types/common";
import { Toggle } from "../../components/toggle";
import { ModifiedElementsList } from "../../components/modifiedElementsList";
import { SettingsPanel } from "../../components/settingsPanel";
import { getItemFromStorage, setItemToStorage } from "../../helpers/storage";
import { sendMessageToContentScript } from "../../helpers/message";

function App() {
  const [extensionState, setExtensionState] =
    useState<ExtensionStateMessageAction["state"]>("disabled");

  const [showSettingsPanel, setShowSettingPanel] = useState(false);

  const onToggleHandler = useCallback((value: boolean) => {
    setExtensionState(value ? "enabled" : "disabled");

    setItemToStorage(
      "toolwind_extension_state",
      value ? "enabled" : "disabled"
    );

    sendMessageToContentScript({
      messageType: "UPDATE_EXTENSION_ACTIVE_STATE",
      message: { state: value ? "enabled" : "disabled" },
    });
  }, []);

  useEffect(() => {
    getItemFromStorage("toolwind_extension_state").then((res) => {
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

        <Toggle
          onToggle={onToggleHandler}
          checked={extensionState === "enabled"}
        />

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
