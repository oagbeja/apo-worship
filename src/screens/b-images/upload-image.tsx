import { useState } from "react";
import CButton from "../../components/button";
import { toast } from "react-toastify";
import CInput from "../../components/input";
import ProgressBar from "../../components/progress-bar";
import ImageCropUploader from "../../components/image-cropper";
import { Buffer } from "buffer";

interface ILoadedFile {
  name: string;
  size: number;
  content: ArrayBuffer;
}

interface IISongs {
  closeModal: Function;
}

const UploadImage = ({ closeModal }: IISongs) => {
  const [tag, setTag] = useState("");
  const [image, setImage] = useState<Blob>();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const submitHandler = async () => {
    try {
      console.log({ image, tag });

      if (image && tag.trim() !== "") {
        setLoading(true);
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await window.api.uploadImage(buffer, tag);
        setProgress(100);
        toast.success("Successfully uploaded the image ");
        closeModal(1);
      }
    } catch (err: any) {
      console.log({ err });
      const errr = (err?.message ?? "").split(":");
      toast.error("Error uploading the files: " + errr[errr.length - 1]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-[20px] text-black'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-black '>Upload Images</h2>
      </div>

      {loading ? (
        <ProgressBar progress={progress} />
      ) : (
        <>
          {/* File input field */}
          <div>
            <ImageCropUploader saveImage={setImage} />
          </div>
          <CInput
            placeholder='Tag'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <CButton
            title='Upload'
            disabled={!image || !tag}
            onClick={submitHandler}
          />
        </>
      )}
    </div>
  );
};

export default UploadImage;
