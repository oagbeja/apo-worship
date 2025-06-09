import { useState } from "react";
import CButton from "./button";
import ProgressBar from "./progress-bar";

interface IIComp {
  closeModal: () => void;
  title?: string;
  handleDelete: () => void;
}

const DeleteComponent = ({ closeModal, title, handleDelete }: IIComp) => {
  const [loading, setLoading] = useState(false);
  const [progress] = useState(100);

  const processDelete = async () => {
    try {
      setLoading(true);
      await handleDelete();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-[20px] text-black'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-black '>Delete {title}</h2>
      </div>

      {loading ? (
        <ProgressBar progress={progress} />
      ) : (
        <>
          <div className='text-md text-center'>
            {" "}
            Do you really want to delete this item ?
          </div>

          <div className='flex justify-between w-full '>
            <div className='w-[40%]'>
              <CButton
                title='Yes'
                className='w-full'
                onClick={processDelete}
                style={{ background: "red" }}
              />
            </div>
            <div className='w-[40%]'>
              <CButton title='No' className='w-full' onClick={closeModal} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteComponent;
