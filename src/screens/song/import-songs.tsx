import { useState } from "react";
import CButton from "../../components/button";
import { toast } from "react-toastify";
import CInput from "../../components/input";
import ProgressBar from "../../components/progress-bar";
interface ILoadedFile {
  name: string;
  size: number;
  content: ArrayBuffer;
}

interface IISongs {
  closeModal: Function;
}

const ImportSongs = ({ closeModal }: IISongs) => {
  const songsDb = ["Songs.db", "SongWords.db"];

  const [filesData, setFilesData] = useState<Record<string, ILoadedFile>>({});
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    console.log({ filesArray });
    Promise.all(
      filesArray.map(
        (file) =>
          new Promise<ILoadedFile>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              if (reader.result instanceof ArrayBuffer) {
                resolve({
                  name: file.name,
                  size: file.size,
                  content: reader.result,
                });
              } else {
                reject(new Error("Unexpected file content type"));
              }
            };

            reader.onerror = () => reject(reader.error);

            reader.readAsArrayBuffer(file); // Or readAsText(file) if text
          })
      )
    )
      .then((loadedFiles) => {
        // setFilesData(loadedFiles);
        const obj: Record<string, ILoadedFile> = {};
        loadedFiles.forEach((item) => {
          if (!songsDb.includes(item.name)) {
            toast.error(`File name ${item.name} is not the expected file`);
          } else obj[item.name] = item;
        });
        setFilesData({ ...filesData, ...obj });
        // console.log("Files loaded in memory:", loadedFiles);
      })
      .catch((err) => {
        console.error("Failed to read files:", err);
      });
  };

  console.log({ filesData });

  const uploadFile = async (filename: string, content: ArrayBuffer) => {
    return await window.api.uploadFile(filename, content);
  };

  const mergeFiles = async () => {
    //tag
    await window.api.mergeFiles(tag);
    setProgress(100);
    toast.success("Successfully imported the songs ");
    closeModal(1);
    return;
  };

  const submitFiles = async () => {
    try {
      if (
        Object.keys(filesData).length === songsDb.length &&
        tag.trim() !== ""
      ) {
        setLoading(true);
        const unitProgress = 50 / songsDb.length;
        for (const filename of songsDb) {
          await uploadFile(filename, filesData[filename].content);
          setProgress(unitProgress + progress);
        }
        await mergeFiles();
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
        <h2 className='text-xl font-semibold text-black '>Import Songs</h2>
        <div className='text-xs font-semibold'>From Easy Worship</div>
      </div>

      {loading ? (
        <ProgressBar progress={progress} />
      ) : (
        <>
          <div>
            <ul className=' space-y-2 '>
              {songsDb.map((item, index) => (
                <li
                  key={`${item}${index}`}
                  className={`relative pl-6  ${
                    filesData[item]
                      ? "before:content-['✓']"
                      : "before:content-['◯']"
                  } before:absolute before:left-0 before:text-blue-600`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* File input field */}
          <div>
            <input
              type='file'
              multiple
              //   accept='.db'
              onChange={handleFileChange}
              className='block p-1 w-full bg-blue text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer  focus:outline-none
            file:mr-4 file:py-1 file:px-2 file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-600 file:text-white hover:file:bg-blue-700'
            />
          </div>
          <CInput
            placeholder='Tag'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <CButton
            title='Upload'
            disabled={Object.keys(filesData).length !== songsDb.length || !tag}
            onClick={submitFiles}
          />
        </>
      )}
      {/* Customizable bullet list */}
    </div>
  );
};

export default ImportSongs;
