// import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import Database from "better-sqlite3";
import { app } from "electron";

// Handle __dirname in ESM
// const filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(filename);

// DB path
const dbPath = path.resolve(__dirname, "../tables/kjv_.sqlite");
console.log({ dbPath });
// Connect
// const db = new Database(dbPath);
// db.pragma("journal_mode = WAL");

const filePath = path.join(__dirname, "..", "tables", "KJV.json");
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
    const strPath = path.join(app.getPath("documents"), "Songs.db");
    console.log({ strPath });
    const db = new Database(strPath);
    // const tables = db
    //   .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    //   .all(); //metadata, book, verse/// revision song sqlite_sequence
    //      { name: 'word_key' },
    // { name: 'word_list' },
    // { name: 'sqlite_sequence' }
    const tables = db.prepare("SELECT * FROM song ").all();
    console.log("Tables in DB:", tables); // replace `1` with the desired book ID

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
