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
      uploadFile(
        filename: string,
        content: ArrayBuffer,
        type?: string
      ): Promise<string>;
      deleteSong(rowid: number): Promise<boolean>;
      deleteTag(tag: string): Promise<boolean>;
      mergeFiles(tag: string): Promise<boolean>;
      createSong(title: string, words: string): Promise<boolean>;
      updateSong(title: string, words: string, rowid: number): Promise<boolean>;
      uploadImage(buffer: Buffer, tag: string): Promise<boolean>;
      getImages(srch?: string): Promise<Record<string, any>[]>;
      deleteImage(rowid: number): Promise<boolean>;
    };
    electron: {
      ipcRenderer: {
        send: Function;
        on: Function;
        removeListener: Function;
      };
    };
  }
}
