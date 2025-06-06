// @ts-ignore
import rtfToHTML from "@iarna/rtf-to-html";

/**
 * Converts an RTF string to HTML using @iarna/rtf-to-html.
 * @param rtfString The RTF string to convert.
 * @returns A promise that resolves to the parsed HTML string.
 */
export function convertRtfToHtml(rtfString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    rtfToHTML.fromString(rtfString, (err: any, html: any) => {
      if (err) {
        console.error("Error parsing RTF:", err);
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
}
