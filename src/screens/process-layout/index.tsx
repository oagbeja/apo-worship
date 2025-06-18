import { useEffect, useState } from "react";
import { IVerseUnit } from "../../global.dt";
import CButton from "../../components/button";
import Dropdown from "../../components/dropdown";
import { Backpack, Camera, Image, Save, TextCursor } from "lucide-react";
import Modal from "../../components/modal";
import CColor from "./customize-color";
import CameraList from "./camera-list";

interface IPayload {
  details?: Record<string, any>[];
  type: string;
  title?: string;
}

interface IPayloadMetadata extends IPayload {
  metadata: boolean;
  type: string;
  value: string;
}
const ProcessLayout = () => {
  const [message, setMessage] = useState<IPayload>();
  const [metadata, setMetadata] = useState<IPayloadMetadata>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalOptions, setModalOptions] = useState(1);
  const [cameraId, setCameraId] = useState("");
  const [styleState, setStyleState] = useState<Record<string, string>>({});

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
        strHtml = ` <div >
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
      ...styleState,
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
  const handleSubmitStyle = (name: string, value: string) => {
    setStyleState({ ...styleState, [name]: value });
    handleCloseModal();
  };

  const handleChangeCamera = (value: string) => {
    setCameraId(value);
    setStyleState({ ...styleState, cameraId: value });
  };

  const renderModal = () => {
    switch (modalOptions) {
      case 1:
        return (
          <CColor
            handleSubmit={handleSubmitStyle}
            title='Text'
            name='text-color'
          />
        );
      case 2:
        return (
          <CColor
            handleSubmit={handleSubmitStyle}
            title='Background'
            name='background-color'
          />
        );
      case 3:
        return (
          <CameraList
            cameraId={cameraId}
            setCameraId={handleChangeCamera}
            closeModal={handleCloseModal}
          />
        );
    }
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleClick = (val: number) => {
    setModalOptions(val);
    setOpenModal(true);
  };

  const isIPayload = (payload: IPayloadMetadata) => {
    return ["song", "bible"].includes(payload.type);
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
    window.electron.ipcRenderer.on(
      "display-action",
      (payload: IPayloadMetadata) => {
        // if (payload.action === "nextVerse")
        if (isIPayload(payload)) {
          setMessage(payload);
        } else setMetadata(payload);

        console.log({ payload }, isIPayload(payload));
      }
    );
  }, []);

  useEffect(() => {
    if (metadata?.type && metadata?.value)
      setStyleState({ ...styleState, [metadata.type]: metadata.value });
  }, [metadata]);

  return (
    <div className='text-black container h-full py-2 overflow-hidden'>
      <div className='flex gap-1 items-center justify-between'>
        <div>Process</div>

        <div className='flex'>
          {" "}
          <TextCursor
            onClick={() => handleClick(1)}
            className='w-5 h-5 cursor-pointer'
          >
            <title>Text Color</title>
          </TextCursor>
          <div
            className='w-2 h-5'
            style={{ background: styleState?.["text-color"] }}
          ></div>
        </div>

        <div className='flex'>
          {" "}
          <Backpack
            onClick={() => handleClick(2)}
            className='w-5 h-5 cursor-pointer'
          >
            <title>Background Color</title>
          </Backpack>
          <div
            className='w-2 h-5'
            style={{ background: styleState?.["background-color"] }}
          ></div>
        </div>

        {/* <Image className='w-5 h-5 cursor-pointer'>
          <title>Background Image</title>
        </Image> */}
        <div className='flex'>
          <Camera
            className='w-5 h-5 cursor-pointer'
            onClick={() => handleClick(3)}
          >
            <title>Set Camera</title>
          </Camera>
          <div
            className='w-2 h-5'
            style={{ background: cameraId ? "blue" : undefined }}
          ></div>
        </div>

        <Save className='w-5 h-5 cursor-pointer'>
          <title>Save to Schedule</title>
        </Save>
      </div>
      <div>{message?.title ?? ""}</div>
      <div className='overflow-auto h-[90%]'>{renderLines()}</div>
      <Modal
        className={modalOptions < 3 ? "w-[fit-content]" : ""}
        isOpen={openModal}
        onClose={handleCloseModal}
        component={renderModal()}
      />
    </div>
  );
};

export default ProcessLayout;
