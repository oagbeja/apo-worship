import path from "path";
import fs from "fs/promises";
import fs_ from "fs";
import Database from "better-sqlite3";
import { app } from "electron";

const dbPath = path.join(app.getPath("userData"), "Database");
if (!fs_.existsSync(dbPath)) {
  fs_.mkdirSync(dbPath);
}

const imageDBPath = path.join(dbPath, "Images.db");
const imageFilePath = path.join(app.getPath("userData"), "Images");
const dbImages = new Database(imageDBPath);
dbImages
  .prepare(
    `CREATE TABLE IF NOT EXISTS images (
    rowid INTEGER PRIMARY KEY AUTOINCREMENT, 
    tag TEXT NOT NULL,
    url TEXT NOT NULL   
);
`
  )
  .run();

if (!fs_.existsSync(imageFilePath)) {
  fs_.mkdirSync(imageFilePath);
}

export const uploadImage = async (buffer: Buffer, tag: string) => {
  try {
    tag = tag.trim();
    const row: any = dbImages
      .prepare("SELECT * FROM images where tag = ? limit 1")
      .get(tag);
    if (row) throw `This ${tag} tag already exist.`;

    tag = `${tag}.jpg`;
    const url = path.join(imageFilePath, tag);
    fs_.writeFileSync(url, Buffer.from(buffer));

    dbImages
      .prepare("INSERT INTO images (url, tag) VALUES (?, ?)")
      .run(url, tag);

    return true;
  } catch (err) {
    throw err;
  }
};

export const getImages = (srch?: string) => {
  try {
    const whereStr =
      srch && srch.trim().length
        ? ` where TRIM(tag) like '${srch.trim()}%'`
        : "";

    return dbImages
      .prepare(`SELECT * FROM images ${whereStr} ORDER BY TRIM(tag) LIMIT 10`)
      .all();
  } catch (err) {
    throw err;
  }
};

export const deleteImage = async (rowid: number) => {
  try {
    const row: any = dbImages
      .prepare("SELECT * FROM images where rowid = ? ")
      .get(rowid);
    if (row?.url) {
      if (fs_.existsSync(row.url)) {
        fs_.unlinkSync(row.url);
        console.log("File deleted successfully");
      }
    }

    dbImages.prepare("DELETE FROM images WHERE rowid = ?").run(rowid);
    console.log("File deleted successfully from db");

    return true;
  } catch (err) {
    throw err;
  }
};
