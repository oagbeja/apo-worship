import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

// Handle __dirname in ESM
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const filePath = path.join(__dirname, "db", "tables", "KJV.json");
let jsonData: Record<string, any[]>;

interface Verse {
  book: string;
  chapter: number;
  //   verse: number;
  //   text: string;
  //
}

interface IVerseUnit {
  verse: number;
  chapter: number;
  name: string;
  text: string;
}

interface IOutputVerse {
  chapter: number;
  name: string;
  verses: IVerseUnit[];
  //   verse: number;
  //   text: string;
  //
}

const fetchJsonData = async () => {
  if (!jsonData) {
    const data = await fs.readFile(filePath, "utf-8");
    jsonData = JSON.parse(data);
  }
};

export async function getVerse(
  book: string,
  chapter: number
  // verse: number
): Promise<IOutputVerse | null> {
  try {
    await fetchJsonData();
    const books = jsonData.books;
    const actualBook = books.find((item) => item.name === book);
    // console.log({ actualBook });
    if (actualBook && actualBook.chapters instanceof Array) {
      const actualChapter = actualBook.chapters.find(
        (item: IOutputVerse) => item.chapter === chapter
      );
      // console.log({ actualChapter });

      if (actualChapter) return actualChapter;
    }
    console.log({ jsonLength: jsonData.books.length });
    return null;
    // return { book: "tell", chapter: 10, verse: 10, text: "" };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getBooks(): Promise<Record<string, any>[]> {
  try {
    await fetchJsonData();
    const data = jsonData.books.map((item) => ({
      name: item.name,
      numberOfChapters: item?.chapters?.length ?? 0,
    }));

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
