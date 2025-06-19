import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ISchedule {
  value: Record<string, any>;
  type: string;
  scheduleId: string;
  title: string;
}
const Schedule = () => {
  const [scheduleItems, setScheduleItems] = useState<ISchedule[]>([]);
  const [fileSavedPath, setFileSavedPath] = useState("");
  const [activeIndex, setActiveIndex] = useState<string>();

  const sortOrder = (fromIndex: number, isUp: boolean) => {
    const toIndex = isUp ? fromIndex - 1 : fromIndex + 1;
    const arr = [...scheduleItems];
    // Out of bounds check
    if (toIndex < 0 || toIndex >= arr.length) return;

    const temp = arr[fromIndex];
    arr[fromIndex] = arr[toIndex];
    arr[toIndex] = temp;

    setScheduleItems(arr);
  };

  const sendToDisplay = (item: ISchedule) => {
    setActiveIndex(item.scheduleId);
    let obj: Record<string, any> = {};
    obj = { ...item.value, scheduleId: item.scheduleId };
    window.electron.ipcRenderer.send("trigger-display", obj);
  };

  const renderLines = () => {
    return scheduleItems.map((item, index, arr) => (
      <div
        key={item.scheduleId}
        onDoubleClick={() => sendToDisplay(item)}
        className={`border flex justify-between w-full rounded items-center cursor-pointer ${
          activeIndex === item.scheduleId ? "bg-blue-300" : ""
        }`}
      >
        <div>{item.title}</div>
        <div className='flex flex-col'>
          {index > 0 && (
            <ArrowBigUp
              className='cursor-pointer'
              onClick={() => sortOrder(index, true)}
            />
          )}
          {index < arr.length - 1 && (
            <ArrowBigDown
              className='cursor-pointer'
              onClick={() => sortOrder(index, false)}
            />
          )}
        </div>
      </div>
    ));
  };

  const getYourEditorContent = () => {
    return scheduleItems;
  };

  useEffect(() => {
    const handler = (payload: ISchedule) => {
      setScheduleItems((prevItems) => {
        const foundItemIndex = prevItems.findIndex(
          (item) => item.scheduleId === payload.scheduleId
        );
        const arr = [...prevItems];
        if (foundItemIndex === -1) {
          arr.push(payload);
        } else {
          arr[foundItemIndex] = payload;
        }
        return arr;
      });
    };

    const fileOpened = ({
      content,
      filePath,
    }: {
      content: string;
      filePath: string;
    }) => {
      try {
        const json = JSON.parse(content);
        setScheduleItems(json);
        setFileSavedPath(filePath);
      } catch (err) {
        toast.error("Unable to open the file" + typeof content + err);
      }
    };

    window.electron.ipcRenderer.on("schedule-action", handler);

    window.electron.ipcRenderer.on("file-opened", fileOpened);
    window.electron.ipcRenderer.on("save-success", (filePath: string) =>
      setFileSavedPath(() => filePath)
    );
    window.electron.ipcRenderer.on("save-error", () =>
      toast.error("Unable to save the file")
    );

    // return () => {
    //   window.electron.ipcRenderer.removeListener("schedule-action", handler);
    // };
  }, []);

  useEffect(() => {
    // When editor has unsaved content
    window.electron.ipcRenderer.send(
      "set-save-enabled",
      !!scheduleItems.length
    );

    if (scheduleItems.length) {
      const requestFile = (filePath: string) => {
        const content = getYourEditorContent(); // however you track content
        window.electron.ipcRenderer.send("save-to-path", { filePath, content });
      };

      window.electron.ipcRenderer.on("request-file-content", requestFile);
    }
  }, [scheduleItems]);

  return (
    <div className='text-black container h-full py-2 overflow-hidden'>
      <div className='flex gap-1 items-center justify-between'>
        <div>Schedule</div>
        <div>{fileSavedPath}</div>
      </div>
      <div className='overflow-auto h-[90%]'>
        <div className='flex flex-col gap-1'>{renderLines()}</div>
      </div>
    </div>
  );
};
export default Schedule;
