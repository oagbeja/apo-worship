import { useRef, useState } from "react";
import BottomLayout from "../bottom-layout";

export default function ResizableLayout() {
  const [leftWidth, setLeftWidth] = useState(200);
  const [middleWidth, setMiddleWidth] = useState(400);
  const [topHeight, setTopHeight] = useState(300);

  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef({ x1: false, x2: false, y: false });

  const startResize = (type: "x1" | "x2" | "y") => () => {
    isResizing.current[type] = true;

    const onMouseMove = (e: MouseEvent) => {
      if (isResizing.current.y && containerRef.current) {
        const top = containerRef.current.getBoundingClientRect().top;
        setTopHeight(Math.max(150, e.clientY - top));
      } else if (isResizing.current.x1) {
        const newLeft = Math.max(100, e.clientX);
        setLeftWidth(newLeft);
      } else if (isResizing.current.x2) {
        const newMiddle = Math.max(100, e.clientX - leftWidth - 4); // 4 = gap size
        setMiddleWidth(newMiddle);
      }
    };

    const stopResize = () => {
      isResizing.current = { x1: false, x2: false, y: false };
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopResize);
  };

  return (
    <div
      ref={containerRef}
      className='w-screen h-screen flex flex-col overflow-hidden'
    >
      {/* Top Section (resizable vertically) */}
      <div className='flex' style={{ height: topHeight }}>
        {/* Left */}
        <div className='bg-blue-100 p-2' style={{ width: leftWidth }}>
          Left
        </div>

        {/* Resize handle between Left and Middle */}
        <div
          className='w-1 bg-gray-400 cursor-col-resize'
          onMouseDown={startResize("x1")}
        />

        {/* Middle */}
        <div className='bg-green-100 p-2' style={{ width: middleWidth }}>
          Middle
        </div>

        {/* Resize handle between Middle and Right */}
        <div
          className='w-1 bg-gray-400 cursor-col-resize'
          onMouseDown={startResize("x2")}
        />

        {/* Right (flexes to fill remaining space) */}
        <div className='bg-purple-100 p-2 flex-1'>Right</div>
      </div>

      {/* Horizontal Resizer for Bottom */}
      <div
        className='h-1 w-full bg-gray-400 cursor-row-resize'
        onMouseDown={startResize("y")}
      />

      {/* Bottom */}
      <div className='bg-brown-100 flex-1 p-4 overflow-hidden'>
        <BottomLayout />
      </div>
    </div>
  );
}
