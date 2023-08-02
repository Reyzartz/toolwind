import { addMessageListener, sendMessage } from "@toolwind/helpers/message";
import { ModifiedElement } from "@toolwind/types/common";
import { useCallback, useEffect, useState } from "react";

const ModifiedElementsList = () => {
  const [elementsList, setElementList] = useState<ModifiedElement[]>([]);

  const fetchElementsList = async () => {
    const response = await sendMessage({
      to: "content_script",
      action: {
        type: "FETCH_MODIFIED_ELEMENTS",
      },
    });

    setElementList(Array.isArray(response) ? response : []);
  };

  useEffect(() => {
    fetchElementsList();

    sendMessage({
      to: "content_script",
      action: { type: "SELECT_ELEMENT", data: { xpath: null } },
    });

    addMessageListener((message) => {
      if (message.type === "MODIFIED_ELEMENTS_UPDATED") {
        setElementList(message.data);
      }
    });
  }, []);

  const onMouseEnterHandler = useCallback((xpath: string | null = null) => {
    sendMessage({
      to: "content_script",
      action: {
        type: "HOVER_ELEMENT",
        data: { xpath },
      },
    });
  }, []);

  const onClickHandler = useCallback((xpath: string) => {
    sendMessage({
      to: "content_script",
      action: { type: "SELECT_ELEMENT", data: { xpath } },
    });

    window.close();
  }, []);

  const onDeleteHandler = useCallback((item: ModifiedElement) => {
    sendMessage({
      to: "content_script",
      action: {
        type: "DELETE_MODIFIED_ELEMENT",
        data: item,
      },
    });
  }, []);

  return (
    <div className="flex gap-2 flex-col p-3 overflow-y-scroll">
      {elementsList.map((ele) => (
        <div
          key={ele.xpath}
          className="rounded-md border border-solid border-indigo-400 text-xs text-slate-4 hover:border-indigo-300 overflow-hidden cursor-pointer flex gap-2 items-center group relative"
          onMouseEnter={() => onMouseEnterHandler(ele.xpath)}
          onMouseLeave={() => onMouseEnterHandler()}
          onClick={() => onClickHandler(ele.xpath)}
        >
          <span className="pl-2 pr-1 py-1.5 bg-white text-indigo-900 transition-all lowercase">
            {ele.tagName}:
          </span>

          <span className="max-w-full truncate">
            {ele.updatedClassNames.join(", ")}
          </span>

          <div
            className="text-lg pr-2 pl-10 absolute -right-full group-hover:right-0 transition-all hover:text-white"
            style={{
              background:
                "linear-gradient(to left, rgba(49,46,129), transparent)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteHandler(ele);
            }}
          >
            ⤫
          </div>
        </div>
      ))}
    </div>
  );
};

export { ModifiedElementsList };
