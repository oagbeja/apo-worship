import { useEffect, useState } from "react";

interface IPayload {
  title?: string;
  body?: string;
  html?: string;
}

const Presentation = () => {
  const [message, setMessage] = useState<IPayload>();

  const displayMessage = () => {
    if (!message?.html) return "";
    return message.html;
    // return  (
    //   <div>
    //     <div className='text-sm'>{message.title}</div>
    //     <div className='text-4xl'>{message.body}</div>
    //   </div>
    // );
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      "presentation-action",
      (payload: IPayload) => {
        // if (payload.action === "nextVerse")
        console.log({ payloadPresent: payload });
        setMessage(payload);
      }
    );
  }, []);
  return (
    <div className='text-white w-[100vw] flex flex-col justify-center items-center h-[100vh] container'>
      <div
        className='prose max-w-none '
        dangerouslySetInnerHTML={{ __html: displayMessage() }}
      />
    </div>
  );
  // return <div className='container '>{displayMessage()}</div>;
};

export default Presentation;
