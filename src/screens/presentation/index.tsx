import { useEffect, useRef, useState } from "react";

interface IPayload {
  title?: string;
  body?: string;
  html?: string;
  "text-color"?: string;
  "background-color"?: string;
  "background-image"?: string;
  cameraId?: string;
}

interface IPresentation {
  width?: string;
  height?: string;
  prose?: boolean;
}

const Presentation = ({
  width = "100vw",
  height = "100vh",
  prose = true,
}: IPresentation) => {
  const [message, setMessage] = useState<IPayload>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const displayMessage = () => {
    if (!message?.html) return "";
    const removeXL = (html: string) => {
      if (!prose) {
        return html.replace(/\btext-(xs|sm|base|\d+xl)\b/g, "");
      }
      return html;
    };
    return removeXL(message.html);
    // return  (
    //   <div>
    //     <div className='text-sm'>{message.title}</div>
    //     <div className='text-4xl'>{message.body}</div>
    //   </div>
    // );
  };

  const displayCamera = () => {
    if (message?.cameraId) {
    }
  };

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      if (!message?.cameraId) return null;
      try {
        const deviceId = message.cameraId;
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Could not access camera video");
      }
    };

    startCamera();

    // Cleanup: stop tracks when component unmounts or deviceId changes
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [message?.cameraId]);

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

  const styleBackgroundImage: Record<string, string> = message?.[
    "background-image"
  ]
    ? {
        backgroundImage: `url(${message?.["background-image"]})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      className={
        message?.cameraId
          ? `relative w-[${width}] h-[${height}]  aspect-video mx-auto  rounded overflow-hidden bg-black shadow`
          : ""
      }
    >
      {/* Video will show only if camera is available */}
      {message?.cameraId && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className='w-full border rounded-md shadow'
        />
      )}
      <div
        className={
          message?.cameraId
            ? "absolute bottom-0 text-white left-0 right-0 flex justify-center p-6 bg-gradient-to-t from-black/80 to-transparent"
            : `  text-white w-[${width}] h-[${height}] flex flex-col justify-center items-center `
        }
        style={{
          color: message?.["text-color"],
          backgroundColor: message?.["background-color"],

          ...styleBackgroundImage,
        }}
      >
        <div
          className={`${prose ? "prose" : ""} max-w-none `}
          dangerouslySetInnerHTML={{ __html: displayMessage() }}
        />
      </div>

      {/* Overlay text (always visible) */}
    </div>
  );
  // return <div className='container '>{displayMessage()}</div>;
};

export default Presentation;
