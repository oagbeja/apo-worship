import { useState } from "react";
import ColorPicker from "../../components/color-picker";
import CButton from "../../components/button";

interface IColor {
  handleSubmit: (x: string, y: string) => void;
  title: string;
  name: string;
}
const CColor = ({ handleSubmit, title, name }: IColor) => {
  const [color, setColor] = useState("#aabbcc");

  return (
    <div className='flex flex-col gap-[20px] text-black'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-black '>{title} Color</h2>
        <ColorPicker color={color} setColor={setColor} />
        <CButton
          title='Submit'
          onClick={() => {
            handleSubmit(name, color);
          }}
        />
      </div>
    </div>
  );
};
export default CColor;
