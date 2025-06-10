import { useState } from "react";
import CButton from "../../components/button";
import { toast } from "react-toastify";
import CInput from "../../components/input";
import ProgressBar from "../../components/progress-bar";
import TextEditor from "../../components/text-editor";

interface IISongs {
  closeModal: Function;
  prevWords?: string;
  prevTitle?: string;
  rowid?: number;
}

const AddSong = ({ closeModal, prevWords, prevTitle, rowid }: IISongs) => {
  const [title, setTitle] = useState(prevTitle ?? "");
  const [words, setWords] = useState(prevWords ?? "");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async () => {
    try {
      console.log({ words, title, rowid });

      if (rowid) {
        await window.api.updateSong(title, words, rowid);
        toast.success("Song updated successfully");
      } else {
        await window.api.createSong(title, words);
        toast.success("Song added successfully");
      }
      closeModal();
    } catch (err) {
      console.log({ err });
      toast.error("Error creating / updating song");
    }
  };

  return (
    <div className='flex flex-col gap-[20px] text-black  '>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-semibold text-black '>
          {rowid ? `Edit Song ${prevTitle}` : "Add New Song"}
        </h2>
      </div>

      {loading ? (
        <ProgressBar progress={progress} />
      ) : (
        <div className='flex flex-col gap-1 h-full'>
          <CInput
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className='w-full h-[60vh] overflow-auto'>
            <TextEditor setValue={setWords} value={prevWords ?? ""} />
          </div>

          <CButton
            title={rowid ? "Update" : "Submit"}
            disabled={!words || !title}
            onClick={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default AddSong;
