export interface IOutputVerse {
  chapter: number;
  name: string;
  verses: IVerseUnit[];
}
export interface IVerseUnit {
  verse: number;
  chapter: number;
  name: string;
  text: string;
}

declare global {
  interface Window {
    api: {
      getVerse(book: string, chapter: number): Promise<IOutputVerse | null>;
    };
    electron: {
      ipcRenderer: {
        send: Function;
        on: Function;
      };
    };
  }
}
