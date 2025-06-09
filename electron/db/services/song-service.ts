import path from "path";
import fs from "fs/promises";
import Database from "better-sqlite3";
import { app } from "electron";
import { convertRtfToHtml } from "../../utils/format";

const aposPath = path.join(app.getPath("userData"), "ApoSongs.db");
const dbAposSongs = new Database(aposPath);
dbAposSongs
  .prepare(
    `CREATE TABLE IF NOT EXISTS songs (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT,    
    description TEXT,
    tag TEXT,
    words TEXT NOT NULL,
    title TEXT
);
`
  )
  .run();

// const wordsPath = path.join(app.getPath("documents"), "SongWords.db");
// const dbWords = new Database(wordsPath);
// dbWords.prepare(`CREATE TABLE IF NOT EXISTS word (
//     rowid INTEGER PRIMARY KEY,
//     song_id INTEGER NOT NULL,
//     words TEXT NOT NULL, -- RTF content
//     slide_uids TEXT NOT NULL, -- Comma-separated UUIDs
//     slide_layout_revisions TEXT, -- Nullable
//     slide_revisions TEXT -- Nullable
// );
// `);

// const songPath = path.join(app.getPath("documents"), "Songs.db");
// const dbSongs = new Database(songPath);
// dbSongs.prepare(`CREATE TABLE IF NOT EXISTS song (
//   rowid INTEGER PRIMARY KEY AUTOINCREMENT,
//   song_item_uid TEXT NOT NULL,
//   song_rev_uid TEXT,
//   song_uid TEXT NOT NULL,
//   title TEXT,
//   author TEXT,
//   copyright TEXT,
//   administrator TEXT,
//   description TEXT,
//   tags TEXT,
//   reference_number TEXT,
//   vendor_id INTEGER,
//   presentation_id INTEGER,
//   layout_revision INTEGER,
//   revision INTEGER
// );
// `);

export const getSongTitles = (srch?: string) => {
  const whereStr =
    srch && srch.trim().length
      ? ` where TRIM(title) like '${srch.trim()}%'`
      : "";
  return dbAposSongs
    .prepare(`SELECT * FROM songs ${whereStr} ORDER BY TRIM(title) LIMIT 5`)
    .all();
};

export const getSongWords = async (rowId: number) => {
  const row: any = dbAposSongs
    .prepare("SELECT * FROM songs where rowid = ?")
    .get(rowId);
  // if (row?.words) {
  //   row.words = await convertRtfToHtml(row.words);
  // }
  return row;
};

export const mergeFiles = async (tag: string) => {
  try {
    // check if tag exist..
    const row: any = dbAposSongs
      .prepare("SELECT * FROM songs where tag = ? limit 1")
      .get(tag);
    if (row) throw `This ${tag} tag already exist.`;

    const dbExternalSongs = new Database(
      path.join(app.getPath("temp"), "Songs.db")
    );
    const dbExternalSongWords = new Database(
      path.join(app.getPath("temp"), "SongWords.db")
    );

    const rowExternalSongTitles: any = dbExternalSongs
      .prepare("SELECT * FROM song")
      .all();
    const rowExternalSongWords: any = dbExternalSongWords
      .prepare("SELECT * FROM word")
      .all();

    const insert = dbAposSongs.prepare(
      "INSERT INTO songs (title, words,tag) VALUES (?, ?, ?)"
    );
    const insertMany = dbAposSongs.transaction((songs) => {
      for (const song of songs) {
        insert.run(song.title, song.words, song.tag);
      }
    });

    const arrSongs: any = [];
    for (const item of rowExternalSongTitles) {
      const foundWords = rowExternalSongWords.find(
        (wrd: any) => wrd.rowid === item.rowid
      );
      if (foundWords) {
        const songwords = await convertRtfToHtml(foundWords.words);
        // console.log({ songwords });
        arrSongs.push({ title: item.title, words: songwords, tag: tag.trim() });
      }
    }

    insertMany(arrSongs);
    return true;
  } catch (err) {
    throw err;
  }
};

export const deleteSong = async (rowid: number) => {
  try {
    dbAposSongs.prepare("DELETE FROM songs WHERE rowid = ?").run(rowid);
    return true;
  } catch (err) {
    throw err;
  }
};

export const deleteTag = async (tag: string) => {
  try {
    // console.log({ tag }, "to be deleted");
    dbAposSongs.prepare("DELETE FROM songs WHERE tag = ?").run(tag);
    return true;
  } catch (err) {
    throw err;
  }
};

export const createSong = (title: string, words: string) => {
  try {
    dbAposSongs
      .prepare("INSERT INTO songs (title, words,tag) VALUES (?, ?, ?)")
      .run(title, words, "Internal");
    return true;
  } catch (err) {
    throw err;
  }
};

export const updateSong = (title: string, words: string, rowid: number) => {
  try {
    dbAposSongs
      .prepare("update songs set title = ? , words = ? where rowid = ?")
      .run(title, words, rowid);
    return true;
  } catch (err) {
    throw err;
  }
};
