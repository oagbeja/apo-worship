import { deleteTempFile, saveBufferToFile } from "../../utils/file";

export const uploadFile = async (
  filename: string,
  content: ArrayBuffer,
  type: "temp" | "userData" = "temp"
) => {
  try {
    await deleteTempFile(filename);
    return await saveBufferToFile(filename, content, type);
  } catch (err: any) {
    throw new Error(err);
  }
};
