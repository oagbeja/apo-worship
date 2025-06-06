import { useEffect, useState } from "react";
import type { IOutputVerse, IVerseUnit } from "../../global.dt";
import SelectInput, { type IOptions } from "../../components/select-input";

const Bible = () => {
  const [bibleText, setBibleText] = useState<IOutputVerse>();
  const [books, setBooks] = useState<Record<string, any>[]>();

  const [formstate, setFormstate] = useState<Record<string, string | number>>(
    {}
  );
  const [formstateSel, setFormstateSel] = useState<Record<string, IOptions>>(
    {}
  );
  console.log({ formstate });
  const fetchVerse = async (book?: string, chapter?: number) => {
    book = book ?? String(formstate.book);

    chapter = chapter ?? Number(formstate.chapter);
    if (isNaN(chapter)) chapter = 1;
    console.log({ book, chapter });
    const verseText: IOutputVerse | null = await window.api.getVerse(
      book,
      chapter
    );
    console.log("Verse:", verseText);
    if (verseText) setBibleText(verseText);
  };

  const fetchBooks = async () => {
    const data = await window.api.getBooks();
    console.log({ data });
    if (data) {
      setBooks(data);
      await fetchVerse(data[0].name, 1);
      setFormstate({ book: data[0].name, chapter: 1 });
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
    if (!bibleText) return null;
    return bibleText.verses.map((item, index) => {
      return (
        <div
          onClick={() => sendMessage(item)}
          className={`flex gap-[10px] cursor-pointer border-[1px] ${
            item.verse >= Number(formstate.verse) &&
            (formstate.toVerse
              ? item.verse <= Number(formstate.toVerse)
              : item.verse == Number(formstate.verse))
              ? "bg-gray-300"
              : ""
          } `}
          key={`Bible${index}`}
        >
          <div className='w-[200px]'>{item.name}</div>
          <div className='flex-1'>{item.text}</div>
        </div>
      );
    });
  };

  const bookOptions =
    books?.map((item) => ({ id: item.name, title: item.name })) ?? [];

  const chapterOptionsFn = (): IOptions[] => {
    const chosenBook = (books ?? []).find((item, idx) =>
      formstate.book ? formstate.book === item.name : idx === 0
    );
    if (chosenBook) {
      return new Array(chosenBook.numberOfChapters)
        .fill(0)
        .map((_, idx) => ({ id: idx + 1, title: `${idx + 1}` }));
    }
    return [{ id: 1, title: "1" }];
  };

  const chapterOptions = chapterOptionsFn();

  const verseOptionsFn = (): IOptions[] => {
    return (
      bibleText?.verses?.map((item) => ({
        id: item.verse,
        title: String(item.verse),
      })) ?? [{ id: 1, title: "1" }]
    );
  };

  const verseOptions = verseOptionsFn();
  const toVerseOptionsFn = (): IOptions[] => {
    return (
      bibleText?.verses
        ?.filter((item) => item.verse >= (Number(formstate.verse) ?? 0))
        .map((item) => ({
          id: item.verse,
          title: String(item.verse),
        })) ?? []
    );
  };

  const toVerseOptions = toVerseOptionsFn();

  // useEffect(() => {
  //   fetchVerse();
  // }, []);
  useEffect(() => {
    fetchBooks();
  }, []);
  useEffect(() => {
    fetchVerse();
  }, [formstate]);

  useEffect(() => {
    if (Number(formstate.verse) > Number(formstate.toVerse)) {
      setFormstate({ ...formstate, toVerse: formstate.verse });
      setFormstateSel({
        ...formstateSel,
        toVerse: { id: formstate.verse, title: String(formstate.verse) },
      });
    }
  }, [formstate.verse]);

  useEffect(() => {
    setFormstate({ ...formstate, verse: 1, toVerse: 1 });
    setFormstateSel({
      ...formstateSel,
      verse: { id: 1, title: String(1) },
      toVerse: { id: 1, title: String(1) },
    });
  }, [formstate.chapter]);

  useEffect(() => {
    setFormstate({ ...formstate, verse: 1, toVerse: 1, chapter: 1 });
    setFormstateSel({
      ...formstateSel,
      verse: { id: 1, title: String(1) },
      toVerse: { id: 1, title: String(1) },
      chapter: { id: 1, title: String(1) },
    });
  }, [formstate.book]);

  return (
    <div className='container h-full '>
      <div className='flex gap-[5px] items-center mb-5 h-[55px]'>
        <SelectInput
          options={bookOptions}
          handleChange={(value: string) => onChangeHandler(value, "book")}
          selected={formstateSel.book ?? bookOptions?.[0]}
          setSelected={(val: IOptions) =>
            setFormstateSel({ ...formstateSel, book: val })
          }
        />
        {/* chapter */}
        <SelectInput
          options={chapterOptions}
          handleChange={(value: string) => onChangeHandler(value, "chapter")}
          setSelected={(val: IOptions) =>
            setFormstateSel({ ...formstateSel, chapter: val })
          }
          selected={formstateSel.chapter ?? chapterOptions?.[0]}
          bodyClass='w-20'
        />
        {/* Verse */}
        <SelectInput
          options={verseOptions}
          handleChange={(value: string) => onChangeHandler(value, "verse")}
          setSelected={(val: IOptions) =>
            setFormstateSel({ ...formstateSel, verse: val })
          }
          selected={formstateSel.verse ?? verseOptions?.[0]}
          bodyClass='w-20'
        />
        -TO-
        {/* To Verse */}
        <SelectInput
          options={toVerseOptions}
          handleChange={(value: string) => onChangeHandler(value, "toVerse")}
          setSelected={(val: IOptions) =>
            setFormstateSel({ ...formstateSel, toVerse: val })
          }
          selected={formstateSel.toVerse ?? toVerseOptions?.[0]}
          bodyClass='w-20'
        />
      </div>

      <div className=' flex flex-col gap-[2px] h-[calc(100%-65px)] overflow-auto '>
        {renderLines()}
      </div>
    </div>
  );
};

export default Bible;
