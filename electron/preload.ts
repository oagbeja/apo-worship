import { contextBridge, ipcRenderer } from "electron";
import { uploadImage } from "./db/services/image-services";

contextBridge.exposeInMainWorld("api", {
  getVerse: (book: string, chapter: number, verse: number) =>
    ipcRenderer.invoke("get-verse", book, chapter, verse),
  getBooks: () => ipcRenderer.invoke("get-books"),
  getSongTitles: (srch?: string) => ipcRenderer.invoke("get-song-titles", srch),
  getSongWords: (rowId: number) => ipcRenderer.invoke("get-song-words", rowId),
  mergeFiles: (tag: string) => ipcRenderer.invoke("merge-files", tag),
  uploadFile: (filename: string, content: ArrayBuffer, type?: string) =>
    ipcRenderer.invoke("upload-file", filename, content, type),
  deleteSong: (rowid: number) => ipcRenderer.invoke("delete-song", rowid),
  deleteTag: (tag: string) => ipcRenderer.invoke("delete-tag", tag),
  createSong: (title: string, words: string) =>
    ipcRenderer.invoke("create-song", title, words),
  updateSong: (title: string, words: string, rowid: number) =>
    ipcRenderer.invoke("update-song", title, words, rowid),
  uploadImage: (buffer: Buffer, tag: string) =>
    ipcRenderer.invoke("upload-image", buffer, tag),
  getImages: (srch?: string) => ipcRenderer.invoke("get-images", srch),
  deleteImage: (rowid: number) => ipcRenderer.invoke("delete-image", rowid),
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (...args: any[]) => void) =>
      ipcRenderer.on(channel, (_, ...args) => func(...args)),
  },
});
