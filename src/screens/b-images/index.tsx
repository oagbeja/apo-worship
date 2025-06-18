import { useEffect, useState } from "react";
import ActionIcons from "../../components/action-icons";
import CButton from "../../components/button";
import SelectInput, { IOptions } from "../../components/select-input";
import ImageCropUploader from "../../components/image-cropper";
import Modal from "../../components/modal";
import UploadImage from "./upload-image";
import DeleteComponent from "../../components/delete-component";
import { toast } from "react-toastify";

const BImages = () => {
  const [srch, setSrch] = useState("");
  const [bimages, setBimages] = useState<Record<string, any>[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalOptions, setModalOptions] = useState(1);

  const [formstate, setFormstate] = useState<Record<string, string | number>>(
    {}
  );

  const [formstateSel, setFormstateSel] = useState<Record<string, IOptions>>(
    {}
  );

  const onChangeHandler = (val: string | number, key: string) => {
    setFormstate({ ...formstate, [key]: val });
  };

  const handleCloseModal = async (val?: number) => {
    setOpenModal(false);

    if (val) await fetchImages(false);
  };

  const fetchImages = async (searchFlag = true) => {
    const data = await window.api.getImages(searchFlag ? srch : undefined);
    console.log({ data });
    if (data) {
      setBimages(data);
      // await fetchWords(data[0]?.rowid);
      setFormstate({ imageId: data[0]?.rowid });
      setFormstateSel({
        ...formstateSel,
        imageId: { id: data[0]?.rowid, title: removeExt(data[0]?.tag) },
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (formstate.concernId) {
        await window.api.deleteImage(Number(formstate.concernId));
        toast.success("Deleted Successfully");
      }

      await handleCloseModal(1);
    } catch (err) {
      console.log(err);
      toast.error("Unable to delete the specified item");
    }
  };

  const renderModal = () => {
    switch (modalOptions) {
      case 2:
        return (
          <DeleteComponent
            title={String(formstate.delType ?? "")}
            handleDelete={handleDelete}
            closeModal={handleCloseModal}
          />
        );
      default:
        return <UploadImage closeModal={handleCloseModal} />;
    }
  };

  const sendToDisplay = async (rowid: number) => {
    if (!Array.isArray(bimages)) return null;

    async function urlToBase64(url: string): Promise<string> {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    const bimage = bimages.find((item) => item.rowid === rowid);
    if (bimage) {
      const base64 = await urlToBase64(bimage.url);
      window.electron.ipcRenderer.send("trigger-display", {
        value: base64,
        type: "background-image",
        metadata: true,
      });
    }
  };

  const renderImages = () => {
    if (!Array.isArray(bimages)) return null;
    return bimages.map((item, index) => (
      <div
        key={`Images${item.tag}${index}`}
        className='flex flex-col w-[150px] rounded-xl '
      >
        <img src={item.url} alt={item.tag} className='w-full object-cover' />
        <div className='bg-white flex justify-between items-center p-2'>
          <div className='capitalize text-black'>{removeExt(item.tag)}</div>
          <ActionIcons
            rowid={item.rowid}
            concern={removeExt(item.tag)}
            display={["delete", "display"]}
            triggerDelete={() => {
              setFormstate({
                ...formstate,
                delType: `Tag ${removeExt(item.tag)}`,
                concernId: item.rowid,
              });
              setModalOptions(2);
              setOpenModal(true);
            }}
            triggerDisplay={sendToDisplay}
          />
        </div>
      </div>
    ));
  };

  const removeExt = (filename: string) => {
    let fileArr = filename.split(".");
    fileArr =
      fileArr.length > 1 ? fileArr.slice(0, fileArr.length - 1) : fileArr;
    return fileArr.join(".");
  };

  const imageOptions =
    bimages?.map((item) => ({ id: item.rowid, title: removeExt(item.tag) })) ??
    [];

  useEffect(() => {
    const timerId = setTimeout(fetchImages, 500);
    return () => clearTimeout(timerId);
  }, [srch]);

  return (
    <div className='container h-full '>
      <div className='flex gap-[5px] items-center w-full justify-between mb-5 h-[50px] '>
        <div className='flex gap-4 items-center'>
          <SelectInput
            options={imageOptions}
            handleChange={(value: string) => onChangeHandler(value, "imageId")}
            selected={formstateSel.imageId ?? imageOptions?.[0]}
            setSelected={(val: IOptions) =>
              setFormstateSel({ ...formstateSel, imageId: val })
            }
            setQueryExternal={(value: string) => setSrch(value)}
          />
        </div>
        <div className='flex gap-[5px] pr-5 items-center'>
          <CButton
            title='Upload Image'
            onClick={() => {
              setOpenModal(true);
              setModalOptions(1);
            }}
          />
        </div>
      </div>
      <div className='flex flex-wrap  h-[calc(100%-60px)] overflow-auto gap-2  '>
        {renderImages()}
      </div>
      <Modal
        className={modalOptions >= 3 ? "w-[80%]" : ""}
        isOpen={openModal}
        onClose={handleCloseModal}
        component={renderModal()}
      />
    </div>
  );
};

export default BImages;
