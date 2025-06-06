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
      getBooks(): Promise<Record<string, any>[]>;
      getSongTitles(srch?: string): Promise<Record<string, any>[]>;
      getSongWords(rowId: number): Promise<Record<string, any>>;
    };
    electron: {
      ipcRenderer: {
        send: Function;
        on: Function;
      };
    };
  }
}
