import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getVerse: (book: string, chapter: number, verse: number) =>
    ipcRenderer.invoke("get-verse", book, chapter, verse),
});

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, func: (...args: any[]) => void) =>
      ipcRenderer.on(channel, (_, ...args) => func(...args)),
  },
});
