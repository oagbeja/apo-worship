import { app } from "electron";
import path from "path";
import fs from "fs/promises";

export const saveBufferToFile = async (
  filename: string,
  arrayBuffer: ArrayBuffer,
  type:
    | "home"
    | "appData"
    | "userData"
    | "sessionData"
    | "temp"
    | "exe"
    | "module"
    | "desktop"
    | "documents"
    | "downloads"
    | "music"
    | "pictures"
    | "videos"
    | "recent"
    | "logs"
    | "crashDumps" = "userData"
) => {
  const userDataPath = app.getPath(type);
  const filePath = path.join(userDataPath, filename);
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  return filePath;
};

export const deleteTempFile = async (filename: string) => {
  const tempDir = app.getPath("temp");
  const filePath = path.join(tempDir, filename);

  try {
    await fs.unlink(filePath);
    console.log(`Deleted temp file: ${filePath}`);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn("File not found, nothing to delete");
    } else {
      console.error("Error deleting file:", err);
    }
  }
};
