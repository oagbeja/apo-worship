import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { compressImageWithoutResizing } from "../utils/format";
// import CButton from "./button";

interface IIMage {
  saveImage: (x: any) => void;
}

const ImageCropUploader = ({ saveImage }: IIMage) => {
  const [image, setImage] = useState<string | null>(null);
  // const [finalimage, setFinalImage] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveHandler = async () => {
    if (image && croppedArea) {
      const img = await compressImageWithoutResizing(image, croppedArea);
      // setFinalImage(img);
      saveImage(img);
    }
  };

  useEffect(() => {
    saveHandler();
  }, [image, croppedArea]);

  return (
    <div>
      <input
        type='file'
        onChange={handleFileChange}
        className='block p-1 w-full bg-blue text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer  focus:outline-none
            file:mr-4 file:py-1 file:px-2 file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-600 file:text-white hover:file:bg-blue-700'
      />
      {image && (
        <div className='flex flex-col justify-center items-center'>
          <div className='relative w-[100px] h-[100px] mt-4'>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className='text-xs font-semibold text-italics'>
            You can zoom in or out to pick your actual image
          </div>
          {/* <CButton title='Save' className='w-[100px]' onClick={saveHandler} /> */}
        </div>
      )}

      {/* <img src={finalimage ? URL.createObjectURL(finalimage) : ""} /> */}
    </div>
  );
};

export default ImageCropUploader;
