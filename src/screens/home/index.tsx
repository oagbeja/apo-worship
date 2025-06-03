import { useEffect, useState } from "react";
import type { IOutputVerse, IVerseUnit } from "../../global.dt";

const Home = () => {
  const [bibleText, setBibleText] = useState<IOutputVerse>();

  const fetchVerse = async () => {
    console.log("Verse---");
    const verseText: IOutputVerse | null = await window.api.getVerse(
      "Genesis",
      1
    );
    console.log("Verse:", verseText);
    if (verseText) setBibleText(verseText);
  };

  const sendMessage = (item: IVerseUnit) =>
    window.electron.ipcRenderer.send("trigger-presentation", {
      title: item.name,
      body: item.text,
    });

  const renderLines = () => {
    if (!bibleText) return null;
    return bibleText.verses.map((item, index) => {
      return (
        <div
          onClick={() => sendMessage(item)}
          className='flex gap-[10px] cursor-pointer border-[1px]'
          key={`Bible${index}`}
        >
          <div className='w-[10%]'>{item.name}</div>
          <div>{item.text}</div>
        </div>
      );
    });
  };

  useEffect(() => {
    fetchVerse();
  }, []);
  return (
    <div className='container'>
      Home : Genesis 1
      <div className='flex flex-col gap-[20px]'>{renderLines()}</div>
    </div>
  );
};

export default Home;
