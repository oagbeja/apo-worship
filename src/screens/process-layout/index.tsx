import { useEffect, useState } from "react";
import { IVerseUnit } from "../../global.dt";

interface IPayload {
  details: Record<string, any>[];
  type: string;
  title?: string;
}
const ProcessLayout = () => {
  const [message, setMessage] = useState<IPayload>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const strReplace = (str: string) => str.replace("&nbsp;", "");
  const handleActivate = (index: number) => {
    setActiveIndex(index);
    triggerAction(index);
  };

  const items = (
    message?.details instanceof Array ? message.details : []
  ).filter((item) => item.title && !!strReplace(item.title));
  const triggerAction = (index: number) => {
    const item = items[index];
    console.log("Activated:", item);
    // Your custom logic here
    sendMessage(item, message?.type ?? "");
  };

  const sendMessage = (item: Record<string, any>, type: string) => {
    // at this point preparation of all text and themes are done and only
    //html tag is sent to presentation..

    let strHtml = "";
    switch (type) {
      case "bible":
        strHtml = ` <div>
                <div class='text-3xl'>${item.title}</div>
                <div class='text-7xl'>${item.body}</div>
            </div>`;
        break;
      case "song":
        strHtml = ` <div>                
                <div class='text-8xl text-center'>${item.title}</div>
            </div>`;
        break;
    }

    console.log({ strHtml });

    window.electron.ipcRenderer.send("trigger-presentation", {
      html: strHtml,
    });
  };
  const renderLines = () => {
    if (!message?.type) return null;
    switch (message.type) {
      case "bible":
        return items.map((item, index) => (
          <div
            onClick={() => handleActivate(index)}
            style={{
              cursor: "pointer",
              backgroundColor:
                index === activeIndex ? "lightblue" : "transparent",
            }}
            //   onClick={() => sendMessage(item, message.type)}
            className={`flex gap-[10px] cursor-pointer border-[1px] `}
            key={`Bible${index}`}
          >
            <div className='w-[100px]'>{item.title}</div>
            <div className='flex-1'>{item.body}</div>
          </div>
        ));
      case "song":
        return items.map((item, index) => (
          <div
            onClick={() => handleActivate(index)}
            style={{
              cursor: "pointer",
              backgroundColor:
                index === activeIndex ? "lightblue" : "transparent",
            }}
            className={`flex gap-[10px] cursor-pointer border-[1px] `}
            key={`Song${index}`}
          >
            <div className='w-full min-h-[20px]'>{item.title}</div>
          </div>
        ));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;

      if (e.key === "ArrowDown") {
        if (activeIndex >= items.length - 1) return;
        const nextIndex = (activeIndex + 1) % items.length;
        handleActivate(nextIndex);
      }

      if (e.key === "ArrowUp") {
        if (activeIndex <= 0) return;

        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        handleActivate(prevIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  useEffect(() => {
    window.electron.ipcRenderer.on("display-action", (payload: IPayload) => {
      // if (payload.action === "nextVerse")
      console.log({ payload });
      setMessage(payload);
    });
  }, []);

  return (
    <div className='text-black container h-full py-2 overflow-hidden'>
      Process
      <div>{message?.title ?? ""}</div>
      <div className='overflow-auto h-[90%]'>{renderLines()}</div>
    </div>
  );
};

export default ProcessLayout;
