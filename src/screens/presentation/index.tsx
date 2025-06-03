import { useEffect, useState } from "react";

interface IPayload {
  title: string;
  body: string;
}

const Presentation = () => {
  const [message, setMessage] = useState<IPayload>();

  const displayMessage = () => {
    if (!message) return null;
    return (
      <div>
        <div className='text-sm'>{message.title}</div>
        <div className='text-4xl'>{message.body}</div>
      </div>
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      "presentation-action",
      (payload: IPayload) => {
        // if (payload.action === "nextVerse")
        setMessage(payload);
      }
    );
  }, []);
  return <div className='container '>{displayMessage()}</div>;
};

export default Presentation;
