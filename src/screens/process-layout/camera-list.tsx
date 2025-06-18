import { useEffect, useState } from "react";
import ColorPicker from "../../components/color-picker";
import CButton from "../../components/button";
import { toast } from "react-toastify";

interface ICamera {
  cameraId: string;
  setCameraId: (x: string) => void;
  closeModal: () => void;
}
const CameraList = ({ setCameraId, cameraId, closeModal }: ICamera) => {
  const [cameraDevices, setCameraDevices] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameraDevices(videoInputs);
    } catch {
      toast.error("Unable to get Cameras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCameras();
  }, []);

  return (
    <div className='flex flex-col gap-[20px] text-black w-min-[400px]'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-black '>Camera List</h2>
        <div className='space-y-2'>
          {loading
            ? "Loading..."
            : !cameraDevices.length
            ? "No Camera Device available"
            : cameraDevices.map((item, index) => (
                <label
                  className='flex items-center space-x-2'
                  key={`Cam${index}`}
                >
                  <input
                    type='radio'
                    name='option'
                    checked={item.deviceId === cameraId}
                    className='form-radio text-blue-600 focus:ring-blue-500'
                    onChange={() => setCameraId(item.deviceId)}
                  />
                  <span className='text-gray-700'>{item.label}</span>
                </label>
              ))}
        </div>
        <div className='flex w-full justify-between'>
          <CButton
            title='Reset'
            className='bg-gray-400 w-[40%]'
            onClick={() => {
              setCameraId("");
              closeModal();
            }}
          />
          <CButton title='Submit' onClick={closeModal} className=' w-[40%]' />
        </div>
      </div>
    </div>
  );
};
export default CameraList;
