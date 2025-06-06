import { useEffect, useState } from "react";
import type { IOutputVerse, IVerseUnit } from "../../global.dt";
import SelectInput, { type IOptions } from "../../components/select-input";
import { rtfToPlainText, stripStyleTags } from "../../utils/format";

const Song = () => {
  const [songText, setSongText] = useState<Record<string, any>>();
  const [songs, setSongs] = useState<Record<string, any>[]>();
  const [srch, setSrch] = useState("");

  const [formstate, setFormstate] = useState<Record<string, string | number>>(
    {}
  );

  const [formstateSel, setFormstateSel] = useState<Record<string, IOptions>>(
    {}
  );

  console.log({ formstate });
  const fetchWords = async (songId?: number) => {
    songId = songId ?? Number(formstate.songId);

    const songLyrics: Record<string, any> = await window.api.getSongWords(
      songId
    );

    if (songLyrics) setSongText(songLyrics);
  };

  const fetchsongs = async () => {
    const data = await window.api.getSongTitles(srch);
    console.log({ data });
    if (data) {
      setSongs(data);
      await fetchWords(data[0].rowid);
      setFormstate({ songId: data[0].rowid });
    }
  };

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
      <div className='flex gap-[5px] items-center mb-5 h-[50px] '>
        <SelectInput
          options={songOptions}
          handleChange={(value: string) => onChangeHandler(value, "songId")}
          selected={formstateSel.songId ?? songOptions?.[0]}
          setSelected={(val: IOptions) =>
            setFormstateSel({ ...formstateSel, songId: val })
          }
          setQueryExternal={(value: string) => setSrch(value)}
        />
      </div>
      <div className='flex flex-col gap-[2px] h-[calc(100%-60px)] overflow-auto  '>
        <div
          className='prose max-w-none'
          dangerouslySetInnerHTML={{ __html: renderLines() }}
        />
      </div>
    </div>
  );
};

export default Song;
