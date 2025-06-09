import { useEffect, useState } from "react";
import type { IOutputVerse, IVerseUnit } from "../../global.dt";
import SelectInput, { type IOptions } from "../../components/select-input";
import { rtfToPlainText, stripStyleTags } from "../../utils/format";
import Button from "../../components/button";
import Modal from "../../components/modal";
import ImportSongs from "./import-songs";
import ActionIcons from "../../components/action-icons";
import DeleteComponent from "../../components/delete-component";
import { toast } from "react-toastify";

const Song = () => {
  const [songText, setSongText] = useState<Record<string, any>>();
  const [songs, setSongs] = useState<Record<string, any>[]>();
  const [srch, setSrch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalOptions, setModalOptions] = useState(1);

  const [formstate, setFormstate] = useState<Record<string, string | number>>(
    {}
  );

  const [formstateSel, setFormstateSel] = useState<Record<string, IOptions>>(
    {}
  );

  const handleCloseModal = async (val?: number) => {
    setOpenModal(false);
    if (val) await fetchsongs();
  };

  console.log({ formstate });
  const fetchWords = async (songId?: number) => {
    songId = songId ?? Number(formstate.songId);

    const songLyrics: Record<string, any> = await window.api.getSongWords(
      songId
    );
    console.log({ songLyrics });
    if (songLyrics) setSongText(songLyrics);
  };

  const fetchsongs = async () => {
    const data = await window.api.getSongTitles(srch);
    console.log({ data });
    if (data) {
      setSongs(data);
      await fetchWords(data[0].rowid);
      setFormstate({ songId: data[0].rowid });
      setFormstateSel({
        ...formstateSel,
        songId: { id: data[0].rowid, title: data[0].title },
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (formstate.delType && formstate.concernId) {
        switch (formstate.delType) {
          case "Tag":
            const tag =
              songs?.find((item) => item.rowid === formstate.songId)?.tag ?? "";

            await window.api.deleteTag(String(tag));
            break;
          case "Song":
            await window.api.deleteSong(Number(formstate.concernId));
            break;
        }
        toast.success("Deleted Successfully");

        await handleCloseModal(1);
      }
    } catch (err) {
      toast.error("Unable to delete the specified item");
    }
  };

  const triggerDeleteSong = (rowid: number) => {
    setFormstate({ ...formstate, delType: "Song", concernId: rowid });
    setModalOptions(2);
    setOpenModal(true);
  };

  const triggerDeleteTag = (rowid: number) => {
    setFormstate({ ...formstate, delType: "Tag", concernId: rowid });
    setModalOptions(2);
    setOpenModal(true);
  };

  const triggerEditSong = () => {};

  const triggerEditTag = () => {};

  const onChangeHandler = (val: string | number, key: string) => {
    setFormstate({ ...formstate, [key]: val });
  };

  const sendMessage = (item: IVerseUnit) =>
    window.electron.ipcRenderer.send("trigger-presentation", {
      title: item.name,
      body: item.text,
    });

  const renderLines = () => {
    console.log({ songText });
    if (!songText) return "";

    return stripStyleTags(songText.words);
  };

  const songOptions =
    songs?.map((item) => ({ id: item.rowid, title: item.title })) ?? [];

  const tag = songs?.find((item) => item.rowid === formstate.songId)?.tag ?? "";

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
        return <ImportSongs closeModal={handleCloseModal} />;
    }
  };

  useEffect(() => {
    fetchsongs();
  }, []);

  useEffect(() => {
    fetchWords();
  }, [formstate]);

  useEffect(() => {
    const timerId = setTimeout(fetchsongs, 500);
    return () => clearTimeout(timerId);
  }, [srch]);

  return (
    <div className='container h-full '>
      <div className='flex gap-[5px] items-center w-full justify-between mb-5 h-[50px] '>
        <div className='flex gap-4 items-center'>
          <SelectInput
            options={songOptions}
            handleChange={(value: string) => onChangeHandler(value, "songId")}
            selected={formstateSel.songId ?? songOptions?.[0]}
            setSelected={(val: IOptions) =>
              setFormstateSel({ ...formstateSel, songId: val })
            }
            setQueryExternal={(value: string) => setSrch(value)}
          />
          <ActionIcons
            className='w-5 h-5'
            concern='Song'
            rowid={Number(formstate.songId)}
            triggerDelete={triggerDeleteSong}
            triggerEdit={triggerEditSong}
          />
        </div>
        <div className='flex gap-[5px] pr-5 items-center'>
          {tag ? (
            <div className='mr-5 bg-white flex items-center gap-4 text-black px-4 py-2'>
              <div className='flex items-center gap-1'>
                <div className='text-xl '>Tag:</div>
                <div className='text-sm  '>{tag}</div>
              </div>
              <ActionIcons
                concern='Tag'
                rowid={Number(formstate.songId)}
                triggerDelete={triggerDeleteTag}
                triggerEdit={triggerEditTag}
              />
            </div>
          ) : null}
          <Button title='Import New Songs' onClick={() => setOpenModal(true)} />
          <Button title='Add Song' />
        </div>
      </div>
      <div className='flex flex-col gap-[2px] h-[calc(100%-60px)] overflow-auto  '>
        <div
          className='prose max-w-none'
          dangerouslySetInnerHTML={{ __html: renderLines() }}
        />
      </div>
      <Modal
        isOpen={openModal}
        onClose={handleCloseModal}
        component={renderModal()}
      />
    </div>
  );
};

export default Song;
