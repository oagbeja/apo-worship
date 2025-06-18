import React, { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface IColorPicker {
  color?: string;
  setColor: (x: string) => void;
}
const ColorPicker = ({ color = "#aabbcc", setColor }: IColorPicker) => {
  // const [color, setColor] = useState("#aabbcc");

  return (
    <div className='space-y-2 p-4 rounded bg-white shadow w-64'>
      <HexColorPicker
        color={color}
        onChange={setColor}
        style={{ width: "100%" }}
      />

      <div className='flex items-center space-x-2 w-full'>
        <span className='text-sm text-gray-600'>Hex:</span>
        <HexColorInput
          color={color}
          onChange={setColor}
          prefixed
          className='border px-2 py-1 rounded  h-7  text-sm w-[50%]'
        />
        <div
          className=' h-7 rounded flex-1'
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
