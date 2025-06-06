import path from "path";
import fs from "fs/promises";
import Database from "better-sqlite3";
import { app } from "electron";
import { convertRtfToHtml } from "../../utils/format";

const wordsPath = path.join(app.getPath("documents"), "SongWords.db");
const dbWords = new Database(wordsPath);
dbWords.prepare(`CREATE TABLE IF NOT EXISTS word (
    rowid INTEGER PRIMARY KEY,
    song_id INTEGER NOT NULL,
    words TEXT NOT NULL, -- RTF content
    slide_uids TEXT NOT NULL, -- Comma-separated UUIDs
    slide_layout_revisions TEXT, -- Nullable
    slide_revisions TEXT -- Nullable
);
`);

const songPath = path.join(app.getPath("documents"), "Songs.db");
const dbSongs = new Database(songPath);
dbSongs.prepare(`CREATE TABLE IF NOT EXISTS song (
  rowid INTEGER PRIMARY KEY AUTOINCREMENT,
  song_item_uid TEXT NOT NULL,
  song_rev_uid TEXT,
  song_uid TEXT NOT NULL,
  title TEXT,
  author TEXT,
  copyright TEXT,
  administrator TEXT,
  description TEXT,
  tags TEXT,
  reference_number TEXT,
  vendor_id INTEGER,
  presentation_id INTEGER,
  layout_revision INTEGER,
  revision INTEGER
);
`);

export const getSongTitles = (srch?: string) => {
  const whereStr =
    srch && srch.trim().length
      ? ` where TRIM(title) like '${srch.trim()}%'`
      : "";
  return dbSongs
    .prepare(`SELECT * FROM song ${whereStr} ORDER BY TRIM(title) LIMIT 5`)
    .all();
};

export const getSongWords = async (rowId: number) => {
  const row: any = dbWords
    .prepare("SELECT * FROM word where rowid = ?")
    .get(rowId);
  if (row?.words) {
    row.words = await convertRtfToHtml(row.words);
  }
  return row;
};
